import React from 'react';

import Notification from './Notification';
import style from './notifications.module.scss';

const NotificationsGroup = ({ title, notifications }) => {
  return (
    <li>
      <div className={style.notificationsList_group_title}>{title}</div>
      {notifications.map((notification, key) => (
        <Notification key={`notification-${key}`}>
          <Notification.Icon level={notification.level} />
          {notification.urlDetails ? (
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
        </Notification>
      ))}
    </li>
  );
};

export default NotificationsGroup;
