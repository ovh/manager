import chunk from 'lodash/chunk';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';

angular
  .module('managerApp')
  .factory(
    'TelephonyGroupNumberOvhPabxDialplanExtension',
    (
      $q,
      OvhApiTelephony,
      TelephonyGroupNumberOvhPabxDialplanExtensionRule,
      TucVoipScreenScreenList,
      VoipTimeConditionCondition,
    ) => {
      /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

      function TelephonyGroupNumberOvhPabxDialplanExtension(
        extensionOptionsParam,
      ) {
        let extensionOptions = extensionOptionsParam;

        if (!extensionOptions) {
          extensionOptions = {};
        }

        // check for mandatory options
        if (!extensionOptions.billingAccount) {
          throw new Error(
            'billingAccount option must be specified when creating a new TelephonyGroupNumberOvhPabxDialplanExtension',
          );
        }

        if (!extensionOptions.serviceName) {
          throw new Error(
            'serviceName option must be specified when creating a new TelephonyGroupNumberOvhPabxDialplanExtension',
          );
        }

        if (!extensionOptions.dialplanId) {
          throw new Error(
            'dialplanId option must be specified when creating a new TelephonyGroupNumberOvhPabxDialplanExtension',
          );
        }

        // set mandatory attributes
        this.billingAccount = extensionOptions.billingAccount;
        this.serviceName = extensionOptions.serviceName;
        this.dialplanId = extensionOptions.dialplanId;

        // other attributes
        this.extensionId = extensionOptions.extensionId;
        this.position = null;
        this.screenListType = null;
        this.enabled = null;
        this.schedulerCategory = null;

        // custom attributes
        this.inEdition = false;
        this.saveForEdition = null;
        this.status = null;
        this.rules = [];
        this.negativeRules = [];
        this.timeConditions = [];
        this.screenListConditions = [];

        // set feature options
        this.setInfos(extensionOptions);
      }

      /* -----  End of CONSTRUCTOR  ------*/

      /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.setInfos = function setInfos(
        extensionOptionsParam,
      ) {
        const self = this;
        let extensionOptions = extensionOptionsParam;

        if (!extensionOptions) {
          extensionOptions = {};
        }

        self.position = extensionOptions.position;
        self.screenListType = extensionOptions.screenListType || null;
        self.schedulerCategory = extensionOptions.schedulerCategory || null;
        self.enabled = !isUndefined(extensionOptions.enabled)
          ? extensionOptions.enabled
          : true;
        self.status = extensionOptions.status || 'OK';

        return self;
      };

      /* ----------  ACTIONS  ----------*/

      /* ----------  CREATE  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.create = function create() {
        const self = this;

        self.status = 'IN_CREATION';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .create(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
            },
            {
              enable: self.enabled,
              position: self.position,
              schedulerCategory: self.schedulerCategory,
              screenListType: self.screenListType,
            },
          )
          .$promise.then((extensionOptions) => {
            self.status = 'OK';
            self.extensionId = extensionOptions.extensionId;
            return self;
          });
      };

      /* ----------  SAVE  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.save = function save() {
        const self = this;

        self.status = 'SAVING';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .save(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            },
            {
              schedulerCategory: self.schedulerCategory,
              screenListType: self.screenListType,
            },
          )
          .$promise.finally(() => {
            self.status = 'OK';
          });
      };

      /* ----------  ENABLE/DISABLE  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.enable = function enable() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .save(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            },
            {
              enabled: true,
            },
          )
          .$promise.then(() => {
            self.enabled = true;
            return self;
          });
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.disable = function disable() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .save(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            },
            {
              enabled: false,
            },
          )
          .$promise.then(() => {
            self.enabled = false;
            return self;
          });
      };

      /* ----------  DELETE  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.remove = function removeFunction() {
        const self = this;

        self.status = 'DELETING';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .remove({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
            extensionId: self.extensionId,
          })
          .$promise.catch((error) => {
            self.status = 'OK';
            return $q.reject(error);
          });
      };

      /* ----------  MOVE  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.move = function move(
        newPosition,
      ) {
        const self = this;

        self.status = 'MOVING';

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .v6()
          .save(
            {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            },
            {
              position: newPosition,
            },
          )
          .$promise.then(() => {
            self.position = newPosition;
            self.status = 'OK';
            return self;
          });
      };

      /* ----------  RULES  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.getRules = function getRules() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .Rule()
          .v6()
          .query({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
            extensionId: self.extensionId,
          })
          .$promise.then((ruleIds) =>
            $q
              .all(
                map(chunk(ruleIds, 50), (chunkIds) =>
                  OvhApiTelephony.OvhPabx()
                    .Dialplan()
                    .Extension()
                    .Rule()
                    .v6()
                    .getBatch({
                      billingAccount: self.billingAccount,
                      serviceName: self.serviceName,
                      dialplanId: self.dialplanId,
                      extensionId: self.extensionId,
                      ruleId: chunkIds,
                    })
                    .$promise.then((resources) => {
                      angular.forEach(
                        sortBy(
                          map(
                            filter(
                              resources,
                              (resource) => resource.value !== null,
                            ),
                            'value',
                          ),
                          'position',
                        ),
                        (ruleOptions) => {
                          self.addRule(ruleOptions);
                        },
                      );
                    }),
                ),
              )
              .then(() => self),
          );
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.addRule = function addRule(
        ruleOptionsParam,
      ) {
        const self = this;
        let rule = null;
        let ruleOptions = ruleOptionsParam;

        if (!ruleOptions) {
          ruleOptions = {};
        }

        const ruleList = ruleOptions.negativeAction
          ? self.negativeRules
          : self.rules;

        if (ruleOptions.ruleId) {
          rule = find(ruleList, {
            ruleId: ruleOptions.ruleId,
          });
        }

        if (rule) {
          rule.setInfos(ruleOptions);
        } else {
          rule = new TelephonyGroupNumberOvhPabxDialplanExtensionRule(
            angular.extend(ruleOptions, {
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            }),
          );
          ruleList.push(rule);
        }

        return rule;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.removeRule = function removeRule(
        rule,
      ) {
        const self = this;

        remove(rule.negativeAction ? self.negativeRules : self.rules, rule);

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.updateRulesPositions = function updateRulesPositions(
        from,
        forNegativeActions,
      ) {
        const self = this;
        const updatePositionPromises = [];
        const ruleList = forNegativeActions ? self.negativeRules : self.rules;
        const rulesToUpdate = from
          ? filter(ruleList, (rule) => rule.position > from)
          : ruleList;

        angular.forEach(rulesToUpdate, (rule) => {
          updatePositionPromises.push(
            rule.move(from ? rule.position - 1 : rule.position),
          );
        });

        return $q.allSettled(updatePositionPromises);
      };

      /* ----------  SCREEN LIST CONDITIONS  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.getScreenListConditions = function getScreenListConditions() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .ConditionScreenList()
          .v6()
          .query({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
            extensionId: self.extensionId,
          })
          .$promise.then((ruleIds) =>
            $q
              .all(
                map(chunk(ruleIds, 50), (chunkIds) =>
                  OvhApiTelephony.OvhPabx()
                    .Dialplan()
                    .Extension()
                    .ConditionScreenList()
                    .v6()
                    .getBatch({
                      billingAccount: self.billingAccount,
                      serviceName: self.serviceName,
                      dialplanId: self.dialplanId,
                      extensionId: self.extensionId,
                      conditionId: chunkIds,
                    })
                    .$promise.then((resources) => {
                      sortBy(
                        map(
                          filter(
                            resources,
                            (resource) => resource.value !== null,
                          ),
                          'value',
                        ),
                        'conditionId',
                      ).forEach((screenListOptions) => {
                        self.addScreenListCondition(screenListOptions);
                      });
                    }),
                ),
              )
              .then(() => self),
          );
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.addScreenListCondition = function addScreenListCondition(
        screenListOptionsParam,
      ) {
        const self = this;
        let condition = null;
        let screenListOptions = screenListOptionsParam;

        if (!screenListOptions) {
          screenListOptions = {};
        }

        if (screenListOptions.conditionId) {
          condition = find(self.screenListConditions, {
            conditionId: screenListOptions.conditionId,
          });
        }

        if (condition) {
          condition.setOptions(screenListOptions);
        } else {
          condition = new TucVoipScreenScreenList(
            angular.extend(screenListOptions, {
              featureType: 'ovhPabx',
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            }),
          );
          self.screenListConditions.push(condition);
        }

        return condition;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.removeScreenListCondition = function removeScreenListCondition(
        screenListCondition,
      ) {
        const self = this;

        remove(self.screenListConditions, screenListCondition);

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.saveScreenListConditions = function saveScreenListConditions() {
        const self = this;
        const savePromises = [];

        self.screenListConditions.forEach((screenList) => {
          if (screenList.state === 'TO_DELETE') {
            savePromises.push(
              screenList
                .remove()
                .then(() => self.removeScreenListCondition(screenList)),
            );
          } else if (screenList.state === 'DRAFT') {
            savePromises.push(
              screenList.create().catch((error) => {
                self.removeScreenListCondition(screenList);
                return $q.reject(error);
              }),
            );
          }
        });

        return $q.allSettled(savePromises);
      };

      /* ----------  TIMECONDITIONS  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.getTimeConditions = function getTimeConditions() {
        const self = this;

        return OvhApiTelephony.OvhPabx()
          .Dialplan()
          .Extension()
          .ConditionTime()
          .v6()
          .query({
            billingAccount: self.billingAccount,
            serviceName: self.serviceName,
            dialplanId: self.dialplanId,
            extensionId: self.extensionId,
          })
          .$promise.then((ruleIds) =>
            $q
              .all(
                map(chunk(ruleIds, 50), (chunkIds) =>
                  OvhApiTelephony.OvhPabx()
                    .Dialplan()
                    .Extension()
                    .ConditionTime()
                    .v6()
                    .getBatch({
                      billingAccount: self.billingAccount,
                      serviceName: self.serviceName,
                      dialplanId: self.dialplanId,
                      extensionId: self.extensionId,
                      conditionId: chunkIds,
                    })
                    .$promise.then((resources) => {
                      sortBy(
                        map(
                          filter(
                            resources,
                            (resource) => resource.value !== null,
                          ),
                          'value',
                        ),
                        'conditionId',
                      ).forEach((timeConditionOptions) => {
                        self.addTimeCondition(timeConditionOptions);
                      });
                    }),
                ),
              )
              .then(() => self),
          );
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.addTimeCondition = function addTimeCondition(
        timeConditionOptionsParam,
      ) {
        const self = this;
        let condition = null;
        let timeConditionOptions = timeConditionOptionsParam;

        if (!timeConditionOptions) {
          timeConditionOptions = {};
        }

        if (timeConditionOptions.conditionId) {
          condition = find(self.timeConditions, {
            conditionId: timeConditionOptions.conditionId,
          });
        }

        if (condition) {
          condition.setOptions(timeConditionOptions);
        } else {
          condition = new VoipTimeConditionCondition(
            angular.extend(timeConditionOptions, {
              featureType: 'ovhPabx',
              billingAccount: self.billingAccount,
              serviceName: self.serviceName,
              dialplanId: self.dialplanId,
              extensionId: self.extensionId,
            }),
          );
          self.timeConditions.push(condition);
        }

        return condition;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.removeTimeCondition = function removeTimeCondition(
        timeCondition,
      ) {
        const self = this;

        remove(self.timeConditions, timeCondition);

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.saveTimeConditions = function saveTimeConditions() {
        const self = this;
        const savePromises = [];
        const toDeletePromises = [];

        self.timeConditions.forEach((timeCondition) => {
          if (timeCondition.state === 'TO_DELETE') {
            set(timeCondition, 'state', 'DELETING');
            toDeletePromises.push(
              timeCondition
                .remove()
                .then(() => self.removeTimeCondition(timeCondition)),
            );
          } else if (timeCondition.state === 'DRAFT') {
            set(timeCondition, 'state', 'CREATING');
            savePromises.push(
              timeCondition.create().catch((error) => {
                self.removeTimeCondition(timeCondition);
                return $q.reject(error);
              }),
            );
          }
        });

        return $q
          .allSettled(toDeletePromises)
          .then(() => $q.allSettled(savePromises));
      };

      /* ----------  EDITION  ----------*/

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.startEdition = function startEdition() {
        const self = this;

        self.inEdition = true;
        self.saveForEdition = {
          screenListType: angular.copy(self.screenListType),
          schedulerCategory: angular.copy(self.schedulerCategory),
          screenListConditions: angular.copy(self.screenListConditions),
          timeConditions: angular.copy(self.timeConditions),
        };

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.stopEdition = function stopEdition(
        cancel,
      ) {
        const self = this;

        if (self.saveForEdition && cancel) {
          self.screenListType = angular.copy(
            self.saveForEdition.screenListType,
          );
          self.schedulerCategory = angular.copy(
            self.saveForEdition.schedulerCategory,
          );
        }

        if (cancel) {
          // cancel screen list conditions
          // remove draft
          remove(self.screenListConditions, {
            state: 'DRAFT',
          });

          // and reset status of conditions to delete
          self.screenListConditions.forEach((condition) => {
            if (condition.state === 'TO_DELETE') {
              set(condition, 'state', 'OK');
            }
          });

          // cancel time conditions
          // remove draft
          remove(self.timeConditions, {
            state: 'DRAFT',
          });

          // and reset status of conditions to delete
          self.timeConditions.forEach((timeCondition) => {
            if (timeCondition.state === 'TO_DELETE') {
              set(timeCondition, 'state', 'OK');
            }
          });
        }

        self.saveForEdition = null;
        self.inEdition = false;

        return self;
      };

      TelephonyGroupNumberOvhPabxDialplanExtension.prototype.hasChange = function hasChange(
        attr,
      ) {
        const self = this;

        if (!self.inEdition || !self.saveForEdition) {
          return false;
        }

        if (attr) {
          switch (attr) {
            case 'screenListConditions':
              // there is change in screen list conditions if one or more condition
              // is in creation (draft) or to delete state
              return some(
                self.screenListConditions,
                (screenListCondition) =>
                  ['DRAFT', 'TO_DELETE'].indexOf(screenListCondition.state) !==
                  -1,
              );
            case 'timeConditions':
              // there is change in screen time conditions if one or more condition
              // is in creation (draft) or to delete state
              return some(
                self.timeConditions,
                (timeCondition) =>
                  ['DRAFT', 'TO_DELETE'].indexOf(timeCondition.state) !== -1,
              );
            default:
              return !isEqual(get(self.saveForEdition, attr), get(self, attr));
          }
        } else {
          return (
            self.hasChange('screenListType') ||
            self.hasChange('schedulerCategory') ||
            self.hasChange('screenListConditions') ||
            self.hasChange('timeConditions')
          );
        }
      };

      /* -----  End of PROTOTYPE METHODS  ------*/

      return TelephonyGroupNumberOvhPabxDialplanExtension;
    },
  );
