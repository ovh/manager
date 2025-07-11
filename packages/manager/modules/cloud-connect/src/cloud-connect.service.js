import { find, forOwn, map } from 'lodash';

import CloudConnect from './cloud-connect.class';
import CloudConnectDatacenter from './cloud-connect-datacenter.class';
import CloudConnectDatacenterExtra from './cloud-connect-datacenter-extra.class';
import CloudConnectTasks from './cloud-connect-tasks.class';
import CloudConnectDiagnostics from './cloud-connect-diagnostics.class';
import CloudConnectServiceKey from './cloud-connect-service-key.class';
import CloudConnectInterface from './cloud-connect-interface.class';

import {
  POP_TYPES,
  POP_TYPE_CONSTANT,
  STATUS,
} from './cloud-connect.constants';

export default class CloudConnectService {
  /* @ngInject */
  constructor(
    $cacheFactory,
    $q,
    $http,
    atInternet,
    Poller,
    OvhApiVrack,
    iceberg,
    $translate,
  ) {
    this.$cacheFactory = $cacheFactory;
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.Poller = Poller;
    this.OvhApiVrack = OvhApiVrack;
    this.POP_TYPES = POP_TYPES;
    this.iceberg = iceberg;
    this.cache = {
      cloudConnect: $cacheFactory('CLOUD_CONNECT'),
      serviceInfo: $cacheFactory('CLOUD_CONNECT_SERVICE_INFOS'),
      datacenterQuery: $cacheFactory('CLOUD_CONNECT_DATACENTER_QUERY'),
      datacenter: $cacheFactory('CLOUD_CONNECT_DATACENTER'),
      popConfigurationQuery: $cacheFactory(
        'CLOUD_CONNECT_POP_CONFIGURATION_QUERY',
      ),
      popConfiguration: $cacheFactory('CLOUD_CONNECT_POP_CONFIGURATION'),
      interface: $cacheFactory('CLOUD_CONNECT_INTERFACE'),
      serviceKeys: $cacheFactory('SERVICE_KEYS'),
      serviceKeyIds: $cacheFactory('SERVICE_KEY_IDS'),
      datacenterConfigQuery: $cacheFactory(
        'CLOUD_CONNECT_DATACENTER_CONFIG_LIST',
      ),
      datacenterConfig: $cacheFactory('CLOUD_CONNECT_DATACENTER_CONFIG'),
      datacenterConfigExtraQuery: $cacheFactory(
        'CLOUD_CONNECT_DATACENTER_EXTRA_QUERY',
      ),
      datacenterConfigExtra: $cacheFactory('CLOUD_CONNECT_DATACENTER_EXTRA'),
      serviceDetails: $cacheFactory('CLOUD_CONNECT_SERVICE_DETAILS'),
    };
  }

