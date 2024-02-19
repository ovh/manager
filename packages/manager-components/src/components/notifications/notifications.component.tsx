import { useEffect, useState, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { OdsNotification } from './ods-notification';
import { useNotifications } from './useNotifications';

interface NotificationProps {
  /** Clear notifications once they have been displayed (on location changes) */
  clearAfterRead?: boolean;
}

/**
 * This component display the list of notifications. It acts
 * as a "flash" component because by default once the notifications have been
 * shown they are cleared. It means that you can use this component on multiple
 * pages, switching page won't display notifications twice.
 *
 * It replicates the current behavior of public cloud notifications for
 * actions (success / errors / etc)
 */
export const Notifications: FC<NotificationProps> = ({
  clearAfterRead = true,
}) => {
  const location = useLocation();
  const [originLocation] = useState(location);
  const { notifications, clearNotifications } = useNotifications();

  useEffect(() => {
    if (clearAfterRead && originLocation.pathname !== location.pathname)
      clearNotifications();
  }, [clearAfterRead, location.pathname]);

  return (
    <>
      {notifications.map((notification) => (
        <OdsNotification key={notification.uid} notification={notification} />
      ))}
    </>
  );
};

export default Notifications;
