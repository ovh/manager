import find from 'lodash/find';
import remove from 'lodash/remove';
import some from 'lodash/some';

export default class NashaPartitionAccessCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor($scope, $state, $stateParams, $translate, $uibModal, $q, OvhApiDedicatedNasha, Poller, CucCloudMessage) {
    const self = this;

    self.$state = $state;

    self.data = {
      nasha: {},
      partition: {},
      addAccessInProgress: [],
      taskForAccess: [],
    };

    self.table = {
      accessIps: [],
      refresh: false,
    };

    self.loaders = {
      table: false,
    };

    self.load = function load(resetCache) {
      self.loaders.table = true;
      if (resetCache) {
        OvhApiDedicatedNasha.Partition().Access().v6().resetCache();
      }
      $q.all({
        nasha: OvhApiDedicatedNasha.v6().get({ serviceName: $stateParams.nashaId }).$promise,
        partition: OvhApiDedicatedNasha.Partition().v6()
          .get({
            serviceName: $stateParams.nashaId,
            partitionName: $stateParams.partitionName,
          }).$promise,
        accesses: OvhApiDedicatedNasha.Partition().Access().v6()
          .query({
            serviceName: $stateParams.nashaId,
            partitionName: $stateParams.partitionName,
          }).$promise,
      }).then((data) => {
        self.data.nasha = data.nasha;
        self.data.partition = data.partition;
        self.table.accessIps = data.accesses.map(ip => ({
          ip,
        }));
        if (resetCache) {
          self.table.refresh = !self.table.refresh;
        }
      }).catch((err) => {
        CucCloudMessage.error($translate.instant('nasha_partitions_access_no_data_error'));
        return $q.reject(err);
      }).finally(() => {
        self.loaders.table = false;
      });
    };

    self.getAccessForIp = function getAccessForIp(accessIp) {
      // If the access is being added, return the local data
      const accessAddInProgress = find(self.data.addAccessInProgress, item => item.ip === accessIp);
      if (accessAddInProgress) {
        return accessAddInProgress;
      }

      // if not we get the details form the api
      return OvhApiDedicatedNasha.Partition().Access().v6().get({
        serviceName: self.data.nasha.serviceName,
        partitionName: self.data.partition.partitionName,
        ip: accessIp,
      }).$promise.then(data => data);
    };

    self.transformItem = function transformItem(access) {
      return self.getAccessForIp(access.ip);
    };

    self.removeAccess = function removeAccess(access) {
      self.openModal('nasha/partition/access/delete/template.html', 'NashaPartitionAccessDeleteCtrl', {
        serviceName: self.data.nasha.serviceName,
        access,
        partitionName: self.data.partition.partitionName,
      });
    };

    self.addAccess = function addAccess() {
      self.openModal('nasha/partition/access/add/template.html', 'NashaPartitionAccessAddCtrl', {
        serviceName: self.data.nasha.serviceName,
        partition: self.data.partition,
      });
    };

    /*= =====================================
       =                Polling              =
       ====================================== */

    function launchPolling(taskId) {
      return Poller.poll(`/dedicated/nasha/${self.data.nasha.serviceName}/task/${taskId}`,
        null,
        {
          successRule(task) {
            return task.status === 'done';
          },
          errorRule(task) {
            return ['doing', 'todo', 'done'].indexOf(task.status) === -1;
          },
          namespace: 'nasha.access',
        });
    }

    function pollTasksForAccess(access, taskId) {
      launchPolling(taskId)
        .finally(() => {
          // Remove from the polling list
          remove(self.data.taskForAccess, item => item.task === taskId);

          // If the partition was in creation, remove it from the creation list
          remove(self.data.addAccessInProgress, item => item.ip === access.ip);

          self.updateAccess(access);
        });
    }

    $scope.$on('$destroy', () => {
      Poller.kill({ namespace: 'nasha.access' });
    });

    self.openModal = function openModal(template, controller, params) {
      const modal = $uibModal.open({
        templateUrl: template,
        controller,
        controllerAs: controller,
        resolve: {
          items() {
            return params;
          },
        },
      });

      modal.result.then((data) => {
        if (data.isNew) {
          self.table.accessIps.push(data.access);
          self.data.addAccessInProgress.push(data.access);
        }
        self.data.taskForAccess.push({ task: data.task, access: data.access });
        pollTasksForAccess(data.access, data.task);
      });
    };

    self.updateAccess = function updateAccess() {
      self.load(true);
    };

    self.hasTaskInProgress = function hasTaskInProgress(access) {
      return some(self.data.taskForAccess, { access });
    };

    self.load();
  }
}
