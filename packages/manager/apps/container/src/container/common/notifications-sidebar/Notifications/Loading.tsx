import React from 'react';

import Notification from './Notification';
import notificationStyle from './Notification/notification.module.scss';
import style from './notifications.module.scss';

const NotificationsLoading = (): JSX.Element => {
  return (
    <li>
      <div className={style.notificationsGroup_title}>
        <div className="oui-skeleton oui-skeleton_s">
          <div className="oui-skeleton__loader"></div>
        </div>
      </div>
      <ul>
        <Notification>
          <div>
            <div className={notificationStyle.notification_subject}>
              <div className="oui-skeleton oui-skeleton_s">
                <div className="oui-skeleton__loader"></div>
              </div>
            </div>
            <div>
              <div className="oui-skeleton">
                <div className="oui-skeleton__loader"></div>
              </div>
              <div className="oui-skeleton">
                <div className="oui-skeleton__loader"></div>
              </div>
              <div className="oui-skeleton">
                <div className="oui-skeleton__loader"></div>
              </div>
            </div>
          </div>
        </Notification>
      </ul>
    </li>
  );
};

export default NotificationsLoading;
