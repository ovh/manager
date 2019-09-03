import assign from 'lodash/assign';
import map from 'lodash/map';

angular.module('services').service('Housing', function ($q, constants, $rootScope, Polling, OvhHttp) {
  const self = this;
  const urlRootHousing = '/dedicated/housing/{serviceName}';

  this.getDescription = function (serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/serviceInfos'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getSelected = function (serviceName) {
    return OvhHttp.get(urlRootHousing, {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  /*--------------
    * APC
    */

  this.getOrderableApc = function (serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/orderable/APC'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getApcDurations = function (serviceName) {
    return OvhHttp.get('/order/dedicated/housing/{serviceName}/APC', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getRebootPrices = function (serviceName) {
    return self.getApcDurations(serviceName).then(duration => OvhHttp.get(`/order/dedicated/housing/{serviceName}/APC/${duration}`, {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    }));
  };

  this.rebootOrder = function (serviceName) {
    return self.getApcDurations(serviceName).then(duration => OvhHttp.post(`/order/dedicated/housing/{serviceName}/APC/${duration}`, {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {},
    }));
  };

  /*--------------
    *  TASKS
    */

  this.getTaskPath = function (serviceName, taskId) {
    return `apiv6/dedicated/housing/${serviceName}/task/${taskId}`;
  };

  this.getTaskIds = function (serviceName, params) {
    const urlParams = {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    };
    return OvhHttp.get(urlRootHousing.concat('/task'), assign(urlParams, params));
  };

  this.getTask = function (serviceName, id) {
    return OvhHttp.get(urlRootHousing.concat(['/task', id].join('/')), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getTasks = function (serviceName) {
    return self.getTaskIds(serviceName).then((ids) => {
      const taskPromises = map(ids, id => self.getTask(serviceName, id));

      return $q.all(taskPromises);
    });
  };

  this.getTaskInProgress = function (serviceName, type) {
    let params = null;
    if (type) {
      params = {
        params: {
          function: type,
          status: 'doing',
        },
      };
    }
    return self.getTaskIds(serviceName, params).then(
      (ids) => {
        const taskPromises = map(ids, id => OvhHttp.get(urlRootHousing.concat(['/task', id].join('/')), {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }));

        return $q.all(taskPromises);
      },
    );
  };

  this.addTask = function (serviceName, task, scopeId) {
    const pollPromise = $q.defer();

    Polling.addTask(self.getTaskPath(serviceName, task.id), task, scopeId).then(
      (state) => {
        pollPromise.resolve(state);
        if (Polling.isDone(state)) {
          $rootScope.$broadcast('tasks.update');
        }
      },
      (data) => {
        pollPromise.reject({ type: 'ERROR', message: data.comment });
        $rootScope.$broadcast('tasks.update');
      },
    );

    return pollPromise.promise;
  };

  this.addTaskFast = function (serviceName, task, scopeId) {
    const pollPromise = $q.defer();

    Polling.addTaskFast(self.getTaskPath(serviceName, task.data.taskId), task.data, scopeId).then(
      (state) => {
        pollPromise.resolve(state);
        if (Polling.isDone(state)) {
          $rootScope.$broadcast('tasks.update');
        }
      },
      (data) => {
        pollPromise.reject(data);
        $rootScope.$broadcast('tasks.update');
      },
    );
    return pollPromise.promise;
  };

  /*--------------
    *  FTP BACKUP
    */

  this.activateFtpBackup = function (serviceName) {
    return OvhHttp.post(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      data: {},
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.active',
    });
  };

  this.deleteFtpBackup = function (serviceName) {
    return OvhHttp.delete(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.delete',
    });
  };

  this.getFtpBackup = function (serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getFtpBackupIps = function (serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP/access'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getFtpBackupIpDetail = function (serviceName, ipBlock) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP/access/{ipBlock}'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        ipBlock,
      },
    });
  };

  this.getAuthorizableBlocks = function (serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP/authorizableBlocks'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.postFtpBackupIp = function (serviceName, ipBlock, ftp, nfs, cifs) {
    const accessPromises = map(ipBlock, ip => OvhHttp.post(urlRootHousing.concat('/features/backupFTP/access'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        ipBlock: ip,
        ftp,
        nfs,
        cifs,
      },
      broadcast: 'housing.ftpbackup.refresh',
    }));

    return $q.all(accessPromises);
  };

  this.putFtpBackupIp = function (serviceName, ipBlock, ftp, nfs, cifs) {
    const ipEncoded = encodeURIComponent(ipBlock);
    return OvhHttp.put(urlRootHousing.concat(['/features/backupFTP/access', ipEncoded].join('/')), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      data: {
        ftp,
        nfs,
        cifs,
      },
      broadcast: 'housing.ftpbackup.refresh',
    });
  };

  this.requestFtpBackupPassword = function (serviceName) {
    return OvhHttp.post(urlRootHousing.concat('/features/backupFTP/password'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.password',
      data: {},
    });
  };

  this.deleteFtpBackupIp = function (serviceName, ipBlock) {
    const ipEncoded = encodeURIComponent(ipBlock);
    return OvhHttp.delete(urlRootHousing.concat(['/features/backupFTP/access', ipEncoded].join('/')), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.refresh',
    });
  };
});
