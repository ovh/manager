import set from 'lodash/set';
import get from 'lodash/get';

export default class NashaPartitionAccessAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
  ) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
  }

  $onInit() {
    this.loading = false;
    this.data = {
      serviceName: this.serviceName,
      partitionName: this.partition,
      accessAvailable: [],
      accessToAdd: null,
      type: 'readwrite', // readonly or readwrite
    };
    this.loadAccessList();
  }

  loadAccessList() {
    this.loading = true;
    this.OvhApiDedicatedNasha.Partition().Access().Aapi()
      .authorizableIps({
        serviceName: this.data.serviceName,
        partitionName: this.data.partitionName,
      }).$promise.then((result) => {
        angular.forEach(result, (ip) => {
          if (!ip.description) {
            // ng-options groupby won't group items with undefined group.
            // We have to replace null with undefined.
            set(ip, 'description', undefined);
          }
        });
        this.data.accessAvailable = result;
      }).catch(() => {
        this.CucCloudMessage.error(this.$translate.instant('nasha_partitions_access_loading_error'));
      }).finally(() => {
        this.loading = false;
      });
  }

  addAccess() {
    this.loading = true;
    this.OvhApiDedicatedNasha.Partition().Access().v6().add({
      serviceName: this.data.serviceName,
      partitionName: this.data.partitionName,
    }, {
      ip: this.data.accessToAdd.ip,
      type: this.data.type,
    }).$promise.then((result) => this.goToPartitionAccessPage(
      this.$translate.instant('nasha_access_action_add_success', {
        accessIp: this.data.accessToAdd.ip,
      }),
      'success',
      {
        access: {
          ip: this.data.accessToAdd.ip,
          type: this.data.type,
        },
        task: result.data.taskId,
        isNew: true,
      },
    ))
      .catch((error) => this.goToPartitionAccessPage(
        this.$translate.instant('nasha_access_action_add_failure', {
          accessIp: this.data.accessToAdd.ip,
          message: get(error, 'data.message'),
        }),
        'error',
      ))
      .finally(() => {
        this.loading = false;
      });
  }

  dismiss() {
    this.goToPartitionAccessPage();
  }
}
