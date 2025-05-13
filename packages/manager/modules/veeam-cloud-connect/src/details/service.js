import difference from 'lodash/difference';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import indexOf from 'lodash/indexOf';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
import 'moment';

const taskMessages = {
  updateRepositoryQuota: 'veeam_storage_update_quota_',
  addBackupRepositoryToCloudTenant: 'veeam_add_repository_',
};

export default class VeeamCloudConnectService {
  /* @ngInject */
  constructor(
    $interval,
    $q,
    $timeout,
    $translate,
    $filter,
    OvhApiVeeam,
    ovhManagerRegionService,
  ) {
    this.$interval = $interval;
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$filter = $filter;
    this.veeam = OvhApiVeeam.v6();
    this.ovhManagerRegionService = ovhManagerRegionService;

    this.unitOfWork = {};
    this.unitOfWork.init = () => {
      this.unitOfWork.messages = [];
      this.unitOfWork.tasks = [];
      this.unitOfWork.doneTasks = [];
      this.unitOfWork.errorTasks = [];
      this.startPolling();
    };

    this.pollingDeferred = {};
  }

  getConfigurationInfos(serviceName) {
    return this.$q
      .all({
        detail: this.veeam.getDetails({
          serviceName,
        }).$promise,
        inventoryNames: this.veeam.getInventories({
          serviceName,
        }).$promise,
      })
      .then((response) =>
        this.acceptResponse(this.transformConfigurationInfos(response)),
      )
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_infos_configuration_load_error'),
        ),
      );
  }

  transformConfigurationInfos(infos) {
    set(
      infos,
      'detail.location',
      this.ovhManagerRegionService.getRegion(infos.detail.location),
    );
    set(infos, 'detail.backupCount', infos.inventoryNames.length);
    return infos.detail;
  }

  getStorages(serviceName) {
    return this.veeam
      .getInventories({
        serviceName,
      })
      .$promise.then((storages) => {
        const storagesPromises = storages.map((storage) =>
          this.getStorageDetails(serviceName, storage),
        );
        return this.$q.all(storagesPromises);
      })
      .then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('veeam_storage_list_load_error'),
        ),
      );
  }

  getStorageDetails(serviceName, inventoryName) {
    return this.veeam.getInventory({
      serviceName,
      inventoryName,
    }).$promise;
  }

  getSubscriptionInfos(serviceName) {
    return this.$q
      .all({
        details: this.veeam.getDetails({ serviceName }).$promise,
        serviceInfo: this.veeam.getServiceInfos({ serviceName }).$promise,
      })
      .then((response) =>
        this.acceptResponse(this.transformSubscriptionInfos(response)),
      )
      .catch((response) =>
        this.rejectResponse(
          response.data,
          this.$translate.instant('veeam_infos_subscription_load_error'),
        ),
      );
  }

  transformSubscriptionInfos(data) {
    const renewalType =
      data.serviceInfo.renew.automatic === true ? 'automatic' : 'manual';
    set(data, 'serviceInfo.offer', data.details.productOffer);
    set(data, 'serviceInfo.renewalType', renewalType);
    set(
      data,
      'serviceInfo.renewalTypeDescription',
      this.$translate.instant(
        `veeam_infos_subscription_renew_${renewalType}_description`,
      ),
    );
    set(data, 'serviceInfo.isOnTrial', data.serviceInfo.offer === 'demo');
    set(
      data,
      'serviceInfo.subscriptionTimeRemaining',
      moment(data.serviceInfo.expiration).diff(moment(), 'days'),
    );

    return data.serviceInfo;
  }

  getOrderableOffers(serviceName) {
    return this.veeam
      .getOrderableOffers({
        serviceName,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_orderable_offer_load_error'),
        ),
      );
  }

  getOrderableOfferPrices(serviceName) {
    return this.veeam
      .getOrderableOffers({
        serviceName,
      })
      .$promise.then((offers) => {
        const promises = map(offers, (offer) =>
          this.getUpgradeOptionDurations(serviceName, offer).then((durations) =>
            map(durations.data, (duration) => ({ offer, duration })),
          ),
        );
        return this.$q.all(promises).then((durations) => flatten(durations));
      })
      .then((durations) => {
        const promises = map(durations, (duration) =>
          this.getUpgradeOptionPrices(
            serviceName,
            duration.offer,
            duration.duration,
          ).then((price) => ({
            offer: duration.offer,
            duration: duration.duration,
            price: price.data,
          })),
        );
        return this.$q.all(promises);
      })
      .then((response) => this.acceptResponse(response))
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_orderable_offer_load_error'),
        ),
      );
  }

  getUpgradeOptionDurations(serviceName, offer) {
    return this.veeam
      .getOrderUpgradeDurations({
        serviceName,
        offer,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) => this.rejectResponse(response));
  }

  getUpgradeOptionPrices(serviceName, offer, duration) {
    return this.veeam
      .getOrderUpgradeDurationsPrices({
        serviceName,
        duration,
        offer,
      })
      .$promise.then((response) => this.acceptResponse(response))
      .catch((response) => this.rejectResponse(response));
  }

  updateOffer(serviceName, offer, duration) {
    return this.veeam
      .createUpgradeOrder(
        {
          serviceName,
          duration,
        },
        {
          offer,
        },
      )
      .$promise.then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant('veeam_update_offer_post_success', {
            orderId: response.orderId,
            orderUrl: response.url,
          }),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_update_offer_post_error'),
        ),
      );
  }

  addBackupRepository(serviceName) {
    return this.veeam
      .addInventory(
        {
          serviceName,
        },
        {},
      )
      .$promise.then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant('veeam_add_repository_success'),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_add_repository_error'),
        ),
      );
  }

  updateRepositoryQuota(serviceName, inventoryName, newQuota) {
    return this.veeam
      .upgradeQuota(
        {
          serviceName,
          inventoryName,
        },
        {
          newQuota,
        },
      )
      .$promise.then((response) =>
        this.acceptResponse(
          response,
          this.$translate.instant('veeam_storage_update_quota_success'),
        ),
      )
      .catch((response) =>
        this.rejectResponse(
          response,
          this.$translate.instant('veeam_storage_update_quota_error'),
        ),
      );
  }

  getCapabilities(serviceName) {
    return this.veeam.capabilities({
      serviceName,
    }).$promise;
  }

  getActions(serviceName) {
    return this.$q
      .all({
        storages: this.getStorages(serviceName),
        capabilities: this.getCapabilities(serviceName),
        subcription: this.getSubscriptionInfos(serviceName),
      })
      .then((results) => {
        const storages = results.storages.data;
        const { capabilities } = results;
        const subscription = results.subcription.data;

        const addStorage = {
          available: true,
        };

        if (!capabilities.multiStorages) {
          addStorage.available = false;
          addStorage.reason = this.$translate.instant(
            'veeam_action_add_storage_unavailable_offer',
            { offer: subscription.offer },
          );
        } else if (storages.length >= capabilities.maxStoragesCount) {
          addStorage.available = false;
          addStorage.reason = this.$translate.instant(
            'veeam_action_add_storage_unavailable_storage_number',
          );
        } else if (this.calculateUsage(storages) < capabilities.minimumUsage) {
          addStorage.available = false;
          addStorage.reason = this.$translate.instant(
            'veeam_action_add_storage_unavailable_usage_percentage',
            { usagePercentage: capabilities.minimumUsage },
          );
        }

        return this.acceptResponse({
          addStorage,
          manageBilling: {
            available: true,
          },
          upgradeOffer: {
            available: subscription.isOnTrial,
            reason: !subscription.isOnTrial
              ? this.$translate.instant(
                  'veeam_action_upgrade_offer_no_upgrade',
                  { offer: subscription.offer },
                )
              : '',
          },
        });
      });
  }

  calculateUsage(storages) {
    const usage = sum(
      map(storages, (storage) => {
        if (
          storage.quotaUsed &&
          storage.quotaUsed.value &&
          storage.quotaUsed.unit
        ) {
          return this.$filter('bytes')(
            storage.quotaUsed.value,
            0,
            false,
            storage.quotaUsed.unit,
            true,
          );
        }
        return 0;
      }),
    );

    const available = sum(
      map(storages, (storage) =>
        this.$filter('bytes')(
          storage.quota.value,
          0,
          false,
          storage.quota.unit,
          true,
        ),
      ),
    );

    return (100 * usage) / available;
  }

  getTasks(serviceName, options) {
    return this.veeam
      .tasks({ serviceName, ...options })
      .$promise.then((tasks) => {
        const promises = map(
          tasks,
          (task) =>
            this.veeam.task({
              serviceName,
              taskId: task,
            }).$promise,
        );
        return this.$q.all(promises);
      });
  }

  getTask(serviceName, taskId) {
    return this.veeam.task({
      serviceName,
      taskId,
    }).$promise;
  }

  startPolling(serviceName, task) {
    const poll = () => {
      this.poller = this.$timeout();
      if (this.isPolling) {
        this.poller = this.$timeout(poll, 5000);
        return null;
      }
      this.isPolling = true;
      return this.$q
        .all([
          this.getTasks(serviceName, { state: 'doing' }),
          this.getTasks(serviceName, { state: 'todo' }),
        ])
        .then((result) => flatten(result))
        .then((tasks) => {
          this.checkTasks(serviceName, tasks);
        })
        .catch(() => {
          this.stopPolling();
          // TODO: Post message to notify this error.
        })
        .finally(() => {
          this.isPolling = false;
          if (this.unitOfWork.tasks.length) {
            this.poller = this.$timeout(poll, 5000);
          }
        });
    };

    if (!this.poller) {
      this.$timeout(poll, 0);
    }

    if (task) {
      // Add this new task to pending tasks
      this.unitOfWork.tasks.push(task);
      this.pollingDeferred[task.taskId] = this.$q.defer();
      return this.pollingDeferred[task.taskId].promise;
    }

    return this.$q.resolve();
  }

  stopPolling() {
    if (this.poller) {
      this.$timeout.cancel(this.poller);
      this.poller = undefined;
      this.pollingDeferred = [];
    }
  }

  getPendingTasksMessages() {
    let messagesByTaskName = groupBy(
      uniqBy(this.unitOfWork.tasks, 'taskId'),
      'name',
    );
    messagesByTaskName = forEach(messagesByTaskName, (task, taskName) => {
      const taskMessage = taskMessages[taskName];

      // We only watch some tasks.
      if (taskMessage) {
        messagesByTaskName[taskName] = {
          message: this.$translate.instant(`${taskMessage}pending`),
          task,
        };
      }
    });
    return messagesByTaskName;
  }

  checkTasks(serviceName, tasks) {
    const oldTasksIds = map(this.unitOfWork.tasks, 'taskId');
    const tasksIds = map(tasks, 'taskId');
    const completedTasksIds = difference(oldTasksIds, tasksIds);
    if (completedTasksIds.length) {
      const completedTasks = this.unitOfWork.tasks.filter(
        (task) => completedTasksIds.indexOf(task.taskId) >= 0,
      );
      this.$q
        .all(
          completedTasks.map((task) => {
            const deferred = this.pollingDeferred[task.taskId];
            return this.getTask(serviceName, task.taskId).then(
              (completedTask) => {
                if (completedTask.state === 'done') {
                  this.unitOfWork.doneTasks.push(completedTask);
                  if (deferred) {
                    deferred.resolve(completedTask);
                    this.unitOfWork.messages.push({
                      text: this.$translate.instant(
                        `${taskMessages[task.name]}success`,
                      ),
                      type: 'success',
                    });
                  }
                } else if (
                  completedTask.state === 'todo' ||
                  completedTask.state === 'doing'
                ) {
                  // Task is finally not done...
                  tasks.push(completedTask);
                } else {
                  this.unitOfWork.errorTasks.push(completedTask);
                  if (deferred) {
                    deferred.reject(completedTask);
                    this.unitOfWork.messages.push({
                      text: this.$translate.instant(
                        `${taskMessages[task.name]}error`,
                      ),
                      type: 'error',
                    });
                  }
                }
              },
            );
          }),
        )
        .then(() => {
          this.unitOfWork.tasks = filter(
            tasks,
            (task) => indexOf(keys(taskMessages), task.name) >= 0,
          );
          if (!this.unitOfWork.tasks.length) {
            this.stopPolling();
          }
        });
    }
  }

  acceptResponse(data, message) {
    return this.$q.resolve({
      status: 'OK',
      data,
      message,
    });
  }

  rejectResponse(data, message) {
    return this.$q.reject({
      status: 'ERROR',
      data,
      message,
    });
  }
}
