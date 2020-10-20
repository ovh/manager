import set from 'lodash/set';
import without from 'lodash/without';

angular
  .module('UserAccount')
  .service('UserAccount.services.Contacts', function UserAccountContactsService(
    $rootScope,
    OvhHttp,
    constants,
    Poller,
  ) {
    const self = this;
    const apiChangeContact = '/me/task/contactChange';
    const cache = {
      models: 'UNIVERS_USER_CONTACTS_MODELS',
      me: 'UNIVERS_USER_CONTACTS_ME',
      services: 'UNIVERS_USER_CONTACTS_SERVICES',
      servicesInfos: 'UNIVERS_USER_CONTACTS_SERVICES_INFOS',
    };

    self.noAvailableService = ['IP', 'VRACK'];
    self.availableService = [
      'CLOUD',
      'DOMAIN',
      'HOSTING',
      'HOSTING_RESELLER',
      'PRIVATE_DATABASE',
      'EMAIL_DOMAIN',
      'DEDICATED',
      'KUBE',
      'NAS',
      'NASHA',
      'OVER_THE_BOX',
      'PRIVATE_CLOUD',
      'ESSENTIALS',
      'VPS',
      'PACK_XDSL',
      'XDSL',
      'ZONE',
      'FAILOVER',
      'PACK_SIP_TRUNK',
      'LOAD_BALANCER',
    ];
    self.excludeNics = [/^ovhtel-[0-9]+/];

    self.getMe = function getMe() {
      return OvhHttp.get('/me', { rootPath: 'apiv6', cache: cache.me });
    };

    self.getContactChangeTasks = function getContactChangeTasks(params) {
      return OvhHttp.get(apiChangeContact, {
        rootPath: 'apiv6',
        params,
      });
    };

    self.getContactChangeTaskDetail = function getContactChangeTaskDetail(id) {
      return OvhHttp.get(`${apiChangeContact}/${id}`, {
        rootPath: 'apiv6',
        urlParams: {
          id,
        },
      });
    };

    self.acceptRequest = function acceptRequest(opts) {
      return OvhHttp.post(`${apiChangeContact}/{id}/accept`, {
        rootPath: 'apiv6',
        urlParams: {
          id: opts.id,
        },
        data: {
          token: opts.token,
        },
        broadcast: 'useraccount.contact.request.changed',
      });
    };

    self.refuseRequest = function refuseRequest(opts) {
      return OvhHttp.post(`${apiChangeContact}/{id}/refuse`, {
        rootPath: 'apiv6',
        urlParams: {
          id: opts.id,
        },
        data: {
          token: opts.token,
        },
        broadcast: 'useraccount.contact.request.changed',
      });
    };

    self.resendRequest = function resendRequest(opts) {
      return OvhHttp.post(`${apiChangeContact}/{id}/resendEmail`, {
        rootPath: 'apiv6',
        urlParams: {
          id: opts.id,
        },
        broadcast: 'useraccount.contact.request.changed',
      });
    };

    self.getPendingChanges = function getPendingChanges(opts) {
      let ret = null;
      const pendingChanges = angular.fromJson(
        window.localStorage.getItem(opts.key) || [],
      );
      if (Array.isArray(pendingChanges)) {
        ret = pendingChanges;
      }
      return ret;
    };

    /* eslint-disable no-unused-vars */
    self.addPendingChange = function addPendingChange(opts) {
      let ret = true;
      try {
        const pendingChanges = angular.fromJson(
          window.localStorage.getItem(opts.key) || [],
        );
        if (
          Array.isArray(pendingChanges) &&
          pendingChanges.indexOf(opts.data) === -1
        ) {
          pendingChanges.push(opts.data);
          window.localStorage.setItem(opts.key, angular.toJson(pendingChanges));
        }
      } catch (err) {
        ret = false;
      }

      return ret;
    };

    self.removePendingChange = function removePendingChange(opts) {
      let ret = true;
      try {
        let pendingChanges = angular.fromJson(
          window.localStorage.getItem(opts.key) || [],
        );
        if (
          Array.isArray(pendingChanges) &&
          pendingChanges.indexOf(opts.data) !== -1
        ) {
          pendingChanges = without(pendingChanges, opts.data);
          if (pendingChanges.length > 0) {
            window.localStorage.setItem(
              opts.key,
              angular.toJson(pendingChanges),
            );
          } else {
            window.localStorage.removeItem(opts.key);
          }
        }
      } catch (err) {
        ret = false;
      }

      return ret;
    };

    self.pollState = function pollState(opts) {
      if (!opts.id) {
        return $rootScope.$broadcast(`${opts.namespace}.error`, '');
      }

      if (!Array.isArray(opts.successSates)) {
        set(opts, 'successSates', [opts.successSates]);
      }

      $rootScope.$broadcast(`${opts.namespace}.start`, opts.id);
      return Poller.poll(
        [`apiv6${apiChangeContact}`, opts.id].join('/'),
        null,
        {
          interval: 5000,
          successRule: {
            state(task) {
              return opts.successSates.indexOf(task.state) !== -1;
            },
          },
          namespace: opts.namespace,
        },
      ).then(
        (pollObject, task) => {
          $rootScope.$broadcast(`${opts.namespace}.done`, pollObject, task);
        },
        (err) => {
          $rootScope.$broadcast(`${opts.namespace}.error`, err, opts);
        },
      );
    };

    self.killAllPolling = function killAllPolling(opts) {
      Poller.kill({ namespace: opts.namespace });
    };

    self.getUrlOf = function getUrlOf(link) {
      return self.getMe().then((data) => {
        try {
          return constants.urls[data.ovhSubsidiary][link];
        } catch (exception) {
          return constants.urls.FR[link];
        }
      });
    };
    /* eslint-enable no-unused-vars */

    self.getLegalFormEnum = function getLegalFormEnum() {
      return OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
        cache: cache.me,
      }).then((schema) => schema.models['nichandle.LegalFormEnum'].enum);
    };

    self.getCountryEnum = function getCountryEnum() {
      return OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
        cache: cache.me,
      }).then((schema) => schema.models['nichandle.CountryEnum'].enum);
    };

    self.getGendersEnum = function getGendersEnum() {
      return OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
        cache: cache.me,
      }).then((schema) => schema.models['nichandle.GenderEnum'].enum);
    };

    self.getLanguageEnum = function getLanguageEnum() {
      return OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
        cache: cache.me,
      }).then((schema) => schema.models['nichandle.LanguageEnum'].enum);
    };

    self.getTaskStateEnum = function getTaskStateEnum() {
      return OvhHttp.get('/me.json', {
        rootPath: 'apiv6',
        cache: cache.me,
      }).then(
        (schema) => schema.models['nichandle.changeContact.TaskStateEnum'].enum,
      );
    };

    self.getContactsId = function getContactsId() {
      return OvhHttp.get('/me/contact', {
        rootPath: 'apiv6',
      });
    };

    self.getContactInfo = function getContactInfo(contactId) {
      return OvhHttp.get(['/me/contact', contactId].join('/'), {
        rootPath: 'apiv6',
      });
    };

    self.getContactFields = function getContactFields(contactId) {
      return OvhHttp.get(['/me/contact', contactId, 'fields'].join('/'), {
        rootPath: 'apiv6',
      });
    };

    self.getOrderServiceOption = (domain) =>
      OvhHttp.get('/order/cartServiceOption/domain/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName: window.encodeURIComponent(domain),
        },
      });

    self.updateContact = function updateContact(userData) {
      const dataToSend = angular.copy(userData);
      const contactId = dataToSend.contactId || dataToSend.id;

      if (contactId) {
        delete dataToSend.contactId;
        return OvhHttp.put(['/me/contact', contactId].join('/'), {
          rootPath: 'apiv6',
          data: dataToSend,
        });
      }
      return OvhHttp.post(['/me/contact'].join('/'), {
        rootPath: 'apiv6',
        data: dataToSend,
      });
    };

    this.deleteContact = function deleteContact(contactId) {
      return OvhHttp.delete('/me/contact/{contactId}', {
        rootPath: 'apiv6',
        urlParams: {
          contactId,
        },
        broadcast: 'useraccount.contact.changed',
      });
    };

    this.getDomainsByOwner = function getDomainsByOwner(contactId) {
      return OvhHttp.get('/domain', {
        rootPath: 'apiv6',
        params: {
          whoisOwner: contactId,
        },
      });
    };
  });
