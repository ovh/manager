import React from 'react';

import PropTypes from 'prop-types';

import NotificationsEmpty from './Empty';
import NotificationsGroup from './Group';
import NotificationsLoading from './Loading';

import style from './notifications.module.scss';

type Props = {
  children: JSX.Element;
};

const Notifications = ({ children }: Props): JSX.Element => {
  return <ul className={style.notificationsList}>{children}</ul>;
};

Notifications.Loading = NotificationsLoading;
Notifications.Group = NotificationsGroup;
Notifications.Empty = NotificationsEmpty;

Notifications.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Notifications.defaultProps = {
  children: null,
};

export default Notifications;
