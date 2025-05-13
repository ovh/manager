import { ACKNOWLEDGED_STATUS, NOTIFICATION_STATUS_ENUM } from './constants';

type URLDetails = {
  href: string;
};

export type APINotification = {
  date: string;
  id: string;
  status: string;
  subject: string;
  description: string;
  updating: boolean;
  urlDetails: URLDetails;
  level: string;
};

export interface Notification extends APINotification {
  date: string;
  id: string;
  status: string;
  updating: boolean;
  urlDetails: URLDetails;
  isAcknoledged(): boolean;
  isActive(): boolean;
  isCompleted(): boolean;
  getUrl(): string;
  setStatus(status: string): void;
  setUpdating(state: boolean): void;
}

/**
 * Provide some methods on the notifications objects returned by 2API /notification.
 * @param  {Object} notification A notification object returned by 2API.
 * @return {Object}
 */
export const transformNotification = (
  notification: APINotification,
): Notification => {
  /**
   * Helper that checks if the notification status is considered as acknoleged.
   * @return {Boolean}
   */
  const isAcknoledged = (): boolean => {
    return ACKNOWLEDGED_STATUS.includes(notification.status);
  };

  /**
   * Helper that checks if the notification status is active.
   * @return {Boolean}
   */
  const isActive = (): boolean => {
    return notification.status === NOTIFICATION_STATUS_ENUM.ACTIVE;
  };

  /**
   * Helper that checks if the notification status is completed.
   * @return {Boolean}
   */
  const isCompleted = (): boolean => {
    return notification.status === NOTIFICATION_STATUS_ENUM.COMPLETED;
  };

  /**
   * Get the url href of the notification
   * @return {String}
   */
  const getUrl = (): string => {
    return notification?.urlDetails?.href;
  };

  /**
   * Set a new status to the notification
   * @param  {String} newStatus The new status of the notification (see NOTIFICATION_STATUS_ENUM for available status)
   */
  const setStatus = (newStatus: string): void => {
    Object.assign(notification, {
      status: newStatus,
    });
  };

  /**
   * Set the notification upgrading state. Used to avoid multiple update on the same time.
   * @param  {Boolean} updatingState
   */
  const setUpdating = (updatingState: boolean): void => {
    Object.assign(notification, {
      updating: updatingState,
    });
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

export default transformNotification;
