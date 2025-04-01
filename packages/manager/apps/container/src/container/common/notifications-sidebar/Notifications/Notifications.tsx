import NotificationsEmpty from './Empty';
import NotificationsGroup from './Group';
import NotificationsLoading from './Loading';

import style from './notifications.module.scss';

type Props = {
  children?: JSX.Element;
};

const Notifications = ({ children = null }: Props): JSX.Element => {
  return <ul className={style.notificationsList}>{children}</ul>;
};

Notifications.Loading = NotificationsLoading;
Notifications.Group = NotificationsGroup;
Notifications.Empty = NotificationsEmpty;

export default Notifications;
