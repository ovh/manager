import { OdsNotification } from '@/components/OdsNotification';
import { useReadNotifications } from '@/hooks/useNotifications';

export function Notifications() {
  const notifications = useReadNotifications();

  return (
    <>
      {notifications.map((notification, key) => (
        <OdsNotification key={key} notification={notification} />
      ))}
    </>
  );
}

export default Notifications;
