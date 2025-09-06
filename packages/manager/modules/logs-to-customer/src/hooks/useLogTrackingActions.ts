import { useContext } from 'react';

import { LogsContext } from '../LogsToCustomer.context';
import { LogsActionName } from '../types/logsTracking';

const useLogTrackingActions = (action: LogsActionName) => {
  const { trackingOptions } = useContext(LogsContext);
  return trackingOptions?.trackingSuffix ? `${action}_${trackingOptions?.trackingSuffix}` : action;
};

export default useLogTrackingActions;
