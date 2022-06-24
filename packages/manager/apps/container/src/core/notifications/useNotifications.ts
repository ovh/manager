import { useContext } from 'react';

import NotificationsContext, { NotificationsContextType } from './context';

const useNotifications = (): NotificationsContextType => {
  return useContext(NotificationsContext);
};

export default useNotifications;