  getCloudConnect(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}`, {
        cache: this.cache.cloudConnect,
      })
      .then(({ data }) => new CloudConnect(data));
  }

  getCloudConnectServiceInfo(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/serviceInfos`, {
        cache: this.cache.serviceInfo,
      })
      .then(({ data }) => data);
  }

  getProductName(serviceId, cloudConnect) {
    return this.$http
      .get(`/services/${serviceId}`, {
        cache: this.cache.serviceDetails,
      })
      .then(
        ({
          data: {
            billing: { plan },
          },
        }) => {
          cloudConnect.setProductName(plan?.invoiceName);
          cloudConnect.setPlanCode(plan?.code);
        },
      );
  }

  getVracks() {
    return this.OvhApiVrack.v6()
      .query()
      .$promise.then((vRacks) => {
        return this.$q.all(
          map(vRacks, (vRackId) => this.getVrackDetails(vRackId)),
        );
      });
  }

  getVrackDetails(vRackId) {
    return this.OvhApiVrack.v6()
      .get({ serviceName: vRackId })
      .$promise.then((vRack) => {
        return {
          name: vRack.name || vRackId,
          id: vRackId,
        };
      });
  }

  getVrackAllowedServices(vRackId) {
    return this.OvhApiVrack.v6().allowedServices({ serviceName: vRackId });
  }

  associateVrack(vRackId, ovhCloudConnectId) {
    return this.$http
      .post(`/vrack/${vRackId}/ovhCloudConnect`, {
        ovhCloudConnect: ovhCloudConnectId,
      })
      .then(({ data }) => data);
  }

  removeVrack(vRackId, ovhCloudConnectId) {
    return this.$http
      .delete(`/vrack/${vRackId}/ovhCloudConnect/${ovhCloudConnectId}`)
      .then(({ data }) => data);
  }

  runDiagnostic(
    serviceName,
    diagnosticName,
    popConfigId,
    dcConfigId,
    diagnosticType,
    extraConfigId,
  ) {
    return this.$http
      .post(`/ovhCloudConnect/${serviceName}/diagnostic`, {
        dcConfigId,
        diagnosticName,
        diagnosticType,
        extraConfigId,
        popConfigId,
      })
      .then(({ data }) => data);
  }

  loadAllTasks(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/task`)
      .then((res) =>
        this.$q.all(
          map(res.data, (taskId) =>
            this.getTaskDetails(cloudConnectId, taskId),
          ),
        ),
      )
      .then((res) => res);
  }

  getTaskDetails(cloudConnectId, taskId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/task/${taskId}`)
      .then(({ data }) => new CloudConnectTasks(data));
  }

  getDiagnosticsWithDetails(cloudConnectId) {
    return this.iceberg(`/ovhCloudConnect/${cloudConnectId}/diagnostic`)
      .query()
      .expand('CachedObjectList-Pages')
      .sort('date', 'desc')
      .execute(null, true)
      .$promise.then(({ data: result }) =>
        result.map((item) => new CloudConnectDiagnostics(item)),
      );
  }

  getDiagnostic(cloudConnectId, diagnosticId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/diagnostic/${diagnosticId}`)
      .then(({ data }) => data);
  }

  saveDescription(cloudConnectId, description) {
    return this.$http
      .put(`/ovhCloudConnect/${cloudConnectId}`, {
        description,
      })
      .then(({ data }) => {
        CloudConnectService.clearCache(this.cache.cloudConnect);
        return data;
      });
  }

  getAllPopTypes() {
    return this.POP_TYPES;
  }

  getPopTypeName(typeId) {
    const type = find(this.getAllPopTypes(), (pop) => pop.id === typeId);
    return type ? type.name : typeId;
  }

  loadPopConfigurations(cloudConnect) {
    cloudConnect.setLoadingPopConfiguration(true);
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnect.uuid}/config/pop`, {
        cache: this.cache.popConfigurationQuery,
      })
      .then((res) => {
        return this.$q
          .all(
            map(res.data, (popConfigId) => {
              return this.$http
                .get(
                  `/ovhCloudConnect/${cloudConnect.uuid}/config/pop/${popConfigId}`,
                  {
                    cache: this.cache.popConfiguration,
                  },
                )
                .then((config) => {
                  if (config.data.type === POP_TYPE_CONSTANT.L3) {
                    return this.getBgpPopConfigStatus(
                      cloudConnect.id,
                      popConfigId,
                    ).then((result) => {
                      const newConfig = config.data;
                      newConfig.bgpStatus = result.status;
                      newConfig.lastUpdateBgpStatus = result.lastUpdate;
                      cloudConnect.setPopConfiguration(newConfig);
                      return config.data;
                    });
                  }
                  cloudConnect.setPopConfiguration(config.data);
                  return config.data;
                });
            }),
          )
          .then(() => cloudConnect);
      })
      .finally(() => {
        cloudConnect.setLoadingPopConfiguration(false);
        this.checkPendingTasks(cloudConnect);
      });
  }

  addPopConfiguration(ovhCloudConnectId, interfaceId, type, pop) {
    let options = {
      type,
      interfaceId,
    };
    if (type === POP_TYPE_CONSTANT.L3) {
      options = {
        ...options,
        ...pop,
      };
    }
    return this.$http
      .post(`/ovhCloudConnect/${ovhCloudConnectId}/config/pop`, options)
      .then(({ data }) => data);
  }

  removePopConfiguration(ovhCloudConnectId, popId) {
    return this.$http
      .delete(`/ovhCloudConnect/${ovhCloudConnectId}/config/pop/${popId}`)
      .then(({ data }) => data);
  }

  loadInterfaces(cloudConnect) {
    cloudConnect.setLoadingInterface(true);
    return this.$q
      .all(
        map(cloudConnect.interfaceList, (interfaceId) => {
          return this.$http
            .get(
              `/ovhCloudConnect/${cloudConnect.uuid}/interface/${interfaceId}`,
              {
                cache: this.cache.interface,
              },
            )
            .then(({ data }) => {
              const cloudConnectInterface = new CloudConnectInterface(data);
              if (!cloudConnect.isDirectService()) {
                return cloudConnectInterface;
              }

              // Interface status is only available for Direct service
              return this.getInterfaceStatus(cloudConnect.id, interfaceId).then(
                (value) => {
                  cloudConnectInterface.lastUpdateInterfaceStatus =
                    value.lastUpdate;
                  cloudConnectInterface.interfaceStatus = value.status;
                  return cloudConnectInterface;
                },
              );
            });
        }),
      )
      .then((interfaces) => {
        cloudConnect.setInterface(interfaces);
      })
      .finally(() => {
        cloudConnect.setLoadingInterface(false);
      });
  }

  checkPendingTasks(cloudConnect) {
    return this.loadAllTasks(cloudConnect.uuid).then((tasks) => {
      map(tasks, (task) => {
        if (
          task.function === 'lockInterface' ||
          task.function === 'unlockInterface'
        ) {
          const pendingInterface = cloudConnect.getInterface(task.resourceId);
          if (task.function === 'lockInterface') {
            pendingInterface.setDisabling(true);
          } else {
            pendingInterface.setEnabling(true);
          }
        }
      });
    });
  }

  lockInterface(cloudConnectId, interfaceId) {
    return this.$http
      .post(`/ovhCloudConnect/${cloudConnectId}/interface/${interfaceId}/lock`)
      .then(({ data }) => data);
  }

  unlockInterface(cloudConnectId, interfaceId) {
    return this.$http
      .post(
        `/ovhCloudConnect/${cloudConnectId}/interface/${interfaceId}/unlock`,
      )
      .then(({ data }) => data);
  }

  loadServiceKeys(cloudConnect) {
    cloudConnect.setLoadingServiceKeys(true);
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnect.uuid}/serviceKey`, {
        cache: this.cache.serviceKeyIds,
      })
      .then((serviceKeyIds) =>
        this.$q.all(
          map(serviceKeyIds.data, (serviceKeyId) =>
            this.$http
              .get(
                `/ovhCloudConnect/${cloudConnect.uuid}/serviceKey/${serviceKeyId}`,
                {
                  cache: this.cache.serviceKeys,
                },
              )
              .then(({ data }) => new CloudConnectServiceKey(data)),
          ),
        ),
      )
      .then((serviceKeys) => cloudConnect.setServiceKeys(serviceKeys))
      .finally(() => {
        cloudConnect.setLoadingServiceKeys(false);
      });
  }

  getActiveServiceKey(cloudConnectId) {
    return this.$http.get(`/ovhCloudConnect/${cloudConnectId}/serviceKey`, {
      cache: this.cache.serviceKey,
    });
  }

  regenerateServiceKey(cloudConnectId, serviceKeyId) {
    return this.$http
      .post(
        `/ovhCloudConnect/${cloudConnectId}/serviceKey/${serviceKeyId}/regenerate`,
      )
      .then(() => CloudConnectService.clearCache(this.cache.serviceKeys));
  }

  sendServiceKey(cloudConnectId, serviceKeyId, email) {
    return this.$http.post(
      `/ovhCloudConnect/${cloudConnectId}/serviceKey/${serviceKeyId}/send`,
      {
        email,
      },
    );
  }

  downloadLOA(cloudConnectId) {
    return this.$http
      .post(`/ovhCloudConnect/${cloudConnectId}/loa`)
      .then(({ data }) => data);
  }

  loadDatacenters(cloudConnect) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnect.uuid}/datacenter`, {
        cache: this.cache.datacenterQuery,
      })
      .then(({ data }) => {
        return this.$q
          .all(
            map(data, (datacenterId) =>
              this.$http
                .get(
                  `/ovhCloudConnect/${cloudConnect.uuid}/datacenter/${datacenterId}`,
                  {
                    cache: this.cache.datacenter,
                  },
                )
                .then((res) => res.data),
            ),
          )
          .then((list) => cloudConnect.setAvailableDatacenters(list));
      });
  }

  loadDatacenterConfigurations(cloudConnect) {
    cloudConnect.setLoadingDatacenters(true);
    const pop = cloudConnect.getFirstPopConfiguration();
    return this.$http
      .get(
        `/ovhCloudConnect/${cloudConnect.uuid}/config/pop/${pop.id}/datacenter`,
        {
          cache: this.cache.datacenterConfigQuery,
        },
      )
      .then((res) => {
        return this.$q
          .all(
            map(res.data, (datacenterId) => {
              return this.$http
                .get(
                  `/ovhCloudConnect/${cloudConnect.uuid}/config/pop/${pop.id}/datacenter/${datacenterId}`,
                  {
                    cache: this.cache.datacenterConfig,
                  },
                )
                .then(({ data }) => {
                  const dc = find(cloudConnect.availableDatacenters, {
                    id: data.datacenterId,
                  });
                  const configurations = {
                    ...data,
                    dcName: dc.name || null,
                    popConfigId: pop.id,
                    region: dc.region || null,
                    regionType: dc.regionType || null,
                    regionGroupKey: dc.region + dc.regionType || '-',
                  };
                  return new CloudConnectDatacenter(configurations);
                });
            }),
          )
          .then((datacenter) => cloudConnect.setDcConfigurations(datacenter))
          .finally(() => {
            cloudConnect.setLoadingDatacenters(false);
          });
      })
      .finally(() => {
        cloudConnect.setLoadingDatacenters(false);
      });
  }

  addDatacenterConfiguration(cloudConnectId, popId, data) {
    return this.$http
      .post(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter`,
        {
          ...data,
        },
      )
      .then((res) => res.data);
  }

  removeDatacenterConfiguration(cloudConnectId, popId, datacenterId) {
    return this.$http
      .delete(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter/${datacenterId}`,
      )
      .then(({ data }) => data);
  }

  getExtras(cloudConnect) {
    return this.$q.all(
      map(cloudConnect.datacenterConfigurations, (dc) =>
        this.loadDatacenterConfigurationExtras(
          cloudConnect.uuid,
          cloudConnect.getFirstPopConfiguration().id,
          dc,
        ),
      ),
    );
  }

  loadDatacenterConfigurationExtras(cloudConnectId, popId, datacenter) {
    datacenter.setLoadingExtraConfigurations(true);
    return this.$http
      .get(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter/${datacenter.id}/extra`,
        {
          cache: this.cache.datacenterConfigExtraQuery,
        },
      )
      .then((res) => {
        return this.$q
          .all(
            map(res.data, (extraId) => {
              return this.$http
                .get(
                  `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter/${datacenter.id}/extra/${extraId}`,
                  {
                    cache: this.cache.datacenterConfigExtra,
                  },
                )
                .then((detail) => new CloudConnectDatacenterExtra(detail.data));
            }),
          )
          .then((extra) => datacenter.setExtraConfigurations(extra))
          .finally(() => {
            datacenter.setLoadingExtraConfigurations(false);
          });
      })
      .finally(() => {
        datacenter.setLoadingExtraConfigurations(false);
      });
  }

  createDatacenterConfigurationExtra(
    cloudConnectId,
    popId,
    datacenterId,
    data,
  ) {
    return this.$http
      .post(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter/${datacenterId}/extra`,
        {
          ...data,
        },
      )
      .then((res) => res.data);
  }

  removeDatacenterConfigurationExtra(
    cloudConnectId,
    popId,
    datacenterId,
    extraId,
  ) {
    return this.$http
      .delete(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/datacenter/${datacenterId}/extra/${extraId}`,
      )
      .then(({ data }) => data);
  }

  getVrackAssociatedCloudConnect(serviceName) {
    return this.$http
      .get(`/vrack/${serviceName}/ovhCloudConnect`)
      .then(({ data }) => data.length > 0);
  }

  checkTaskStatus(cloudConnectId, taskId) {
    return this.Poller.poll(
      `/ovhCloudConnect/${cloudConnectId}/task/${taskId}`,
      {},
      {
        method: 'get',
        retryMaxAttempts: 6,
        successRule: (task) =>
          task.status === STATUS.DONE || task.status === STATUS.ERROR,
      },
    );
  }

  trackClick(name) {
    return this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }

  static clearCache(cacheName) {
    cacheName.removeAll();
  }

  clearAllCache() {
    forOwn(this.cache, (cacheName) => {
      CloudConnectService.clearCache(cacheName);
    });
  }

  loadStatistics(cloudConnectId, interfaceId, type, period) {
    const options = {
      period,
      type,
    };

    return this.$http
      .get(
        `/ovhCloudConnect/${cloudConnectId}/interface/${interfaceId}/statistics`,
        { params: options },
      )
      .then((statistics) => {
        const stats = statistics.data || [];
        return stats.map(({ timestamp, value }) => [timestamp * 1000, value]);
      })
      .catch(() => []);
  }

  getOrderFollowUp() {
    return this.iceberg('/ovhCloudConnect/order')
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data: result }) => result);
  }

  translateBandwidth(bandwidth) {
    const array = bandwidth.split('');
    const bandwidthNumber = parseInt(bandwidth, 10);
    return `${bandwidthNumber} ${this.$translate.instant(
      `cloud_connect_common_${array[array.length - 1]}`,
    )}`;
  }

  getNotifications(cloudConnectId) {
    return this.iceberg(`/ovhCloudConnect/${cloudConnectId}/incident`)
      .query()
      .expand('CachedObjectList-Pages')
      .execute(null, true)
      .$promise.then(({ data }) => data);
  }

  getOvhCloudConnect(pageNumber, pageSize) {
    return this.$http.get(`/ovhCloudConnect`, {
      headers: {
        Pragma: 'no-cache',
        'x-pagination-mode': 'CachedObjectList-Pages',
        'x-pagination-number': pageNumber,
        'x-pagination-size': pageSize,
        'x-pagination-sort': 'lastUpdate',
        'x-pagination-sort-order': 'DESC',
      },
    });
  }

  getCloudConnectNotifications(uuid) {
    return this.$http
      .get(`/ovhCloudConnect/${uuid}/monitoring`)
      .then(({ data }) => data);
  }

  saveCloudConnectNotifications(uuid, notificationTypes = []) {
    return this.$http
      .post(`/ovhCloudConnect/${uuid}/monitoring`, {
        subscriptions: [...notificationTypes],
      })
      .then(({ data }) => data);
  }

  getBgpPopConfigStatus(cloudConnectId, popId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/config/pop/${popId}/status`)
      .then(({ data }) => data);
  }

  getInterfaceStatus(cloudConnectId, interfaceId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/interface/${interfaceId}/status`)
      .then(({ data }) => data);
  }

  loadPopStatistics(cloudConnectId, pop, options) {
    if (!pop) {
      return [];
    }
    return this.$http
      .get(
        `/ovhCloudConnect/${cloudConnectId}/config/pop/${pop.id}/statistics`,
        { params: options },
      )
      .then((statistics) => {
        const stats = statistics.data || [];
        return stats.map(({ timestamp, value }) => [timestamp * 1000, value]);
      })
      .catch(() => []);
  }
}
