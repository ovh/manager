import Notification from './Notification';
import style from './notifications.module.scss';

import { Notification as NotificationType } from '@/core/notifications';

type Props = {
  notifications?: NotificationType[];
  title?: string;
};

const NotificationsGroup = ({
  notifications = [],
  title = '',
}: Props): JSX.Element => {
  return (
    <li data-testid='notifications-group'>
      <div className={style.notificationsList_group_title}>{title}</div>
      {notifications.map((notification, key) => (
        <Notification key={`notification-${key}`}>
          <>
            <Notification.Icon level={notification.level} />
            {notification.urlDetails.href ? (
              <Notification.Link
                url={notification.getUrl()}
                notificationId={notification.id}
              >
                <Notification.Content
                  description={notification.description}
                  subject={notification.subject}
                />
              </Notification.Link>
            ) : (
              <Notification.Content
                description={notification.description}
                subject={notification.subject}
              />
            )}
            {!notification.isCompleted() && (
              <Notification.Badge
                isActive={notification.isActive()}
                notificationId={notification.id}
              />
            )}
          </>
        </Notification>
      ))}
    </li>
  );
};

export default NotificationsGroup;
