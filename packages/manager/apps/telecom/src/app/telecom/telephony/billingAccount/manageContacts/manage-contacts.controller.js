import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import pick from 'lodash/pick';
import set from 'lodash/set';
import startsWith from 'lodash/startsWith';
import values from 'lodash/values';

export default /* @ngInject */ function TelecomTelephonyBillingAccountManageContactsCtrl(
  $stateParams,
  $q,
  $translate,
  OvhApiTelephony,
  OvhApiMe,
  TelephonyMediator,
  OvhApiPackXdslVoipLine,
  TucToast,
  TucToastError,
) {
  const self = this;

  const contactAttributes = ['contactAdmin', 'contactBilling', 'contactTech'];

  function getGroupContacts() {
    return OvhApiTelephony.v6()
      .getServiceInfos({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((result) => [
        {
          value: pick(result, contactAttributes),
          modified: pick(result, contactAttributes),
          serviceName: $stateParams.billingAccount,
          serviceType: 'group',
        },
      ]);
  }

  function getPackXdslServiceIds() {
    return OvhApiPackXdslVoipLine.v7()
      .services()
      .aggregate('packName')
      .execute()
      .$promise.then((ids) => map(ids, 'key'));
  }

  function getLinesContacts() {
    return OvhApiTelephony.Line()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((ids) =>
        $q.all(
          map(ids, (id) =>
            OvhApiTelephony.Lines()
              .v6()
              .getServiceInfos({
                serviceName: id,
              })
              .$promise.then((infos) => ({
                value: pick(infos, contactAttributes),
                modified: pick(infos, contactAttributes),
                serviceName: id,
                serviceType: 'line',
              }))
              .catch((err) => {
                // if serviceInfos does not exist, service might be a sip trunk
                if (err.status === 404) {
                  return OvhApiTelephony.Trunks()
                    .v6()
                    .getServiceInfos({
                      serviceName: id,
                    })
                    .$promise.then((infos) => ({
                      value: pick(infos, contactAttributes),
                      modified: pick(infos, contactAttributes),
                      serviceName: id,
                      serviceType: 'trunk',
                    }));
                }
                return $q.reject(err);
              }),
          ),
        ),
      );
  }

  function getAliasContacts() {
    return OvhApiTelephony.Number()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((ids) =>
        $q.all(
          map(ids, (id) =>
            OvhApiTelephony.Aliases()
              .v6()
              .getServiceInfos({
                serviceName: id,
              })
              .$promise.then((infos) => ({
                value: pick(infos, contactAttributes),
                modified: pick(infos, contactAttributes),
                serviceName: id,
                serviceType: 'alias',
              })),
          ),
        ),
      );
  }

  function getPendingTasks() {
    return OvhApiMe.Task()
      .ContactChange()
      .v6()
      .query()
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiMe.Task()
                  .ContactChange()
                  .v6()
                  .getBatch({
                    id: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );
  }

  function associatePendingTasks(tasks) {
    const rows = flatten(values(self.section));
    forEach(tasks, (task) => {
      if (
        ['checkValidity', 'doing', 'todo', 'validatingByCustomers'].indexOf(
          task.state,
        ) >= 0
      ) {
        forEach(rows, (row) => {
          if (
            row.serviceName === task.serviceDomain ||
            (row.serviceType === 'group' &&
              task.serviceDomain === $stateParams.billingAccount)
          ) {
            set(row, 'pendingTask', task);
          }
        });
      }
    });
  }

  function checkModifiableServices(services) {
    return getPackXdslServiceIds().then((idsToFilter) => {
      forEach(services, (service) => {
        if (
          service.serviceType === 'group' &&
          startsWith(service.serviceName, 'ovhtel-')
        ) {
          set(service, 'isModifiable', false);
        } else if (
          service.serviceType !== 'group' &&
          idsToFilter.indexOf(service.serviceName) >= 0
        ) {
          set(service, 'isModifiable', false);
        } else {
          set(service, 'isModifiable', true);
        }
      });
    });
  }

  function init() {
    self.isLoading = true;
    return $q
      .all({
        billingAccount: TelephonyMediator.getGroup($stateParams.billingAccount),
        tasks: getPendingTasks(),
        group: getGroupContacts(),
        lines: getLinesContacts(),
        aliases: getAliasContacts(),
      })
      .then((result) => {
        self.sections = [];
        if (result.group.length) {
          self.sections.push('group');
        }
        if (result.lines.length) {
          self.sections.push('lines');
        }
        if (result.aliases.length) {
          self.sections.push('alias');
        }
        self.section = {
          group: result.group,
          lines: result.lines,
          alias: result.aliases,
        };
        self.billingAccount = result.billingAccount;
        associatePendingTasks(result.tasks);
        return checkModifiableServices(
          result.group.concat(result.lines).concat(result.aliases),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  self.editContact = function editContact(contact) {
    set(contact, 'editing', true);
    self.isEditing = true;
  };

  self.cancelEdition = function cancelEdition(contact) {
    set(contact, 'editing', false);
    self.isEditing = false;
    set(contact, 'modified', angular.copy(contact.value));
  };

  self.hasChanges = function hasChanges(contact) {
    return !angular.equals(contact.value, contact.modified);
  };

  self.isContactValid = function isContactValid(contact) {
    let isValid = true;
    const pattern = /^[^\s]+$/;
    forEach(values(contact.modified), (value) => {
      isValid = isValid && angular.isString(value) && pattern.test(value);
    });
    return isValid;
  };

  self.submitChanges = function submitChanges(contact) {
    let promise = $q.reject('Unknown service type');
    set(contact, 'submiting', true);
    switch (contact.serviceType) {
      case 'group':
        promise = OvhApiTelephony.v6().changeContact(
          {
            billingAccount: $stateParams.billingAccount,
          },
          pick(contact.modified, contactAttributes),
        ).$promise;
        break;
      case 'line':
        promise = OvhApiTelephony.Lines()
          .v6()
          .changeContact(
            {
              serviceName: contact.serviceName,
            },
            pick(contact.modified, contactAttributes),
          ).$promise;
        break;
      case 'trunk':
        promise = OvhApiTelephony.Trunks()
          .v6()
          .changeContact(
            {
              serviceName: contact.serviceName,
            },
            pick(contact.modified, contactAttributes),
          ).$promise;
        break;
      case 'alias':
        promise = OvhApiTelephony.Aliases()
          .v6()
          .changeContact(
            {
              serviceName: contact.serviceName,
            },
            pick(contact.modified, contactAttributes),
          ).$promise;
        break;
      default:
        break;
    }
    return promise
      .then(() => getPendingTasks())
      .then((tasks) => {
        set(contact, 'value', angular.copy(contact.modified));
        set(contact, 'editing', false);
        self.isEditing = false;
        associatePendingTasks(tasks);
        TucToast.success(
          $translate.instant('telephony_group_manage_contacts_change_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        set(contact, 'submiting', false);
      });
  };

  init();
}
