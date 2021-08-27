import assign from 'lodash/assign';
import map from 'lodash/map';

export default /* @ngInject */ function Housing(
  $q,
  $rootScope,
  Polling,
  OvhHttp,
) {
  const self = this;
  const urlRootHousing = '/dedicated/housing/{serviceName}';

  this.getDescription = function getDescription(serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/serviceInfos'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getSelected = function getSelected(serviceName) {
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

  this.getOrderableApc = function getOrderableApc(serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/orderable/APC'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getApcDurations = function getApcDurations(serviceName) {
    return OvhHttp.get('/order/dedicated/housing/{serviceName}/APC', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getRebootPrices = function getRebootPrices(serviceName) {
    return self.getApcDurations(serviceName).then((duration) =>
      OvhHttp.get(`/order/dedicated/housing/{serviceName}/APC/${duration}`, {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      }),
    );
  };

  this.rebootOrder = function rebootOrder(serviceName) {
    return self.getApcDurations(serviceName).then((duration) =>
      OvhHttp.post(`/order/dedicated/housing/{serviceName}/APC/${duration}`, {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        data: {},
      }),
    );
  };

  /*--------------
   *  TASKS
   */

  this.getTaskPath = function getTaskPath(serviceName, taskId) {
    return `apiv6/dedicated/housing/${serviceName}/task/${taskId}`;
  };

  this.getTaskIds = function getTaskIds(serviceName, params) {
    const urlParams = {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    };
    return OvhHttp.get(
      urlRootHousing.concat('/task'),
      assign(urlParams, params),
    );
  };

  this.getTask = function getTask(serviceName, id) {
    return OvhHttp.get(urlRootHousing.concat(['/task', id].join('/')), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getTasks = function getTasks(serviceName) {
    return self.getTaskIds(serviceName).then((ids) => {
      const taskPromises = map(ids, (id) => self.getTask(serviceName, id));

      return $q.all(taskPromises);
    });
  };

  this.getTaskInProgress = function getTaskInProgress(serviceName, type) {
    let params = null;
    if (type) {
      params = {
        params: {
          function: type,
          status: 'doing',
        },
      };
    }
    return self.getTaskIds(serviceName, params).then((ids) => {
      const taskPromises = map(ids, (id) =>
        OvhHttp.get(urlRootHousing.concat(['/task', id].join('/')), {
          rootPath: 'apiv6',
          urlParams: {
            serviceName,
          },
        }),
      );

      return $q.all(taskPromises);
    });
  };

  this.addTask = function addTask(serviceName, task, scopeId) {
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

  this.addTaskFast = function addTaskFast(serviceName, task, scopeId) {
    const pollPromise = $q.defer();

    Polling.addTaskFast(
      self.getTaskPath(serviceName, task.data.taskId),
      task.data,
      scopeId,
    ).then(
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

  this.activateFtpBackup = function activateFtpBackup(serviceName) {
    return OvhHttp.post(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      data: {},
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.active',
    });
  };

  this.deleteFtpBackup = function deleteFtpBackup(serviceName) {
    return OvhHttp.delete(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.delete',
    });
  };

  this.getFtpBackup = function getFtpBackup(serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getFtpBackupIps = function getFtpBackupIps(serviceName) {
    return OvhHttp.get(urlRootHousing.concat('/features/backupFTP/access'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };

  this.getFtpBackupIpDetail = function getFtpBackupIpDetail(
    serviceName,
    ipBlock,
  ) {
    return OvhHttp.get(
      urlRootHousing.concat('/features/backupFTP/access/{ipBlock}'),
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          ipBlock,
        },
      },
    );
  };

  this.getAuthorizableBlocks = function getAuthorizableBlocks(serviceName) {
    return OvhHttp.get(
      urlRootHousing.concat('/features/backupFTP/authorizableBlocks'),
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
      },
    );
  };

  this.postFtpBackupIp = function postFtpBackupIp(
    serviceName,
    ipBlock,
    ftp,
    nfs,
    cifs,
  ) {
    const accessPromises = map(ipBlock, (ip) =>
      OvhHttp.post(urlRootHousing.concat('/features/backupFTP/access'), {
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
      }),
    );

    return $q.all(accessPromises);
  };

  this.putFtpBackupIp = function putFtpBackupIp(
    serviceName,
    ipBlock,
    ftp,
    nfs,
    cifs,
  ) {
    const ipEncoded = encodeURIComponent(ipBlock);
    return OvhHttp.put(
      urlRootHousing.concat(
        ['/features/backupFTP/access', ipEncoded].join('/'),
      ),
      {
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
      },
    );
  };

  this.requestFtpBackupPassword = function requestFtpBackupPassword(
    serviceName,
  ) {
    return OvhHttp.post(urlRootHousing.concat('/features/backupFTP/password'), {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
      broadcast: 'housing.ftpbackup.password',
      data: {},
    });
  };

  this.deleteFtpBackupIp = function deleteFtpBackupIp(serviceName, ipBlock) {
    const ipEncoded = encodeURIComponent(ipBlock);
    return OvhHttp.delete(
      urlRootHousing.concat(
        ['/features/backupFTP/access', ipEncoded].join('/'),
      ),
      {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
        },
        broadcast: 'housing.ftpbackup.refresh',
      },
    );
  };
}
