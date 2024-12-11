import indexOf from 'lodash/indexOf';

export default /* @ngInject */ function notificationService($q, ovhUserPref) {
  const self = this;

  function createNotificationUserPref(userPrefName, subject) {
    return ovhUserPref.create(userPrefName, [subject]);
  }

  self.stopNotification = (userPrefName, subject) =>
    ovhUserPref
      .getValue(userPrefName)
      .then((data) => {
        const notificationArray = data;
        notificationArray.push(subject);
        return ovhUserPref.assign(userPrefName, notificationArray);
      })
      .catch((error) =>
        error.status === 404
          ? createNotificationUserPref(userPrefName, subject)
          : $q.reject(error),
      );

  self.checkIfStopNotification = (userPrefName, subject) =>
    ovhUserPref
      .getValue(userPrefName)
      .then((notification) => indexOf(notification, subject) !== -1)
      .catch((error) => (error.status === 404 ? false : $q.reject(error)));
}
