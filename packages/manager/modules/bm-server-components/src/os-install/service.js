import angular from 'angular';
import camelCase from 'lodash/camelCase';
import indexOf from 'lodash/indexOf';
import map from 'lodash/map';
import parseInt from 'lodash/parseInt';
import sortBy from 'lodash/sortBy';

export default class BmServerComponentsOsInstallService {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  getTemplates(serviceName, type) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/installation/templates`, {
        serviceType: 'aapi',
        params: {
          type,
        },
      })
      .then(({ data }) => data);
  }

  getHardwareRaidProfile(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/install/hardwareRaidProfile`)
      .then(({ data }) => data);
  }

  getHardwareSpecifications(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/specifications/hardware`)
      .then(({ data }) => data);
  }

  getTemplateCapabilities(serviceName, templateName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/install/templateCapabilities`, {
        params: {
          templateName,
        },
      })
      .then(({ data }) => data);
  }

  getSshKey() {
    return this.$http.get(`/me/sshKey`).then(({ data }) => data);
  }

  getPartitionSchemes(productId, templateName) {
    return this.$http
      .get(`/me/installationTemplate/${templateName}/partitionScheme`)
      .then(({ data }) => data);
  }

  getPartitionSchemePriority(productId, templateName, schemeName) {
    return this.$http
      .get(
        `/me/installationTemplate/${templateName}/partitionScheme/${schemeName}`,
      )
      .then(({ data }) => data);
  }

  getOvhPartitionSchemesTemplates(serviceName, template, lang) {
    return this.$http
      .get(
        `/sws/dedicated/server/${serviceName}/installation/${template}/${lang}/partitionSchemes`,
        {
          serviceType: 'aapi',
        },
      )
      .then(({ data }) => data);
  }

  getOvhPartitionSchemesTemplatesDetail(template, partitionScheme) {
    return this.$http
      .get(
        `/sws/dedicated/server/installationTemplate/${template}/${partitionScheme}/partitions`,
        {
          serviceType: 'aapi',
        },
      )
      .then(({ data }) => data);
  }

  postAddPartition(gabaritName, gabaritSchemePartitionName, partition) {
    const data = angular.copy(partition);
    data.type = camelCase(data.typePartition);
    delete data.typePartition;

    data.filesystem = camelCase(data.fileSystem);
    delete data.fileSystem;

    data.size = camelCase(data.partitionSize);
    delete data.partitionSize;

    data.raid = data.raid ? parseInt(data.raid.replace(/_/g, ''), 10) : null;

    delete data.oldMountPoint;

    data.step = camelCase(data.order);
    delete data.order;

    data.mountpoint = data.mountPoint;
    delete data.mountPoint;

    return this.$http
      .post(
        `/me/installationTemplate/${gabaritName}/partitionScheme/${gabaritSchemePartitionName}/partition`,
        data,
      )
      .then((res) => res.data);
  }

  putSetPartition(gabaritName, gabaritSchemePartitionName, partition) {
    const newPartition = angular.copy(partition);
    newPartition.filesystem = camelCase(newPartition.fileSystem);
    newPartition.mountpoint = newPartition.mountPoint;
    newPartition.size = {
      value: newPartition.partitionSize,
      unit: 'MB',
    };
    newPartition.type = camelCase(newPartition.typePartition);
    newPartition.raid = newPartition.raid
      ? parseInt(newPartition.raid.replace(/_/g, ''), 10)
      : null;
    delete newPartition.fileSystem;
    delete newPartition.mountPoint;
    delete newPartition.typePartition;
    delete newPartition.partitionSize;
    delete newPartition.oldMountPoint;

    return this.$http
      .put(
        `/me/installationTemplate/${gabaritName}/partitionScheme/${gabaritSchemePartitionName}/partition/${encodeURIComponent(
          partition.oldMountPoint,
        )}`,
        newPartition,
      )
      .then(({ data }) => data);
  }

  deleteSetPartition(gabaritName, gabaritSchemePartitionName, mountpoint) {
    return this.$http
      .delete(
        `/me/installationTemplate/${gabaritName}/partitionScheme/${gabaritSchemePartitionName}/partition/${encodeURIComponent(
          mountpoint,
        )}`,
      )
      .then(({ data }) => data);
  }

  createPartitioningScheme(productId, gabaritName, newPartitioningScheme) {
    return this.getPartitionSchemePriority(
      productId,
      gabaritName,
      newPartitioningScheme.name,
    )
      .catch((data) =>
        data.status === 404 ? 'no_partition' : this.$q.reject(data),
      )
      .then((status) => {
        if (status === 'no_partition') {
          return this.$http.post(
            `/me/installationTemplate/${gabaritName}/partitionScheme`,
            newPartitioningScheme,
          );
        }

        return null;
      });
  }

  cloneDefaultPartitioningScheme(
    productId,
    gabaritName,
    newPartitioningSchemeName,
  ) {
    return this.$http
      .get(
        `/me/installationTemplate/${gabaritName}/partitionScheme/default/partition`,
      )
      .then(({ data }) => data)
      .then((mountpoints) => {
        const getMountpoints = map(mountpoints, (mountpoint) =>
          this.$http
            .get(
              `/me/installationTemplate/${gabaritName}/partitionScheme/${newPartitioningSchemeName}/partition/${encodeURIComponent(
                mountpoint,
              )}`,
            )
            .then(({ data }) => data)
            .catch((error) => {
              return error.status === 404
                ? 'no_mountpoint'
                : this.$q.reject(error);
            })
            .then((status) => {
              if (status === 'no_mountpoint') {
                return this.$http
                  .get(
                    `/me/installationTemplate/${gabaritName}/partitionScheme/default/partition/${encodeURIComponent(
                      mountpoint,
                    )}`,
                  )
                  .then(({ data }) => data)
                  .then((mountpointDetails) =>
                    this.$http
                      .post(
                        `/me/installationTemplate/${gabaritName}/partitionScheme/${newPartitioningSchemeName}/partition`,
                        {
                          filesystem: mountpointDetails.filesystem,
                          mountpoint: mountpointDetails.mountpoint,
                          raid: mountpointDetails.raid,
                          size: mountpointDetails.size.value,
                          step: mountpointDetails.order,
                          type: mountpointDetails.type,
                          volumeName: mountpointDetails.volumeName,
                        },
                      )
                      .then(({ data }) => data),
                  );
              }
              return null;
            }),
        );

        return this.$q.all(getMountpoints);
      });
  }

  startInstallation(serviceName, templateName, details) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/install/start`, {
        details,
        templateName,
      })
      .then(({ data }) => data);
  }

  getHighestPriorityPartitionScheme(productId, templateName) {
    return this.getPartitionSchemes(productId, templateName).then((schemes) => {
      const getSchemes = map(schemes, (scheme) =>
        this.getPartitionSchemePriority(productId, templateName, scheme),
      );

      return this.$q.all(getSchemes).then((schemesDetails) => {
        const list = sortBy(schemesDetails, 'priority').reverse();

        return list[0];
      });
    });
  }

  getPartitionSchemeHardwareRaid(productId, templateName, schemeName) {
    return this.$http
      .get(
        `/me/installationTemplate/${templateName}/partitionScheme/${schemeName}/hardwareRaid`,
      )
      .then(({ data }) => data)
      .then((response) => {
        const index = indexOf(response, 'managerHardRaid');

        if (index !== -1) {
          return this.$http
            .get(
              `/me/installationTemplate/${templateName}/partitionScheme/${schemeName}/hardwareRaid/${response[index]}`,
            )
            .then(({ data }) => data);
        }

        if (response.length > 0) {
          return this.$http
            .get(
              `/me/installationTemplate/${templateName}/partitionScheme/${schemeName}/hardwareRaid/${response[0]}`,
            )
            .then(({ data }) => data);
        }

        return this.$q.when();
      });
  }

  putSetGabarit(productId, gabaritName, gabaritNameNew, customization) {
    return this.$http
      .put(`/me/installationTemplate/${gabaritName}`, {
        templateName: gabaritNameNew,
        customization,
      })
      .then(({ data }) => data);
  }

  deleteGabarit(productId, gabaritName) {
    return this.$http
      .delete(`/me/installationTemplate/${gabaritName}`)
      .then(({ data }) => data);
  }
}
