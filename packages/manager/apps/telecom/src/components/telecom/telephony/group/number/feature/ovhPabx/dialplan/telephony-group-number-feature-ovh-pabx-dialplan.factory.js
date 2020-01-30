import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';

angular
  .module('managerApp')
  .factory(
    'TelephonyGroupNumberOvhPabxDialplan',
    ($q, OvhApiTelephony, TelephonyGroupNumberOvhPabxDialplanExtension) => {
      /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

      function TelephonyGroupNumberOvhPabxDialplan(dialplanOptionsParam) {
        let dialplanOptions = dialplanOptionsParam;

        if (!dialplanOptions) {
          dialplanOptions = {};
        }

        // check for mandatory options
        if (!dialplanOptions.billingAccount) {
          throw new Error(
            'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxDialplan',
          );
        }

        if (!dialplanOptions.serviceName) {
          throw new Error(
            'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxDialplan',
          );
        }

        // set mandatory attributes
        this.billingAccount = dialplanOptions.billingAccount;
        this.serviceName = dialplanOptions.serviceName;

        // other attributes
        this.dialplanId = dialplanOptions.dialplanId;
        this.name = null;
        this.showCallerNumber = null;
        this.transferTimeout = null;
        this.anonymousRejection = null;

        // custom attributes
        this.inEdition = false;
        this.saveForEdition = null;
        this.status = null;
        this.extensions = [];

        // set feature options
        this.setInfos(dialplanOptions);
      }

      /* -----  End of CONSTRUCTOR  ------*/

      /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

      TelephonyGroupNumberOvhPabxDialplan.prototype.setInfos = function setInfos(
        dialplanOptionsParam,
      ) {
        const self = this;
        let dialplanOptions = dialplanOptionsParam;

        if (!dialplanOptions) {
          dialplanOptions = {};
        }

        self.name = dialplanOptions.name || '';
        self.showCallerNumber = dialplanOptions.showCallerNumber || 'caller';
        self.transferTimeout = dialplanOptions.transferTimeout || 60;
        self.anonymousRejection = dialplanOptions.anonymousRejection || false;
        self.status = dialplanOptions.status || 'OK';

        return self;
      };

      /* ----------  EDITION  ----------*/

      TelephonyGroupNumberOvhPabxDialplan.prototype.startEdition = function startEdition() {
        const self = this;

        self.inEdition = true;
        self.saveForEdition = {
          name: angular.copy(self.name),
          showCallerNumber: angular.copy(self.showCallerNumber),
          transferTimeout: angular.copy(self.transferTimeout),
          anonymousRejection: angular.copy(self.anonymousRejection),
        };

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.stopEdition = function stopEdition(
        cancel,
      ) {
        const self = this;

        if (self.saveForEdition && cancel) {
          self.name = angular.copy(self.saveForEdition.name);
          self.showCallerNumber = angular.copy(
            self.saveForEdition.showCallerNumber,
          );
          self.transferTimeout = angular.copy(
            self.saveForEdition.transferTimeout,
          );
          self.anonymousRejection = angular.copy(
            self.saveForEdition.anonymousRejection,
          );
        }

        self.saveForEdition = null;
        self.inEdition = false;

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.hasChange = function hasChange(
        attr,
      ) {
        const self = this;

        if (!self.inEdition || !self.saveForEdition) {
          return false;
        }

        if (attr) {
          return !isEqual(get(self.saveForEdition, attr), get(self, attr));
        }
        return (
          self.hasChange('name') ||
          self.hasChange('showCallerNumber') ||
          self.hasChange('transferTimeout') ||
          self.hasChange('anonymousRejection')
        );
      };

      /* ----------  API CALLS  ----------*/

      /**
       *  Create a dialplan by calling POST /telephony/{billingAccount}/ovhPabx/{serviceName}/dialplan
       */
      TelephonyGroupNumberOvhPabxDialplan.prototype.create = function create() {
        const self = this;

        self.status = 'IN_CREATION';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .v6()
          .create(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
            },
            {
              anonymousRejection: self.anonymousRejection,
              name: self.name,
              showCallerNumber: self.showCallerNumber,
              transferTimeout: self.transferTimeout,
            },
          )
          .$promise.then(
            (dialplanOptions) => {
              self.dialplanId = dialplanOptions.dialplanId;
              self.status = 'OK';
              return self;
            },
            (error) => {
              self.status = 'DRAFT';
              return $q.reject(error);
            },
          );
      };

      /**
       *  Save the dialplan by calling
       *  PUT /telephony/{billingAccount}/ovhPabx/{serviceName}/dialplan/{dialplanId}
       */
      TelephonyGroupNumberOvhPabxDialplan.prototype.save = function save() {
        const self = this;

        self.status = 'SAVING';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .v6()
          .save(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
            },
            {
              anonymousRejection: self.anonymousRejection,
              name: self.name,
              showCallerNumber: self.showCallerNumber,
              transferTimeout: self.transferTimeout,
            },
          )
          .$promise.then(() => self)
          .finally(() => {
            // in all case status is OK
            self.status = 'OK';
          });
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.remove = function removeFunction() {
        const self = this;

        self.status = 'DELETING';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .v6()
          .remove({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
          })
          .$promise.finally(() => {
            // in all case status is OK
            self.status = 'OK';
          });
      };

      /* ----------  EXTENSIONS  ----------*/

      TelephonyGroupNumberOvhPabxDialplan.prototype.getExtensions = function getExtensions() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .query({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
          })
          .$promise.then((extensionIds) =>
            $q
              .all(
                map(chunk(extensionIds, 50), (chunkIds) =>
                  OvhApiTelephony.OvhPabx()
                    .Dialplan()
                    .Extension()
                    .v6()
                    .getBatch({
                      billingAccount: self.billingAccount,
                      serviceName: self.serviceName,
                      dialplanId: self.dialplanId,
                      extensionId: chunkIds,
                    })
                    .$promise.then((resources) => {
                      angular.forEach(
                        sortBy(map(resources, 'value'), 'position'),
                        (extenstionOptions) => {
                          self.addExtension(extenstionOptions);
                        },
                      );
                    }),
                ),
              )
              .then(() => self),
          );
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.addExtension = function addExtension(
        extensionOptionsParam,
      ) {
        const self = this;
        let extension = null;
        let extensionOptions = extensionOptionsParam;

        if (!extensionOptions) {
          extensionOptions = {};
        }

        if (extensionOptions.extensionId) {
          extension = find(self.extensions, {
            extensionId: extensionOptions.extensionId,
          });
        }

        if (extension) {
          extension.setInfos(extensionOptions);
        } else {
          extension = new TelephonyGroupNumberOvhPabxDialplanExtension(
            angular.extend(extensionOptions, {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
            }),
          );
          self.extensions.push(extension);
        }

        return extension;
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.removeExtension = function removeExtension(
        extension,
      ) {
        const self = this;

        remove(self.extensions, extension);

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplan.prototype.updateExtensionsPositions = function updateExtensionsPositions(
        from,
      ) {
        const self = this;
        const updatePositionPromises = [];
        const extensionsToUpdate = from
          ? filter(self.extensions, (extension) => extension.position > from)
          : self.extensions;

        angular.forEach(extensionsToUpdate, (extension) => {
          updatePositionPromises.push(
            extension.move(from ? extension.position - 1 : extension.position),
          );
        });

        return $q.allSettled(updatePositionPromises);
      };

      /* -----  End of PROTOTYPE METHODS  ------*/

      return TelephonyGroupNumberOvhPabxDialplan;
    },
  );
