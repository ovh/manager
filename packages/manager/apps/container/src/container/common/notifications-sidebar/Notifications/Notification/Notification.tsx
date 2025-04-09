import NotificationBadge from './Badge';
import NotificationContent from './Content';
import NotificationIcon from './Icon';
import NotificationLink from './Link';
import style from './notification.module.scss';

type Props = {
  children?: JSX.Element;
};

const Notification = ({ children = null }: Props): JSX.Element => {
  return (
    <div className={`${style.notification} position-relative d-flex`}>
      {children}
    </div>
  );
};

Notification.Icon = NotificationIcon;
Notification.Link = NotificationLink;
Notification.Content = NotificationContent;
Notification.Badge = NotificationBadge;

export default Notification;
