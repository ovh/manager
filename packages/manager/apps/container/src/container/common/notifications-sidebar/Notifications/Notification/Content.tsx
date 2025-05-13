import DOMPurify from 'dompurify';

import style from './notification.module.scss';

type Props = {
  description?: string;
  subject?: string;
};

const NotificationContent = ({
  description = '',
  subject = '',
}: Props): JSX.Element => {
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

export default NotificationContent;
