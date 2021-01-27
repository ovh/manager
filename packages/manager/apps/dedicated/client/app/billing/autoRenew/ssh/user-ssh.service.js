import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import partition from 'lodash/partition';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export default /* @ngInject */ function UserAccountSshService(
  OvhHttp,
  $q,
  coreURLBuilder,
) {
  const CLOUD_CACHE_KEY = 'UNIVERS_DEDICATED_USER_ACCOUNT_SSH_CLOUD';
  const self = this;

  self.getAllSshKeyList = function getAllSshKeyList(_filter) {
    const categoryFilter = get(_filter, 'categoryFilter', null);

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

    return $q
      .allSettled(promises)
      .then((sshKeys) => [sshKeys])
      .catch((sshKeys) =>
        partition(flatten(sshKeys), ({ message }) => !message),
      )
      .then(([sshKeys, error]) => {
        const keys = sortBy(flatten(values(sshKeys)), (key) =>
          key.keyName.toLowerCase(),
        );

        if (error) {
          return $q.reject([keys, error]);
        }

        return keys;
      });
  };

  self.getDedicatedSshList = function getDedicatedSshList() {
    return OvhHttp.get('/me/sshKey', {
      rootPath: 'apiv6',
    }).then((keyNames) => {
      const promises = map(keyNames, (keyName) =>
        self.getDedicatedSshKey(keyName),
      );
      return $q.allSettled(promises);
    });
  };

  self.getDedicatedSshKey = function getDedicatedSshKey(keyName) {
    return OvhHttp.get('/me/sshKey/{keyName}', {
      rootPath: 'apiv6',
      urlParams: {
        keyName,
      },
    }).then((key) => {
      set(key, 'category', 'dedicated');
      return key;
    });
  };

  self.getCloudProjects = function getCloudProjects() {
    return OvhHttp.get('/cloud/project', {
      rootPath: 'apiv6',
      cache: CLOUD_CACHE_KEY,
      clearCache: false,
    })
      .then((projectIds) =>
        $q.all(
          map(projectIds, (projectId) =>
            OvhHttp.get('/cloud/project/{serviceName}', {
              rootPath: 'apiv6',
              urlParams: {
                serviceName: projectId,
              },
              cache: CLOUD_CACHE_KEY,
              clearCache: false,
            }),
          ),
        ),
      )
      .then((projects) =>
        map(filter(projects, { status: 'ok' }), (project) => ({
          id: project.project_id,
          description: project.description,
        })),
      );
  };

  self.getCloudSshList = function getCloudSshList() {
    return self
      .getCloudProjects()
      .then((projects) => {
        const promises = map(projects, (project) =>
          OvhHttp.get('/cloud/project/{serviceName}/sshkey', {
            rootPath: 'apiv6',
            urlParams: {
              serviceName: project.id,
            },
          }).then((keys) =>
            map(keys, (key) => ({
              serviceName: project.id,
              serviceDescription: project.description,
              category: 'cloud',
              keyName: key.name,
              key: key.publicKey,
              id: key.id,
              url: self.getSshCloudUrl(project.id),
            })),
          ),
        );
        return $q.allSettled(promises);
      })
      .then((keysByProjet) => flatten(keysByProjet));
  };

  self.addDedicatedSshKey = function addDedicatedSshKey(sshkeyObj) {
    return OvhHttp.post('/me/sshKey', {
      rootPath: 'apiv6',
      data: {
        keyName: sshkeyObj.keyName,
        key: sshkeyObj.key.trim().replace(/\n/, ''),
      },
      broadcast: 'useraccount.ssh.refresh',
    });
  };

  self.setDefaultDedicatedSshKey = function setDefaultDedicatedSshKey(
    sshkeyObj,
  ) {
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

  self.deleteDedicatedSshKey = function deleteDedicatedSshKey(key) {
    return OvhHttp.delete('/me/sshKey/{keyName}', {
      rootPath: 'apiv6',
      urlParams: {
        keyName: key,
      },
      broadcast: 'useraccount.ssh.refresh',
    });
  };

  self.deleteCloudSshKey = function deleteCloudSshKey(serviceName, id) {
    return OvhHttp.delete('/cloud/project/{serviceName}/sshkey/{keyId}', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        keyId: id,
      },
      broadcast: 'useraccount.ssh.refresh',
    });
  };

  self.getSshCloudUrl = function getSshCloudUrl(serviceName) {
    return coreURLBuilder.buildURL(
      'public-cloud',
      '#/pci/projects/:serviceName/ssh/add',
      {
        serviceName,
      },
    );
  };
}
