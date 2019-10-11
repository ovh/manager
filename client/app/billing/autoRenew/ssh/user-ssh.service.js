angular.module('UserAccount').service('UseraccountSshService', [
  'OvhHttp',
  '$q',
  'constants',
  function (OvhHttp, $q, constants) {
    const CLOUD_CACHE_KEY = 'UNIVERS_DEDICATED_USER_ACCOUNT_SSH_CLOUD';
    const self = this;

    self.getAllSshKeyList = function (filter) {
      const categoryFilter = _.get(filter, 'categoryFilter', null);

      const promises = [];
      switch (categoryFilter) {
        case 'dedicated':
          promises.push(this.getDedicatedSshList());
          break;
        case 'cloud':
          promises.push(this.getCloudSshList());
          break;
        default:
          promises.push(this.getDedicatedSshList());
          promises.push(this.getCloudSshList());
      }

      return $q.all(promises).then((data) => {
        const keys = _.flatten(_.values(data));
        return _.sortBy(keys, key => key.keyName.toLowerCase());
      });
    };

    self.getDedicatedSshList = function () {
      return OvhHttp.get('/me/sshKey', {
        rootPath: 'apiv6',
      }).then((keyNames) => {
        const promises = _.map(keyNames, keyName => self.getDedicatedSshKey(keyName));
        return $q.all(promises);
      });
    };

    self.getDedicatedSshKey = function (keyName) {
      return OvhHttp.get('/me/sshKey/{keyName}', {
        rootPath: 'apiv6',
        urlParams: {
          keyName,
        },
      }).then((key) => {
        _.set(key, 'category', 'dedicated');
        return key;
      });
    };

    self.getCloudProjects = function () {
      return OvhHttp.get('/cloud/project', {
        rootPath: 'apiv6',
        cache: CLOUD_CACHE_KEY,
        clearCache: false,
      })
        .then(projectIds => $q.all(
          _.map(projectIds, projectId => OvhHttp.get('/cloud/project/{serviceName}', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: projectId,
            },
            cache: CLOUD_CACHE_KEY,
            clearCache: false,
          })),
        ))
        .then(projects => _.map(_.filter(projects, { status: 'ok' }), project => ({
          id: project.project_id,
          description: project.description,
        })));
    };

    self.getCloudSshList = function () {
      return self
        .getCloudProjects()
        .then((projects) => {
          const promises = _.map(projects, project => OvhHttp.get('/cloud/project/{serviceName}/sshkey', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: project.id,
            },
          }).then(keys => _.map(keys, key => ({
            serviceName: project.id,
            serviceDescription: project.description,
            category: 'cloud',
            keyName: key.name,
            key: key.publicKey,
            id: key.id,
            url: self.getSshCloudUrl(project.id),
          }))));
          return $q.all(promises);
        })
        .then(keysByProjet => _.flatten(keysByProjet));
    };

    self.addDedicatedSshKey = function (sshkeyObj) {
      return OvhHttp.post('/me/sshKey', {
        rootPath: 'apiv6',
        data: {
          keyName: sshkeyObj.keyName,
          key: sshkeyObj.key.trim().replace(/\n/, ''),
        },
        broadcast: 'useraccount.ssh.refresh',
      });
    };

    self.setDefaultDedicatedSshKey = function (sshkeyObj) {
      return OvhHttp.put('/me/sshKey/{keyName}', {
        rootPath: 'apiv6',
        urlParams: {
          keyName: sshkeyObj.keyName,
        },
        data: {
          default: !sshkeyObj.default, // toggle
        },
        broadcast: 'useraccount.ssh.refresh',
      });
    };

    self.deleteDedicatedSshKey = function (key) {
      return OvhHttp.delete('/me/sshKey/{keyName}', {
        rootPath: 'apiv6',
        urlParams: {
          keyName: key,
        },
        broadcast: 'useraccount.ssh.refresh',
      });
    };

    self.deleteCloudSshKey = function (serviceName, id) {
      return OvhHttp.delete('/cloud/project/{serviceName}/sshkey/{keyId}', {
        rootPath: 'apiv6',
        urlParams: {
          serviceName,
          keyId: id,
        },
        broadcast: 'useraccount.ssh.refresh',
      });
    };

    self.getSshCloudUrl = function (serviceName) {
      return `${constants.MANAGER_URLS.publicCloud}pci/projects/${serviceName}/ssh/add`;
    };
  },
]);
