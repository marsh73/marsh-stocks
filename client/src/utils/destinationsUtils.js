// Utilty to take in Map() 
// and return array from map values
export function listFromMap(map) {
  let list = [];
  map.forEach(d => list.push(d));
  return list;
}

// Used to update event while saving history
export function updateDestinationStatus(destination, map) {
  destination.updated_at = new Date().getTime();

  if (!map.has(destination.id)) {
    // initial setup of destinatino by ID
    destination.history = [];
    map.set(destination.id, destination);
  } else {
    // Save recent and add to history
    let d = map.get(destination.id);
    let lastEvent = {event_name: d.event_name, updated_at: d.updated_at};
    let history = d.history;
    history.push(lastEvent);

    //add history to destination object and update order
    destination.history = history;
    map.set(destination.id, destination);
  }
}

// Used to filter Destinations List
// List should be array of destination objects
// filters should be array of filter Objects
export function filterList(list, filters) {
  let fList = Object.values(filters)
    .filter(f => f.value).map(f => f.name);

  // Check for ALL filter
  if (fList.indexOf('ALL') !== -1) return list;

  // filter out non recent
  if (!fList.length) fList = ['CREATED', 'COOKED'];

  // Use for duration when COOKED selected
  let cooked = filters.find(f => f.name === 'COOKED');

  return list.filter(d => {
    if (fList.length === 1 && fList[0] === 'COOKED' && timeSince(d.updated_at) >= cooked.duration) {
      return false;
    }

    // could use this to filter in by additional keys
    return fList.some( f => {
      return f === d.event_name
    });
  });
}

// Used only for displaying time as friendly message
export function timeSince(time, readable) {
  if(typeof(time) !== 'number') return 0;

  let now = new Date().getTime();
  let spent = (now - time) / 1000;
  let mins = Math.floor(spent / 60);
  let seconds = Math.floor(spent % 60);
  if (!readable) return Math.floor(spent);
  let out = mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}, ${seconds} seconds ago` : `${seconds} seconds ago`;

  return out;
}