import flatten from 'lodash/flatten';
import get from 'lodash/get';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export default /* @ngInject */ function UserAccountSshService(
  OvhHttp,
  $q,
  coreURLBuilder,
  iceberg,
) {
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
    return iceberg('/me/sshKey')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        data.map((sshItem) => ({
          ...sshItem,
          category: 'dedicated',
        })),
      );
  };

  self.getCloudSshList = async function getCloudSshList() {
    const { data } = await iceberg('/cloud/project')
      .query()
      .expand('CachedObjectList-Pages')
      .execute().$promise;

    const validProjects = data.filter((f) => f.status === 'ok');
    const promises = validProjects.map(async (project) => {
      const serviceName = project.project_id;

      const keys = await OvhHttp.get('/cloud/project/{serviceName}/sshkey', {
        rootPath: 'apiv6',
        urlParams: { serviceName },
      });

      const url = self.getSshCloudUrl(serviceName);

      return keys.map((key) => ({
        serviceName,
        serviceDescription: project.description,
        category: 'cloud',
        url,
        id: key.id,
        keyName: key.name,
        key: key.publicKey,
      }));
    });

    const results = await $q.all(promises);
    return results.flat();
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
