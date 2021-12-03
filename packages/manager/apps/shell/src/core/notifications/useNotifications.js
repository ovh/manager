import { useContext } from 'react';
import NotificationsContext from './context';

const useNotifications = () => {
  return useContext(NotificationsContext);
};

export default useNotifications;
