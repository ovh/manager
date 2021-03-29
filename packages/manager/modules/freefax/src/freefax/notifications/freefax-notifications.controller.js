import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import remove from 'lodash/remove';
import some from 'lodash/some';

export default /* @ngInject */ function (
  $q,
  $stateParams,
  $translate,
  FreefaxNotificationObject,
  OvhApiFreeFax,
  TucToast,
  FREEFAX_MAX_NOTIFICATIONS,
) {
  const self = this;

  /**
   * submit / unsubmit with keys
   */
  this.watchKey = function watchKey($event, notif, valid) {
    if ($event.keyCode === 13 && valid) {
      self.update(notif);
    }
    if ($event.keyCode === 27) {
      this.cancel(notif);
    }
  };

  /**
   * Check if email address is unique
   * @param                    {String} val        Email value to Check
   * @param                     {Array} collection List of notifications
   *                                               (FreefaxNotificationObject)
   * @param {FreefaxNotificationObject} current    Current object
   * @return {Boolean}
   */
  this.isUnique = function isUnique(val, collection, current) {
    const other = filter(collection, (elt) => elt.email !== current.email);
    return !some(other, { email: val });
  };

  /**
   * Update all notifications
   * @param {FreefaxNotificationObject} notif Current notification (optional)
   * @return {Promise}
   */
  this.update = function update(notifParam) {
    const notif = notifParam || {};
    notif.busy = true;
    const notifications = filter(
      this.notifications,
      (elt) => elt.email !== notif.email,
    );
    notifications.push(notif.tempValue);
    return OvhApiFreeFax.Aapi()
      .notificationsUpdate(
        {
          serviceName: $stateParams.serviceName,
        },
        {
          notifications,
        },
      )
      .$promise.then((data) => {
        if (notif.accept) {
          notif.accept();
        }
        TucToast.success($translate.instant('freefax_notif_save_success'));
        return data;
      })
      .catch((err) => {
        TucToast.error($translate.instant('freefax_notif_save_error'));
        return $q.reject(err);
      })
      .finally(() => {
        notif.busy = false;
      });
  };

  /**
   * Cancel the edition of a BDHCP
   * @param {FreefaxNotificationObject} notif Notification
   */
  this.cancel = function cancel(notif) {
    if (!notif.cancel()) {
      remove(self.notifications, notif);
    }
  };

  /**
   * Add a notification in edition mode
   */
  this.add = function add() {
    forEach(this.notifications, (notif) => {
      if (notif.editMode) {
        self.cancel(notif);
      }
    });
    const newNotif = new FreefaxNotificationObject();
    self.notifications.push(newNotif);
    newNotif.edit();
  };

  /**
   * Destroy a notification
   * @return {Promise}
   */
  this.destroy = function destroy(notif) {
    const removed = remove(this.notifications, { email: notif.email });
    return this.update()
      .then((data) => data)
      .catch((err) => {
        self.notifications.push(removed[0]);
        return $q.reject(err);
      });
  };

  /**
   * Get notifications
   * @return {Promise}
   */
  function getNotifications() {
    OvhApiFreeFax.Aapi()
      .notifications({
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((notificationList) => {
        self.notifications = notificationList.map(
          (notif) =>
            new FreefaxNotificationObject({
              email: notif.email,
              type: notif.type,
              source: notif.source,
              inApi: true,
            }),
        );
        return self.notifications;
      })
      .catch((err) => {
        self.notifications = [];
        TucToast.error($translate.instant('freefax_notif_read_error'));
        return $q.reject(err);
      });
  }

  /**
   * Get choice type for voicemail notification (attachment, simple, ...)
   * @return {Promise}
   */
  function getTypeChoices() {
    return OvhApiFreeFax.v6()
      .schema()
      .$promise.then((data) => {
        self.typeChoices = map(
          data.models['telephony.ServiceVoicemailMailOptionEnum'].enum,
          (value) => ({
            value,
            label: $translate.instant(`freefax_notification_type_${value}`),
          }),
        );
        return self.typeChoices;
      })
      .catch((err) => $q.reject(err));
  }

  /**
   * Constructor initialization
   */
  function init() {
    self.typeChoices = [];

    self.sourceChoices = map(['fax', 'voicemail', 'both'], (elt) => ({
      value: elt,
      label: $translate.instant(`freefax_notification_source_${elt}`),
    }));

    self.maxNotifications = FREEFAX_MAX_NOTIFICATIONS;

    self.notifications = undefined;

    self.serviceName = $stateParams.serviceName;

    getTypeChoices()
      .then(getNotifications)
      .catch((err) => {
        self.notifications = [];
        return $q.reject(err);
      });
  }

  init();
}
