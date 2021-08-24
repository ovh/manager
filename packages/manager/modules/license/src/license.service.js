import assign from 'lodash/assign';
import camelCase from 'lodash/camelCase';
import filter from 'lodash/filter';
import set from 'lodash/set';

export default /* @ngInject */ function LicenseService(
  WucApi,
  licenseConstants,
  $q,
  LICENCE_TYPES,
  $rootScope,
  OvhHttp,
  licenseFeatureAvailability,
) {
  const self = this;

  this.types = filter(
    LICENCE_TYPES,
    (type) =>
      !licenseFeatureAvailability.allowLicenseAgoraOrder() ||
      licenseFeatureAvailability.allowLicenseTypeAgoraOrder(type),
  );

  function init() {
    angular.forEach(['get', 'put', 'post', 'delete'], (operationType) => {
      self[operationType] = function operation(a, b) {
        let opts = {};
        let url = `${licenseConstants.aapiRootPath}sws/license`;

        if (a) {
          url += `/get${a}`;
        }

        if (b) {
          opts = b;
        }

        return WucApi[operationType](url, opts).then(
          (data) => data,
          (reason) => $q.reject(reason),
        );
      };
    });
  }

  this.ips = function ips(opts) {
    const opts2api = assign({}, opts, { rootPath: '2api' });

    return OvhHttp.get('/sws/license/availableIps', opts2api).then(
      (data) => data,
      (reason) => $q.reject(reason),
    );
  };

  this.orderableVersion = function orderableVersion(ip) {
    return OvhHttp.get('/sws/license/orderableVersions', {
      rootPath: '2api',
      params: {
        ip,
      },
      cache: 'license',
    }).then((data) => data.options);
  };

  this.migrate = function migrate(data) {
    switch (data.urlParams.type) {
      case 'CLOUDLINUX':
        return 'Not implemented for Cloud Linux licenses';

      case 'SPLA':
        return 'Not implemented for SPLA licenses';

      case 'SQLSERVER':
        return 'Not implemented for Sql Server licenses';

      case 'WINDOWS':
        return 'Not implemented for Windows licenses';
      default:
        break;
    }

    return OvhHttp.post('/license/{licenseType}/{serviceName}/changeIp', {
      rootPath: 'apiv6',
      urlParams: {
        licenseType: camelCase(data.urlParams.type),
        serviceName: data.urlParams.id,
      },
      data: {
        destinationIp: data.data.destinationIp,
      },
      clearAllCache: true,
    }).then((dataResult) => {
      $rootScope.$broadcast(
        'paginationServerSide.reload',
        'licensesPagination',
      );
      return dataResult;
    });
  };

  function hasOption(options, name) {
    return (
      options &&
      options[name] !== undefined &&
      options[name] !== null &&
      options[name].value !== null
    );
  }

  function setPleskOptions(opts, data) {
    if (data.options) {
      if (hasOption(data.options, 'languagePackNumber')) {
        set(opts, 'languagePackNumber', data.options.languagePackNumber.value);
      }

      if (hasOption(data.options, 'antivirus')) {
        set(opts, 'antivirus', data.options.antivirus.value);
      }

      if (hasOption(data.options, 'domainNumber')) {
        set(opts, 'domainNumber', data.options.domainNumber.value.value);
      }

      if (hasOption(data.options, 'powerpack')) {
        set(opts, 'powerpack', data.options.powerpack.value);
      }

      if (hasOption(data.options, 'version')) {
        set(opts, 'version', data.options.version.value);
      }
    }
    return opts;
  }

  function getOptsForLicenseOrderOrUpgrade(data) {
    let opts = {};

    if (data && data.licenseType) {
      if (data.ip) {
        opts.ip = data.ip;
      }
      if (data.version) {
        opts.version = data.version;
      }

      switch (data.licenseType) {
        case 'WINDOWS':
          if (hasOption(data.options, 'sqlVersion')) {
            opts.sqlVersion = data.options.sqlVersion.value.value;
          }
          break;
        case 'CPANEL':
          break;
        case 'VIRTUOZZO':
          if (hasOption(data.options, 'containerNumber')) {
            opts.containerNumber = data.options.containerNumber.value;
          }
          break;
        case 'DIRECTADMIN':
          break;
        case 'PLESK':
          opts = setPleskOptions(opts, data);
          break;
        case 'WORKLIGHT':
          if (hasOption(data.options, 'lessThan1000Users')) {
            opts.lessThan1000Users = data.options.lessThan1000Users.value;
          }
          break;
        default:
          break;
      }
    }
    return opts;
  }

  function getLicenseType(type) {
    if (type === 'CLOUDLINUX') {
      return 'cloudLinux';
    }
    return (type || '').toLowerCase();
  }

  this.getLicenseOrderForDuration = function getLicenseOrderForDuration(data) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.get('/order/license/{type}/new/{duration}', {
        rootPath: 'apiv6',
        urlParams: {
          type: getLicenseType(data.licenseType),
          duration: data.duration,
        },
        params: opts,
      });
    }
    return $q.when(null);
  };

  this.getLicenseUpgradeForDuration = function getLicenseUpgradeForDuration(
    data,
  ) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.get(
        '/order/license/{type}/{serviceName}/upgrade/{duration}',
        {
          rootPath: 'apiv6',
          urlParams: {
            type: getLicenseType(data.licenseType),
            serviceName: data.id,
            duration: data.duration,
          },
          params: opts,
        },
      );
    }
    return $q.when(null);
  };

  this.orderLicenseOrderForDuration = function orderLicenseOrderForDuration(
    data,
  ) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.post('/order/license/{type}/new/{duration}', {
        rootPath: 'apiv6',
        urlParams: {
          type: getLicenseType(data.licenseType),
          duration: data.duration,
        },
        data: opts,
      });
    }
    return $q.when(null);
  };

  this.upgradeLicenseOrderForDuration = function upgradeLicenseOrderForDuration(
    data,
  ) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.post(
        '/order/license/{type}/{serviceName}/upgrade/{duration}',
        {
          rootPath: 'apiv6',
          urlParams: {
            type: getLicenseType(data.licenseType),
            serviceName: data.id,
            duration: data.duration,
          },
          data: opts,
        },
      );
    }
    return $q.when(null);
  };

  this.orderDuration = function orderDuration(data) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.get('/order/license/{type}/new', {
        rootPath: 'apiv6',
        urlParams: {
          type: getLicenseType(data.licenseType),
        },
        params: opts,
      });
    }
    return $q.when(null);
  };

  this.upgradeDuration = function upgradeDuration(data) {
    const opts = getOptsForLicenseOrderOrUpgrade(data);
    if (opts !== null) {
      return OvhHttp.get('/order/license/{type}/{serviceName}/upgrade', {
        rootPath: 'apiv6',
        urlParams: {
          type: getLicenseType(data.licenseType),
          serviceName: data.id,
        },
        params: opts,
      });
    }
    return $q.when(null);
  };

  this.model = function model(name) {
    return OvhHttp.get(`${licenseConstants.swsProxyRootPath}order.json`, {
      cache: 'licenseOrder',
    }).then((schema) => schema.models[name] || null);
  };

  this.getDirectAdminModels = function getDirectAdminModels() {
    return OvhHttp.get('/license/directadmin.json', {
      rootPath: 'apiv6',
      cache: 'licenseOrder',
    });
  };

  this.canLicenceBeMovedTo = function canLicenceBeMovedTo({
    type,
    id,
    destinationIp,
  }) {
    return OvhHttp.get('/license/{type}/{id}/canLicenseBeMovedTo', {
      rootPath: 'apiv6',
      urlParams: {
        type: getLicenseType(type),
        id,
      },
      params: {
        destinationIp,
      },
    });
  };

  this.splaAddAvailableServers = function splaAddAvailableServers() {
    return OvhHttp.get('/sws/license/server/availables', {
      rootPath: '2api',
    }).then((data) => ({ availableServers: data }));
  };

  this.splaAddAvailableTypes = function splaAddAvailableTypes(server) {
    return OvhHttp.get(
      '/sws/license/server/{serverServiceName}/splaAvailableTypes',
      {
        rootPath: '2api',
        urlParams: {
          serverServiceName: server,
        },
      },
    ).then((data) => ({ availableTypes: data }));
  };

  this.splaAdd = function splaAdd(serviceName, data) {
    return OvhHttp.post('/dedicated/server/{serviceName}/spla', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data,
      clearAllCache: true,
      broadcast: 'paginationServerSide.reload',
      broadcastParam: 'licensesPagination',
    });
  };

  this.splaRevoke = function splaRevoke(serverServiceName, id) {
    return OvhHttp.post('/dedicated/server/{serviceName}/spla/{id}/revoke', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName: serverServiceName,
        id,
      },
      clearAllCache: true,
      broadcast: 'paginationServerSide.reload',
      broadcastParam: 'licensesPagination',
    });
  };

  this.deleteLicenseAtExpiration = function deleteLicenseAtExpiration(license) {
    return OvhHttp.put('/license/{type}/{serviceName}/serviceInfos', {
      rootPath: 'apiv6',
      urlParams: {
        type: getLicenseType(license.type),
        serviceName: license.id,
      },
      data: {
        renew: {
          automatic: license.renew.automatic,
          forced: license.renew.forced,
          deleteAtExpiration: !license.renew.deleteAtExpiration,
        },
      },
    });
  };

  this.changeOs = function changeOs(licence, os) {
    return OvhHttp.post('/license/{type}/{serviceName}/changeOs', {
      rootPath: 'apiv6',
      urlParams: {
        type: getLicenseType(licence.type),
        serviceName: licence.id,
      },
      data: {
        os,
      },
    });
  };

  this.tasks = (licence, action = '', status = '') =>
    OvhHttp.get('/license/{type}/{serviceName}/tasks', {
      rootPath: 'apiv6',
      urlParams: {
        type: getLicenseType(licence.type),
        serviceName: licence.id,
      },
      data: {
        action,
        status,
      },
    });

  this.terminate = function terminate(serviceName, license) {
    return OvhHttp.post('/license/{licenseType}/{serviceName}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        licenseType: getLicenseType(license.type),
      },
      data: {},
      clearAllCache: true,
      broadcast: 'paginationServerSide.reload',
      broadcastParam: 'licensesPagination',
      returnErrorKey: '',
    });
  };

  this.getLicence = function getLicence(serviceName, type) {
    return OvhHttp.get('/license/{type}/{serviceName}', {
      rootPath: 'apiv6',
      urlParams: {
        type: getLicenseType(type),
        serviceName,
      },
    });
  };

  init();
}
