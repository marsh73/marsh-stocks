import '@testing-library/jest-dom';
import { json } from 'body-parser';
import _cloneDeep from 'lodash/cloneDeep';

import { 
  listFromMap, 
  filterList,
  timeSince,
  updateDestinationStatus
} from './destinationsUtils';

const D_ONE = {
  "destination": "801 Toyopa Dr, Pacific Palisades, CA 90272",
  "event_name": "DELIVERED",
  "id": "4b76edbf",
  "name": "Cheese pizza",
  "sent_at_second": 4
};

const D_TWO = {
  "destination": "801 Toyopa Dr, Pacific Palisades, CA 90272",
  "event_name": "CREATED",
  "id": "f7711c3b",
  "name": "Mushroom pizza",
  "sent_at_second": 7
};

const D_THREE = {
  "destination": "14622 Demblon St, Baldwin Park, CA 91706",
  "event_name": "CANCELLED",
  "id": "1c891522",
  "name": "Vanilla ice cream",
  "sent_at_second": 27
};

const D_FOUR = {
  "destination": "14622 Demblon St, Baldwin Park, CA 91706",
  "event_name": "COOKED",
  "id": "1c891522",
  "name": "Vanilla ice cream",
  "sent_at_second": 21
};

describe('Destination Utils', () => {
  let DEFAULT;
  let Filters;

  beforeEach(() => {
    DEFAULT = {
      list: [],
      map: new Map()
    };

    Filters = [
      {name: 'CREATED', value: false},
      {name: 'COOKED', value: false, duration: 7},
      {name: 'CANCELLED', value: false},
      {name: 'DRIVER_RECEIVED', value: false},
      {name: 'DELIVERED', value: false}
    ];
  })

  it('should take a Map() and return array', () => {
    let map = DEFAULT.map;
    map.set(D_ONE.id, D_ONE);
    map.set(D_TWO.id, D_TWO);

    let list = [D_ONE, D_TWO];
    expect(listFromMap(map)).toEqual(list);
  });


  it('should filter out all but current by default', () => {
    let map = DEFAULT.map;
    map.set(D_ONE.id, D_ONE);
    map.set(D_TWO.id, D_TWO);
    map.set(D_THREE.id, D_THREE);
    map.set(D_FOUR.id, D_FOUR);

    let list = listFromMap(map);
    let filtered = filterList(list, Filters);

    expect(filtered.length).toEqual(2);
    expect(filtered[0].id).toEqual("f7711c3b");
    expect(filtered[1].id).toEqual('1c891522');
  });

  it('should should filter list from filters', () => {
    let map = DEFAULT.map;
    map.set(D_ONE.id, D_ONE);
    map.set(D_TWO.id, D_TWO);
    Filters[4].value = true;

    let list = listFromMap(map);
    let filtered = [D_ONE];
    expect(filterList(list, Filters)).toEqual(filtered);
  });

  it('should filter out all but COOKED within DURATION', () => {
    let map = DEFAULT.map;
    D_FOUR.updated_at = new Date().getTime() - 8000;
    map.set(D_ONE.id, D_ONE);
    map.set(D_TWO.id, D_TWO);
    map.set(D_THREE.id, D_THREE);
    map.set(D_FOUR.id, D_FOUR);

    Filters[1].value = true;
  
    const list = listFromMap(map);
    const filtered = filterList(list, Filters);
    Filters[1].duration = 30;
    const filtered2 = filterList(list, Filters);

    expect(filtered.length).toEqual(0);
    expect(filtered2.length).toEqual(1);
    expect(filtered2[0].id).toEqual("1c891522");
  });

  it('should should check time since last update', () => {
    let then = new Date().getTime() - 5000;
    let then2 = new Date().getTime() - 100000;
    let then3 = new Date().getTime() - 200000;

    expect(timeSince(then, true)).toEqual('5 seconds ago');
    expect(timeSince(then)).toEqual(5);
    expect(timeSince(then2, true)).toEqual('1 minute, 40 seconds ago');
    expect(timeSince(then3, true)).toEqual('3 minutes, 20 seconds ago');
  });

  it('should update destination map and store history', () => {
    let map = DEFAULT.map;
    updateDestinationStatus(D_ONE, map);
    updateDestinationStatus(D_TWO, map);

    let newDest = _cloneDeep(D_TWO);
    newDest.event_name = "DRIVER_RECEIVED";
    updateDestinationStatus(newDest, map);
    let newDest2 = _cloneDeep(D_TWO);
    newDest.event_name = "DELIVERED";
    updateDestinationStatus(newDest2, map);
    
    expect(map.get(newDest.id).history[0].event_name).toEqual("CREATED");
    expect(map.get(newDest.id).history.length).toEqual(2);
  });
});
