import React from 'react';
import DOMPurify from 'dompurify';

import style from './notification.module.scss';

const NotificationContent = ({ subject, description }) => {
  const sanitizedDescr = DOMPurify.sanitize(description, {
    ADD_ATTR: ['target'],
  });

  return (
    <div>
      <div className={style.notification_subject}>{subject}</div>
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default NotificationContent;
