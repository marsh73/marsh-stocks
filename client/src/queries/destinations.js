import { gql } from '@apollo/client';

export const DESTINATIONS_SUBSCRIPTION = gql`
  subscription DestinationSubscription {
    destinationAdded {
      destination
      id
      event_name
      name
    }
  }
`;

export const TRIGGER_DESTINATIONS = gql`
  query TriggerDestinations {
    GetDestinations
  }
`;

export const UPDATE_DESTINATION = gql`
  mutation UpdateDestination($destination: DestinationInput) {
    UpdateDestination( DestinationInput: $destination)
  }
`;