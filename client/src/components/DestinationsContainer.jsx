import React, { useEffect, useState } from 'react';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import styled from 'styled-components';
import _cloneDeep from 'lodash/cloneDeep';
import { DESTINATIONS_SUBSCRIPTION, TRIGGER_DESTINATIONS, UPDATE_DESTINATION } from '../queries/destinations';
import { listFromMap, filterList, timeSince, updateDestinationStatus } from '../utils/destinationsUtils';
import Filters from './Filters';
import {ReactComponent as InfoIcon} from '../svg/information-icon.svg';

const FILTER_OPTS = [
  {name: 'CREATED', label: 'Open Orders', value: false, message: "Orders waiting to be cooked"},
  {name: 'COOKED', label: 'Ready for Pickup', value: false, duration: 7, message: "Orders ready for pickup"},
  {name: 'ALL', label: 'Show All Orders', value: false, message: "Showing all orders"}
];

const STATUS_OPTS = [
  {value: 'CREATED', label: 'Created'}, 
  {value: 'COOKED', label: 'Cooked'},
  {value: 'DELIVERED', label: 'Delivered'},
  {value: 'CANCELLED', label: 'Cancelled'},
  {value: 'DRIVER_RECEIVED', label: 'Driver Received'}
];

const DEFAULT_DESTINATIONS = {
  list: [],
  map: new Map()
};

const DestinationsWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const DestinationsHeader = styled.div`
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #efefef;
  display: flex;
`;

const DestinationsList = styled.ul`
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const DestinationsItem = styled.li`
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #d4d4d4;
  background-color: ${({ $header }) => $header ? '#f0f0f0' : 'none'};
`;

const DestinationsItemCell = styled.div`
  display: flex;
  padding: 5px 20px;
  width: ${({ $address }) => $address ? "40%" : "15%"};
  align-items: center;
  position: relative;
  justify-content: ${({$center}) => $center ? 'center' : 'flex-start'};
`;

const StatusSelect = styled.select`
  border: 0;
  background: none;
`;

const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  justify-content: center;
`;

const Info = styled(InfoIcon)`
  width: 30px;
`;

const HistoryMenu = styled.ul`
  position: absolute;
  list-style: none;
  z-index: 3;
  padding: 10px;
  background: #fff;
  border: #ccc 1px solid;
  box-shadow: #000 0 0 0 1px;
  border-radius: 3px;
  top: 30px;
`;

const HistoryMenuItem = styled.li`
  padding: 3px;
  border: none;
  border-bottom: 1px solid #efefef;
  font-size: 11px;
`;

// List of Previous Events
function HistoryList({destination, showHistory, openHistory}) {
  let open = openHistory === destination.id;

  return (
    <InfoWrapper >
      {destination.history && <Info onClick={() => showHistory(destination.id)}/>}
      {open &&<HistoryMenu>
        {destination.history && destination.history.map((h, i) => <HistoryMenuItem key={destination.id + i}>{h.event_name} {timeSince(h.updated_at)} seconds ago</HistoryMenuItem>)} 
      </HistoryMenu>}
    </InfoWrapper>
  )
}

// Menu To Update Event_Status
function StatusMenu({destination}) {
  const [updateDestination] = useMutation(UPDATE_DESTINATION);

  function sendUpdatedStatus(e) {
    if (e.target.value === destination.event_name) return;

    let data = {
      destination: destination.destination,
      name: destination.name,
      event_name: e.target.value,
      id: destination.id
    }
    
    updateDestination({variables: {destination: data}});
  }

  return (
    <StatusSelect onChange={sendUpdatedStatus} value={destination.event_name}>
      {STATUS_OPTS.map(item => (
        <option
          key={item.value}
          value={item.value}
        >
          {item.label}
        </option>
      ))}
    </StatusSelect>
  );
}

// Destinations Table
export default function DestinationsContainer() {
  // Destinations Map to maintain order
  // List to filter and map to render
  const [Destinations, updateDestinations] = useState(DEFAULT_DESTINATIONS);
  const [filters, updateFilters] = useState(FILTER_OPTS);
  const [openHistory, updateOpenHistory] = useState(null);

  function showHistory(id) {
    let next;

    if (openHistory === id) {
      next = null;
    } else {
      next = id;
    }

    updateOpenHistory(next);
  }

  // Subscribe to graphql socket
  useSubscription( DESTINATIONS_SUBSCRIPTION, {
    onSubscriptionData: ({subscriptionData}) => {
      let map = _cloneDeep(Destinations.map);
      updateDestinationStatus(subscriptionData.data.destinationAdded, map);
      updateDestinations({ map, list: filterList(listFromMap(map), filters) })
    }
  });

  // Used only to trigger mocked badkend
  useQuery(TRIGGER_DESTINATIONS);
  
  // Watch for Filter Updates
  useEffect(() => {
    updateDestinations(prev => {
      return { map: prev.map, list: filterList(listFromMap(prev.map), filters) };
    });

  }, [filters]);
  
  return (
    <>
      <DestinationsHeader>
        <Filters
          filters={filters}
          updateFilters={updateFilters}
        />
      </DestinationsHeader>
      <DestinationsWrap> 
        <DestinationsList>
        <DestinationsItem $header>
          <DestinationsItemCell $address>Address</DestinationsItemCell>
          <DestinationsItemCell>Name</DestinationsItemCell>
          <DestinationsItemCell> Status </DestinationsItemCell>
          <DestinationsItemCell>Last Update</DestinationsItemCell>
          <DestinationsItemCell $center> History</DestinationsItemCell>
        </DestinationsItem>
          {Destinations.list && Destinations.list.map(d => {
            let since = timeSince(d.updated_at, true);

            return (
              <DestinationsItem key={d.id}>
                <DestinationsItemCell $address>{d.destination}</DestinationsItemCell>
                <DestinationsItemCell>{d.name}</DestinationsItemCell>
                <DestinationsItemCell> <StatusMenu destination={d} /> </DestinationsItemCell>
                <DestinationsItemCell>{since}</DestinationsItemCell>
                <DestinationsItemCell $center> <HistoryList destination={d} showHistory={showHistory} openHistory={openHistory}/></DestinationsItemCell>
              </DestinationsItem>
            );
          })}
        </DestinationsList>
      </DestinationsWrap>
    </>
  );
}