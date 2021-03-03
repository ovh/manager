import filter from 'lodash/filter';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import union from 'lodash/union';

angular
  .module('services')
  .service('Nas', function nas($q, constants, OvhHttp, Poll) {
    const self = this;
    const cacheNas = {
      all: 'UNIVERS_DEDICATED_NAS',
      constants: 'UNIVERS_DEDICATED_NAS_CONSTANTS',

      partitionsIds: 'UNIVERS_DEDICATED_NAS_PARTITIONS_IDS',
      partitionsDetails: 'UNIVERS_DEDICATED_NAS_PARTITIONS_DETAILS',

      partitionsAccessIds: 'UNIVERS_DEDICATED_NAS_PARTITIONS_ACCESS_IDS',
      partitionsAccessDetails:
        'UNIVERS_DEDICATED_NAS_PARTITIONS_ACCESS_DETAILS',
    };

    self.operations = {
      partition: [
        'clusterLeclercPartitionAdd',
        'clusterLeclercPartitionDelete',
        'nasPartitionAdd',
        'nasPartitionDelete',
        'clusterLeclercPartitionUpdate',
        'nasPartitionUpdate',
      ],
      access: ['clusterLeclercAclUpdate', 'nasAclUpdate'],
      snapshot: ['clusterLeclercSnapshotUpdate'],
    };

    // ---------------TOOLS-------------------

    self.getNasType = function getNasType(nasId) {
      if (!isEmpty(nasId)) {
        return nasId.split('-')[0];
      }
      return '';
    };

    self.getNasId = function getNasId(nasId) {
      return nasId.replace(`${self.getNasType(nasId)}_`, '');
    };

    function getNasIds(nasId) {
      return {
        nasType: self.getNasType(nasId),
        serviceName: self.getNasId(nasId),
      };
    }

    // ---------------POLLING-------------------

    self.getTasknewPath = function getTasknewPath(nasId, taskId) {
      const nasType = self.getNasType(nasId);

      if (nasType) {
        return URI.expand(
          'apiv6/dedicated/{nasType}/{serviceName}/task/{taskId}',
          {
            nasType,
            serviceName: self.getNasId(nasId),
            taskId,
          },
        ).toString();
      }
      return null;
    };

    self.poll = function poll(nasId, taskId) {
      return Poll.poll(self.getTasknewPath(nasId, taskId), null, {
        successRule: { status: 'done' },
        namespace: 'nas.polling',
      });
    };

    self.killPoll = function killPoll() {
      return Poll.kill({ namespace: 'nas.polling' });
    };

    function getTaskNotDone(nasId, status, operation) {
      return OvhHttp.get('/dedicated/{nasType}/{serviceName}/task', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        params: {
          status,
          operation,
        },
      }).catch(() => $q.reject(null));
    }

    self.getTaskInProgressOf = function getTaskInProgressOf(nasId, operation) {
      return $q
        .allSettled([
          getTaskNotDone(nasId, 'todo', operation),
          getTaskNotDone(nasId, 'init', operation),
          getTaskNotDone(nasId, 'doing', operation),
        ])
        .then((tasks) => {
          let tabTasks = [];
          angular.forEach(tasks, (taskOperation) => {
            if (taskOperation !== null) {
              tabTasks = union(tabTasks, taskOperation);
            }
          });
          return tabTasks;
        });
    };

    // ---------------INFO-------------------

    // SWS
    self.getNas = function getNas() {
      return OvhHttp.get('/sws/dedicated/nastype', {
        rootPath: '2api',
      });
    };

    self.getUrlRenew = function getUrlRenew(nasId) {
      return URI.expand(constants.renew, {
        serviceName: self.getNasId(nasId),
      }).toString();
    };

    self.getConstant = function getConstant(nasId) {
      return OvhHttp.get(`/dedicated/${self.getNasType(nasId)}.json`, {
        rootPath: 'apiv6',
      }).then(({ models }) => models['dedicated.storage.ProtocolEnum'].enum);
    };

    self.getSelected = function getSelected(nasId, forceRefresh) {
      return OvhHttp.get('/dedicated/{nasType}/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        cache: cacheNas.all,
        clearCache: forceRefresh,
      });
    };

    self.getServiceInfos = function getServiceInfos(nasId, forceRefresh) {
      return OvhHttp.get('/dedicated/{nasType}/{serviceName}/serviceInfos', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        cache: cacheNas.all,
        clearCache: forceRefresh,
      });
    };

    self.updateNasDetails = function updateNasDetails(
      nasId,
      customName,
      monitored,
    ) {
      return OvhHttp.put('/dedicated/{nasType}/{serviceName}', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        data: {
          customName,
          monitored,
        },
        cache: cacheNas.all,
        clearCache: cacheNas.all,
      });
    };

    // ---------------PARTITIONS-------------------

    self.getPartitionsIds = function getPartitionsIds(nasId, forceRefresh) {
      return OvhHttp.get('/dedicated/{nasType}/{serviceName}/partition', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        cache: cacheNas.partitionsIds,
        clearAllCache: forceRefresh
          ? [cacheNas.partitionsIds, cacheNas.partitionsDetails]
          : false,
      });
    };

    self.addPartition = function addPartition(
      nasId,
      partitionName,
      protocol,
      size,
    ) {
      return OvhHttp.post('/dedicated/{nasType}/{serviceName}/partition', {
        rootPath: 'apiv6',
        urlParams: getNasIds(nasId),
        data: {
          partitionName,
          protocol,
          size,
        },
      });
    };

    self.getPartition = function getPartition(nasId, partitionName) {
      return OvhHttp.get(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
          cache: cacheNas.partitionsDetails,
        },
      );
    };

    self.deletePartition = function deletePartition(nasId, partitionName) {
      return OvhHttp.delete(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
        },
      );
    };

    self.updatePartitionSize = function updatePartitionSize(
      nasId,
      partitionName,
      size,
    ) {
      return OvhHttp.put(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
          data: {
            size,
          },
          cache: cacheNas.partitionsDetails,
          clearCache: cacheNas.partitionsDetails,
        },
      );
    };

    // ---------------ACCESS-------------------

    self.getAccessIds = function getAccessIds(
      nasId,
      partitionName,
      forceRefresh,
    ) {
      return OvhHttp.get(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/access',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
          cache: cacheNas.partitionsAccessIds,
          clearAllCache: forceRefresh
            ? [cacheNas.partitionsAccessIds, cacheNas.partitionsAccessDetails]
            : false,
        },
      );
    };

    self.addAccess = function addAccess(nasId, partitionName, ip) {
      return OvhHttp.post(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/access',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
          data: {
            ip,
          },
          cache: cacheNas.partitionsAccessIds,
          clearCache: cacheNas.partitionsAccessIds,
        },
      );
    };

    self.deleteAccess = function deleteAccess(nasId, partitionName, ip) {
      return OvhHttp.delete(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/access/{ip}',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
            ip,
          },
          cache: cacheNas.partitionsAccessDetails,
          clearAllCache: cacheNas.partitionsAccessIds,
          clearCache: cacheNas.partitionsAccessDetails,
        },
      );
    };

    // SWS
    self.getAuthorizableIps = function getAuthorizableIps(
      nasId,
      partitionName,
    ) {
      return OvhHttp.get(
        '/sws/dedicated/{nasType}/{serviceName}/partitions/{partitionName}/authorizableIps',
        {
          rootPath: '2api',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
        },
      );
    };

    // ---------------SNAPSHOTS-------------------

    function getSnapshotEnum() {
      return OvhHttp.get('/dedicated/nasha.json', {
        rootPath: 'apiv6',
      }).then((shcema) => shcema.models['dedicated.storage.SnapshotEnum'].enum);
    }

    self.getSnapshots = function getSnapshots(nasId, partitionName) {
      const promiseTab = [];

      promiseTab.push(getSnapshotEnum());

      promiseTab.push(
        OvhHttp.get(
          '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/snapshot',
          {
            rootPath: 'apiv6',
            urlParams: {
              nasType: self.getNasType(nasId),
              serviceName: self.getNasId(nasId),
              partitionName,
            },
          },
        ),
      );

      return $q.all(promiseTab).then((data) => {
        const res = [];

        if (data.length !== 2) {
          $q.reject(null);
        }

        const snapshotEnum = data[0];
        const snapshot = data[1];

        angular.forEach(snapshotEnum, (snap) => {
          res.push({
            type: snap,
            active: indexOf(snapshot, snap) >= 0,
          });
        });
        return res;
      });
    };

    self.postSnapshots = function postSnapshots(
      nasId,
      partitionName,
      snapshots,
    ) {
      const promiseTab = [];

      angular.forEach(snapshots, (snapshot) => {
        if (snapshot.active) {
          promiseTab.push(
            self
              .postSnapshot(nasId, partitionName, snapshot.type)
              .catch((data) => $q.reject({ type: snapshot.type, error: data })),
          );
        } else {
          promiseTab.push(
            self
              .deleteSnapshot(nasId, partitionName, snapshot.type)
              .catch((data) => $q.reject({ type: snapshot.type, error: data })),
          );
        }
      });

      return $q
        .allSettled(promiseTab)
        .catch((data) =>
          $q.reject(
            filter(data, (snapshotError) =>
              angular.isDefined(snapshotError.error),
            ),
          ),
        );
    };

    self.postSnapshot = function postSnapshot(
      nasId,
      partitionName,
      snapshotType,
    ) {
      return OvhHttp.post(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/snapshot',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
          },
          data: {
            snapshotType,
          },
        },
      );
    };

    self.deleteSnapshot = function deleteSnapshot(
      nasId,
      partitionName,
      snapshotType,
    ) {
      return OvhHttp.delete(
        '/dedicated/{nasType}/{serviceName}/partition/{partitionName}/snapshot/{snapshotType}',
        {
          rootPath: 'apiv6',
          urlParams: {
            nasType: self.getNasType(nasId),
            serviceName: self.getNasId(nasId),
            partitionName,
            snapshotType,
          },
        },
      );
    };

    // ---------------ORDER SWS-------------------

    self.getOrderList = function getOrderList() {
      return OvhHttp.get('/sws/dedicated/nastype/order', {
        rootPath: '2api',
      });
    };

    const NasHAZoneEnum = {
      BHS: 'bhs',
      GRA: 'gra',
      RBX: 'rbx',
      SBG: 'sbg',
    };

    const NasHAOfferEnum = {
      _1200_G: '1200g',
      _13200_G: '13200g',
      _19200_G: '19200g',
      _2400_G: '2400g',
      _26400_G: '26400g',
      _3600_G: '3600g',
      _7200_G: '7200g',
    };

    self.getBCNasha = function getBCNasha(model, datacenter, duration) {
      return OvhHttp.get('/order/dedicated/nasha/new/{duration}', {
        rootPath: 'apiv6',
        urlParams: {
          type: 'nasha',
          duration,
        },
        params: {
          datacenter: NasHAZoneEnum[datacenter],
          model: NasHAOfferEnum[model],
        },
      });
    };

    self.postBCNasha = function postBCNasha(model, datacenter, duration) {
      return OvhHttp.post('/order/dedicated/nasha/new/{duration}', {
        rootPath: 'apiv6',
        urlParams: {
          type: 'nasha',
          duration,
        },
        data: {
          datacenter: NasHAZoneEnum[datacenter],
          model: NasHAOfferEnum[model],
        },
      });
    };
  });
