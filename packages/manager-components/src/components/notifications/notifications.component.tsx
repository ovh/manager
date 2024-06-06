import { FC, useEffect } from 'react';
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
export const Notifications: FC<NotificationProps> = () => {
  const { notifications, clearNotification } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.forEach((notification) => {
        clearNotification(notification.uid);
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications, clearNotification]);

  return (
    <>
      {notifications.map((notification) => (
        <OdsNotification key={notification.uid} notification={notification} />
      ))}
    </>
  );
};

export default Notifications;
