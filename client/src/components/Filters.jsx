import React, { useState } from 'react';
import styled from 'styled-components';
const CURRENT_ORDERS = 'Current Orders';

const FiltersContainer = styled.div`
  display: flex;
  width: 100%;
`;

const FiltersLeft = styled.div`
  flex-grow: 1;
  flex-basis: 33%;
`;

const FiltersRight = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 33%;
  justify-content: center;
  align-items: center;
`;

const FilterInput = styled.input`
  width: auto;
  padding: 10px;
`;


const FilterButton = styled.button`
  background-color: ${({ $selected }) => ($selected ? '#0aa653' : '#efefef')};
  border: 1px solid #b5acac73;
  margin: 2px;
  border-radius: 5px;
  padding: 10px;

  &:focus, &:hover {
    outline: #8f8fe4 dashed 2px;
  }
`;

// Filter Button
function Filter ({updateFilter, filter}) {
  function toggleActive() {
    updateFilter(filter.name, 'value', !filter.value);
  }

  function updateDuration(e) {
    updateFilter(filter.name, 'duration', e.target.value);
  }

  return (
    <>
    <FilterButton $selected={filter.value} key={filter.name} onClick={toggleActive}>
      {filter.label}
    </FilterButton>
    {filter.value && filter.hasOwnProperty('duration') && <FilterInput type="text" value={filter.duration} onChange={updateDuration} />}
    </>
  );
}

//Destination Table Filters
export default function Filters({updateFilters, filters}) {
  const [currentFilter, updateCurrentFilter] = useState(CURRENT_ORDERS);
  const updateFilter = (name, key, value) => {
    let copy = filters.map(f => {
      if (key !== 'duration') {
        f.value = false;
      }
      return f;
    });
    let opt = copy.find(o => o.name === name);
    opt[key] = value;
    updateFilters(copy);

    if (key === 'value') {
      let f = value ? name : CURRENT_ORDERS;
      updateCurrentFilter(f);
    }
  }

  return (
    <FiltersContainer>
      <FiltersLeft>
        {filters && filters.map(o => <Filter key={o.name} filter={o} updateFilter={updateFilter}/>)}
      </FiltersLeft>
      <FiltersRight>{currentFilter}</FiltersRight>
      <FiltersRight></FiltersRight>
    </FiltersContainer>
  )
}