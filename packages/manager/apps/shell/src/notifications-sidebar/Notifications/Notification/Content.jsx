import React from 'react';

import style from './notification.module.scss';

const NotificationContent = ({ subject, description }) => {
  return (
    <div>
      <div className={style.notification_subject}>{subject}</div>
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default NotificationContent;
