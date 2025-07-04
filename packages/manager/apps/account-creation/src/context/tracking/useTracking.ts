import { useContext } from 'react';
import trackingContext, { TrackingContext } from './tracking.context';

export const useTrackingContext = (): TrackingContext => {
  const context = useContext(trackingContext);
  if (context === undefined) {
    throw new Error('useTrackingContext must be used within a TackingProvider');
  }
  return context;
};
