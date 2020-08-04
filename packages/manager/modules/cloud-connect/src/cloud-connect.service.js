import { find, forOwn, get, map, set } from 'lodash';

import CloudConnect from './cloud-connect.class';
import CloudConnectDatacenter from './cloud-connect-datacenter.class';
import CloudConnectDatacenterExtra from './cloud-connect-datacenter-extra.class';
import CloudConnectTasks from './cloud-connect-tasks.class';
import CloudConnectServiceKey from './cloud-connect-service-key.class';
import CloudConnectInterface from './cloud-connect-interface.class';

import {
  POP_TYPES,
  POP_TYPE_CONSTANT,
  STATUS,
} from './cloud-connect.constants';

export default class CloudConnectService {
  /* @ngInject */
  constructor($cacheFactory, $q, $http, atInternet, Poller, OvhApiVrack) {
    this.$cacheFactory = $cacheFactory;
    this.$q = $q;
    this.$http = $http;
    this.atInternet = atInternet;
    this.Poller = Poller;
    this.OvhApiVrack = OvhApiVrack;
    this.POP_TYPES = POP_TYPES;
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
    };
  }

  getCloudConnect(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}`, {
        cache: this.cache.cloudConnect,
      })
      .then((res) => new CloudConnect(res.data));
  }

  getCloudConnectServiceInfo(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/serviceInfos`, {
        cache: this.cache.serviceInfo,
      })
      .then((res) => res.data);
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
      .then((res) => res.data);
  }

  removeVrack(vRackId, ovhCloudConnectId) {
    return this.$http
      .delete(`/vrack/${vRackId}/ovhCloudConnect/${ovhCloudConnectId}`)
      .then((res) => res.data);
  }

  loadAllTasks(cloudConnectId) {
    return this.$http
      .get(`/ovhCloudConnect/${cloudConnectId}/task`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then((res) => map(res.data, (task) => new CloudConnectTasks(task)));
  }

  saveDescription(cloudConnectId, description) {
    return this.$http
      .put(`/ovhCloudConnect/${cloudConnectId}`, {
        description,
      })
      .then((res) => {
        this.clearCache(this.cache.cloudConnect);
        return res.data;
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
                  cloudConnect.setPopConfiguration(config.data);
                  return config.data;
                });
            }),
          )
          .then(() => cloudConnect)
          .finally(() => {
            cloudConnect.setLoadingPopConfiguration(false);
          });
      })
      .finally(() => {
        cloudConnect.setLoadingPopConfiguration(false);
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
      .then((res) => res.data);
  }

  removePopConfiguration(ovhCloudConnectId, popId) {
    return this.$http
      .delete(`/ovhCloudConnect/${ovhCloudConnectId}/config/pop/${popId}`)
      .then((res) => res.data);
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
              return new CloudConnectInterface(data);
            });
        }),
      )
      .then((interfaces) => cloudConnect.setInterface(interfaces))
      .finally(() => {
        cloudConnect.setLoadingInterface(false);
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
      .then(() => this.clearCache(this.cache.serviceKeys));
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
      .then((res) => res.data);
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
                  set(data, 'dcName', get(dc, 'name', null));
                  return new CloudConnectDatacenter(data);
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
      .then((res) => res.data);
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
      .then((res) => res.data);
  }

  getVrackAssociatedCloudConnect(serviceName) {
    return this.$http
      .get(`/vrack/${serviceName}/ovhCloudConnect`)
      .then(({ data }) => {
        return data.length > 0;
      });
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

  /* eslint-disable-next-line class-methods-use-this */
  clearCache(cacheName) {
    cacheName.removeAll();
  }

  clearAllCache() {
    forOwn(this.cache, (cacheName) => {
      this.clearCache(cacheName);
    });
  }
}
