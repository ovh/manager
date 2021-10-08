import { set } from 'lodash-es';

import { ACKNOWLEDGED_STATUS, NOTIFICATION_STATUS_ENUM } from './constants';

/**
 * Provide some methods on the notifications objects returned by 2API /notification.
 * @param  {Object} notification A notification object returned by 2API.
 * @return {Object}
 */
export const useNotification = (notification) => {
  /**
   * Helper that checks if the notification status is considered as acknoleged.
   * @return {Boolean}
   */
  const isAcknoledged = () => {
    return ACKNOWLEDGED_STATUS.includes(notification.status);
  };

  /**
   * Helper that checks if the notification status is active.
   * @return {Boolean}
   */
  const isActive = () => {
    return notification.status === NOTIFICATION_STATUS_ENUM.ACTIVE;
  };

  /**
   * Helper that checks if the notification status is completed.
   * @return {Boolean}
   */
  const isCompleted = () => {
    return notification.status === NOTIFICATION_STATUS_ENUM.COMPLETED;
  };

  /**
   * Get the url href of the notification
   * @return {String}
   */
  const getUrl = () => {
    return notification?.urlDetails?.href;
  };

  /**
   * Set a new status to the notification
   * @param  {String} newStatus The new status of the notification (see NOTIFICATION_STATUS_ENUM for available status)
   */
  const setStatus = (newStatus) => {
    set(notification, 'status', newStatus);
  };

  /**
   * Set the notification upgrading state. Used to avoid multiple update on the same time.
   * @param  {Boolean} updatingState
   */
  const setUpdating = (updatingState) => {
    set(notification, 'updating', updatingState);
  };

  return {
    ...notification,
    getUrl,
    isAcknoledged,
    isActive,
    isCompleted,
    setStatus,
    setUpdating,
  };
};

export default useNotification;
