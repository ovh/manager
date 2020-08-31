import find from 'lodash/find';
import flatten from 'lodash/flatten';

export default class IpLoadBalancerConfigurationService {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $translate,
    CucCloudMessage,
    OvhApiIpLoadBalancing,
    CucRegionService,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucRegionService = CucRegionService;
    this.CucServiceHelper = CucServiceHelper;
  }

  getPendingChanges(serviceName) {
    return this.IpLoadBalancing.v6().pendingChanges({ serviceName }).$promise;
  }

  getAllZonesChanges(serviceName) {
    return this.$q
      .all({
        description: this.IpLoadBalancing.v6().get({ serviceName }),
        pendingChanges: this.getPendingChanges(serviceName),
        tasks: this.getRefreshTasks(serviceName),
      })
      .then(({ description, pendingChanges, tasks }) =>
        description.zone.map((zone) => {
          const pending = find(pendingChanges, { zone });
          return {
            id: zone,
            name: this.CucRegionService.getRegion(zone).microRegion.text,
            changes: pending ? pending.number : 0,
            task: this.constructor.getLastUndoneTask(tasks, zone),
          };
        }),
      )
      .catch(
        this.CucServiceHelper.errorHandler('iplb_configuration_info_error'),
      );
  }

  getZoneChanges(serviceName, zone) {
    return this.$q
      .all({
        pendingChanges: this.getPendingChanges(serviceName),
        tasks: this.getRefreshTasks(serviceName, ['todo', 'doing', 'done']),
      })
      .then(({ pendingChanges, tasks }) => {
        const pending = find(pendingChanges, { zone });
        return {
          id: zone,
          name: this.CucRegionService.getRegion(zone).microRegion.text,
          changes: pending ? pending.number : 0,
          task: this.constructor.getLastUndoneTask(tasks, zone),
        };
      })
      .catch(
        this.CucServiceHelper.errorHandler('iplb_configuration_info_error'),
      );
  }

  static getLastUndoneTask(tasks, zone) {
    const result = tasks.sort((a, b) => {
      if (a.creationDate > b.creationDate) {
        return -1;
      }
      if (a.creationDate === b.creationDate) {
        return 0;
      }

      return 1;
    });
    return find(result, (task) => task.zones && task.zones.indexOf(zone) > -1);
  }

  refresh(serviceName, zone) {
    return this.IpLoadBalancing.v6()
      .refresh(
        {
          serviceName,
        },
        {
          zone,
        },
      )
      .$promise.then(() =>
        this.CucServiceHelper.successHandler(
          'iplb_configuration_apply_success',
        )(),
      )
      .catch(
        this.CucServiceHelper.errorHandler('iplb_configuration_apply_error'),
      );
  }

  batchRefresh(serviceName, zones) {
    const promises = zones.map(
      (zone) =>
        this.IpLoadBalancing.v6().refresh(
          {
            serviceName,
          },
          {
            zone,
          },
        ).$promise,
    );

    return this.$q
      .all(promises)
      .then((refreshResults) => {
        refreshResults.forEach(() =>
          this.CucServiceHelper.successHandler(
            'iplb_configuration_apply_success',
          )(),
        );
      })
      .catch(
        this.CucServiceHelper.errorHandler('iplb_configuration_apply_error'),
      );
  }

  getRefreshTasks(serviceName, statuses) {
    let tasksPromise;

    if (statuses) {
      tasksPromise = this.$q
        .all(
          statuses.map(
            (status) =>
              this.IpLoadBalancing.Task()
                .v6()
                .query({
                  serviceName,
                  action: 'refreshIplb',
                  status,
                }).$promise,
          ),
        )
        .then((tasksResults) => flatten(tasksResults));
    } else {
      tasksPromise = this.IpLoadBalancing.Task()
        .v6()
        .query({
          serviceName,
          action: 'refreshIplb',
        }).$promise;
    }

    return tasksPromise.then((ids) =>
      this.$q.all(
        ids.map(
          (id) =>
            this.IpLoadBalancing.Task()
              .v6()
              .get({
                serviceName,
                taskId: id,
              }).$promise,
        ),
      ),
    );
  }

  showRefreshWarning() {
    this.CucCloudMessage.warning(
      {
        text: this.$translate.instant('iplb_configuration_pending_changes'),
        link: {
          type: 'state',
          text: this.$translate.instant('iplb_configuration_action_apply'),
          state: 'iplb.detail.configuration',
        },
      },
      'iplb.detail',
    );
  }
}
