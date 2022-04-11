import React from 'react';

import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

import style from './notification.module.scss';

type Props = {
  subject: string;
  description: string;
};

const NotificationContent = ({ subject, description }: Props): JSX.Element => {
  const sanitizedDescr = DOMPurify.sanitize(description, {
    ADD_ATTR: ['target'],
  });

  return (
    <div>
      <div className={style.notification_subject}>{subject}</div>
      <div dangerouslySetInnerHTML={{ __html: sanitizedDescr }}></div>
    </div>
  );
};

NotificationContent.propTypes = {
  subject: PropTypes.string,
  description: PropTypes.string,
};

NotificationContent.defaultProps = {
  subject: '',
  description: '',
};

export default NotificationContent;
