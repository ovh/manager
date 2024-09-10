import angular from 'angular';
import endsWith from 'lodash/endsWith';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import reduce from 'lodash/reduce';
import startsWith from 'lodash/startsWith';
import 'moment';

import Container from './container.class';
import ContainerObject from './container-object.class';

import {
  CONTAINER_COMMERCIAL_NAME,
  CONTAINER_DEFAULT_PASSWORD,
  CONTAINER_DEFAULT_PASSWORD_TENANTNAME,
  CONTAINER_DEFAULT_PASSWORD_USERNAME,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_TYPE_PUBLIC,
  OBJECT_CONTAINER_TYPE_STATIC,
  OBJECT_TYPE_SEALED,
  OPENIO_DEFAULT_REGION,
  OPENIO_PRESIGN_EXPIRE,
  PUBLIC_CLOUD_PRODUCT_NAME,
  STORAGE_GATEWAY,
  X_AUTH_TOKEN,
  X_CONTAINER_HEADERS_REGEX,
  X_CONTAINER_READ,
  X_CONTAINER_READ_PUBLIC_VALUE,
  X_AMZ_STORAGE_CLASS,
} from './containers.constants';

export default class PciStoragesContainersService {
  /* @ngInject */
  constructor(
    $http,
    $q,
    coreConfig,
    OvhApiCloudProjectStorage,
    OvhApiCloudProjectUser,
    OvhApiOrderCatalogPublic,
  ) {
    this.$http = $http;
    this.$q = $q;
    this.coreConfig = coreConfig;
    this.OvhApiCloudProjectStorage = OvhApiCloudProjectStorage;
    this.OvhApiCloudProjectUser = OvhApiCloudProjectUser;
    this.OvhApiOrderCatalogPublic = OvhApiOrderCatalogPublic;
  }

  getAccessAndToken(projectId, s3StorageType, selectedRegion) {
    if (!s3StorageType) {
      return this.$http
        .post(`/cloud/project/${projectId}/storage/access`)
        .then(({ data: { token, endpoints } }) => ({
          token,
          endpoints: reduce(
            endpoints,
            (result, endpoint) => ({
              ...result,
              [endpoint.region.toLowerCase()]: endpoint.url,
            }),
            {},
          ),
        }));
    }

    return this.getRegions(projectId, selectedRegion).then((region) => {
      const regionDetails = region.services.find(
        ({ name }) => name === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
      );

      return {
        endpoints: { [selectedRegion.toLowerCase()]: regionDetails.endpoint },
        regionDetails: region,
      };
    });
  }

  getRegions(projectId, selectedRegion) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${selectedRegion}`)
      .then(({ data }) => data);
  }

  getArchivePassword(projectId, { region }) {
    return this.OvhApiCloudProjectUser.v6()
      .query({
        serviceName: projectId,
      })
      .$promise.then((users) => {
        const promises = {
          users,
        };
        if (users.length > 0) {
          promises.openrc = this.$http.get(
            `/cloud/project/${projectId}/user/${users[0].id}/openrc?region=${region}`,
          );
        }
        return this.$q.all(promises);
      })
      .then(({ users, openrc }) => {
        if (openrc) {
          let cleanedOpenRc = { ...openrc };
          if (users.length > 1) {
            cleanedOpenRc = Object.keys(openrc).reduce((object, key) => {
              if (key !== 'osUsername') {
                return {
                  ...object,
                  [key]: openrc[key],
                };
              }
              return object;
            }, {});
          }
          return cleanedOpenRc;
        }
        return {};
      })
      .then((connectionInformation) => {
        let password = `${CONTAINER_DEFAULT_PASSWORD}`;
        if (has(connectionInformation, 'osTenantName')) {
          password = password.replace(
            CONTAINER_DEFAULT_PASSWORD_TENANTNAME,
            connectionInformation.osTenantName,
          );
        }
        if (has(connectionInformation, 'osUsername')) {
          password = password.replace(
            CONTAINER_DEFAULT_PASSWORD_USERNAME,
            connectionInformation.osUsername,
          );
        }

        return password;
      });
  }

  getAll(
    projectId,
    isArchive = null,
    withObjects = false,
    includeErrors = false,
  ) {
    const params = {
      serviceName: projectId,
      withObjects,
    };

    if (isArchive === true) {
      params.archive = true;
    } else if (isArchive === false) {
      params.archive = false;
    }

    return this.$http
      .get(`/cloud/project/${projectId}/storages`, {
        params,
        serviceType: 'aapi',
      })
      .then(({ data }) => {
        if (includeErrors) {
          return {
            resources: map(
              data.resources,
              (container) =>
                new Container({ ...container, state: container.public }),
            ),
            errors: data.errors,
          };
        }

        return map(
          data.resources,
          (container) =>
            new Container({ ...container, state: container.public }),
        );
      });
  }

  getContainer(
    projectId,
    containerId,
    isHighPerfStorage = false,
    containerRegion,
    s3StorageType,
  ) {
    let promise = null;
    const region = containerRegion || OPENIO_DEFAULT_REGION;
    if (s3StorageType) {
      promise = this.$http
        .get(
          `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${containerId}`,
        )
        .then(({ data }) => {
          return { ...data, region };
        });
    } else {
      promise = this.OvhApiCloudProjectStorage.v6().get({
        projectId,
        containerId,
      }).$promise;
    }
    return promise
      .then((container) =>
        this.$q.all({
          container,
          publicUrl: this.getContainerUrl(
            projectId,
            container,
            null,
            s3StorageType,
          ),
        }),
      )
      .then(
        ({ container, publicUrl }) =>
          new Container({
            ...container,
            state: container.public,
            isHighPerfStorage,
            s3StorageType,
            objects: map(
              container.objects,
              (object) =>
                new ContainerObject({
                  ...object,
                  isHighPerfStorage,
                  s3StorageType,
                }),
            ),
            id: containerId,
            publicUrl: publicUrl.url,
            regionDetails: publicUrl.regionDetails,
            virtualHost: container.virtualHost,
            storageGateway: STORAGE_GATEWAY[
              this.coreConfig.getRegion()
            ].replace(
              'REGION',
              (container.region || OPENIO_DEFAULT_REGION).toLowerCase(),
            ),
          }),
      );
  }

  getContainerUrl(projectId, container, file = null, s3StorageType) {
    return this.getAccessAndToken(
      projectId,
      s3StorageType,
      container.region,
    ).then(({ endpoints, regionDetails }) => {
      const url = !s3StorageType
        ? `${
            endpoints[(container.region || OPENIO_DEFAULT_REGION).toLowerCase()]
          }/${encodeURIComponent(container.name)}`
        : `${
            endpoints[(container.region || OPENIO_DEFAULT_REGION).toLowerCase()]
          }`;
      if (file) {
        return `${url}/${encodeURIComponent(file)}`;
      }

      return { url, regionDetails };
    });
  }

  requestContainer(projectId, container, optsParam = {}) {
    const opts = pickBy(optsParam, (value, key) => key !== 'file');
    return this.getAccessAndToken(projectId)
      .then((accessToken) =>
        this.$q.all({
          accessToken,
          url: this.getContainerUrl(projectId, container, optsParam.file),
        }),
      )
      .then(({ accessToken, url }) =>
        this.$http(
          angular.merge(
            {
              method: 'GET',
              url,
              headers: {
                [X_AUTH_TOKEN]: accessToken.token,
              },
            },
            opts,
          ),
        ),
      );
  }

  getContainerMetaData(projectId, container) {
    return this.requestContainer(projectId, container, {
      method: 'HEAD',
    }).then((metadata) =>
      pickBy(metadata.headers(), (value, key) =>
        X_CONTAINER_HEADERS_REGEX.test(key),
      ),
    );
  }

  manageContainerCreation(projectId, container) {
    const { offer } = container;

    switch (offer) {
      case OBJECT_CONTAINER_OFFER_SWIFT:
        return this.addSwiftStandardObjectContainer(projectId, container);

      case OBJECT_CONTAINER_OFFER_STORAGE_STANDARD:
        return this.addS3ObjectContainer(projectId, container);

      default:
        return this.$q.reject({
          data: {
            message: `${offer}: unknown container offer!`,
          },
        });
    }
  }

  /**
   * Used to create a SWIFT container object
   * @param projectId {String}: project id (serviceName)
   * @param container {Object}: container model
   * @returns {Promise}: $http request promise
   */
  addSwiftStandardObjectContainer(projectId, container) {
    const { region, name, archive } = container;

    return this.$http
      .post(`/cloud/project/${projectId}/storage`, {
        archive,
        containerName: name,
        region: region.name,
      })
      .then(({ data }) => data);
  }

  /**
   * Create a S3 Storage Object
   * @param projectId {String}: project id (serviceName)
   * @param container {Object}: container model
   * @returns {Promise}: $http request promise
   */
  addS3ObjectContainer(projectId, container) {
    const { region, name, ownerId, encryption, versioning } = container;
    return this.$http
      .post(`/cloud/project/${projectId}/region/${region.name}/storage`, {
        name,
        ownerId,
        encryption,
        ...(versioning?.status === 'enabled' && { versioning }),
      })
      .then(({ data }) => data);
  }

  /**
   * Toggle conatiner state (public / private)
   * @param projectId {String}: project id (serviceName)
   * @param container {Object}: container model
   * @returns {Promise}: $http request promise
   */
  toggleContainerState(projectId, container) {
    return this.$http.put(
      `/cloud/project/${projectId}/storage/${container.id}`,
      {
        containerType: container.state ? 'private' : 'public',
      },
    );
  }

  /**
   * Temporary feature to check if the merge of the S3 endpoints is ongoing.
   * @param projectId {String}: project id (serviceName)
   * @param {string} region container region
   * @returns boolean
   */
  hasOngoingOpenIOMigration(projectId, region) {
    return this.$http
      .get(
        `/cloud/project/${projectId}/region/${region}/storage/openiomigrating`,
      )
      .then(({ data }) => data?.ismigrating)
      .catch(() => false);
  }

  /**
   * Create a S3 High Perf Standard Object
   * Nota: later it will be used also to create S3 Standard Storage Object
   * @param projectId {String}: project id (serviceName)
   * @param container {Object}: container model
   * @returns {Promise}: $http request promise
   */
  addS3HighPerfStandardContainer(projectId, container) {
    const { region, name, ownerId, encryption, versioning } = container;

    return this.$http
      .post(`/cloud/project/${projectId}/region/${region.name}/storage`, {
        name,
        ownerId,
        encryption,
        ...(versioning?.status === 'enabled' && { versioning }),
      })
      .then(({ data }) => data);
  }

  addContainer(projectId, containerModel) {
    const { containerType } = containerModel;

    return (containerModel.archive
      ? this.addStorageContainer(
          projectId,
          containerModel.region.name,
          containerModel.name,
          containerModel.archive,
          containerModel.versioning,
        )
      : this.manageContainerCreation(projectId, containerModel)
    ).then((container) => {
      let returnPromise = this.$q.resolve();
      if (containerType === OBJECT_CONTAINER_TYPE_STATIC) {
        returnPromise = this.setContainerAsStatic(projectId, container);
      } else if (containerType === OBJECT_CONTAINER_TYPE_PUBLIC) {
        returnPromise = this.setContainerAsPublic(projectId, container);
      }
      return returnPromise;
    });
  }

  addStorageContainer(projectId, region, name, archive) {
    return this.OvhApiCloudProjectStorage.v6().save(
      { projectId },
      {
        archive,
        containerName: name,
        region,
      },
    ).$promise;
  }

  updateContainer(projectId, containerModel) {
    const { region, name, versioning, s3StorageType } = containerModel;

    const url =
      s3StorageType === 'storage'
        ? `/cloud/project/${projectId}/region/${region}/storage/${name}`
        : `/cloud/project/${projectId}/region/${region}/storageStandard/${name}`;

    return this.$http
      .put(url, {
        versioning,
      })
      .then(() => {
        return this.$q.resolve();
      });
  }

  setContainerAsStatic(projectId, container) {
    return this.$http
      .post(`/cloud/project/${projectId}/storage/${container.id}/static`)
      .then(({ data }) => data);
  }

  setContainerAsPublic(projectId, container) {
    return this.getContainerMetaData(projectId, container).then((metadata) => {
      if (metadata[X_CONTAINER_READ] !== X_CONTAINER_READ_PUBLIC_VALUE) {
        return this.requestContainer(projectId, container, {
          method: 'PUT',
          headers: {
            [X_CONTAINER_READ]: X_CONTAINER_READ_PUBLIC_VALUE,
          },
        });
      }
      return $.resolve();
    });
  }

  deleteContainer(projectId, container) {
    const promises = reduce(
      container.objects,
      (result, object) => [
        ...result,
        this.deleteObject(projectId, container, object),
      ],
      [],
    );

    return this.$q.all(promises).then(() => {
      if (container.s3StorageType) {
        return this.$http.delete(
          `/cloud/project/${projectId}/region/${container.region}/${container.s3StorageType}/${container.name}`,
        );
      }
      return this.OvhApiCloudProjectStorage.v6().delete({
        projectId,
        containerId: container.id,
      }).$promise;
    });
  }

  static getFilePath(filePrefix, file) {
    let prefix = '';
    if (filePrefix) {
      prefix = filePrefix;
      if (startsWith(filePrefix, '/')) {
        prefix = prefix.substring(1);
      }
      if (!endsWith(filePrefix, '/')) {
        prefix = `${prefix}/`;
      }
    }
    return `${prefix}${file.name}`;
  }

  addObjects(projectId, container, filePrefix, files) {
    return this.$q.all(
      map(files, (file) =>
        this.addObject(projectId, container, filePrefix, file),
      ),
    );
  }

  addObject(projectId, container, filePrefix, file) {
    const config = {
      headers: {
        'Content-Type': file.type,
      },
      data: file,
    };

    return this.$q
      .all({
        url: this.getContainerUrl(
          projectId,
          container,
          PciStoragesContainersService.getFilePath(filePrefix, file),
        ),
        accessToken: this.getAccessAndToken(projectId),
      })
      .then(({ accessToken, url }) => this.upload(url, config, accessToken));
  }

  upload(url, config, accessToken) {
    return this.$http.put(url, config.data, {
      headers: {
        ...config.headers,
        [X_AUTH_TOKEN]: accessToken.token,
      },
    });
  }

  addHighPerfObjects(
    serviceName,
    regionName,
    containerName,
    prefix,
    files,
    s3StorageType,
    storageClass,
  ) {
    return this.$q.all(
      map(files, (file) =>
        this.addHighPerfObject(
          serviceName,
          regionName,
          containerName,
          prefix,
          file,
          s3StorageType,
          storageClass,
        ),
      ),
    );
  }

  addHighPerfObject(
    serviceName,
    regionName,
    containerName,
    prefix,
    file,
    s3StorageType,
    storageClass,
  ) {
    const config = {
      headers: {
        'Content-Type': file.type,
      },
      data: file,
    };
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/${s3StorageType}/${containerName}/presign`,
        {
          expire: OPENIO_PRESIGN_EXPIRE,
          method: 'PUT',
          object: PciStoragesContainersService.getFilePath(prefix, file),
          storageClass,
        },
      )
      .then((res) => {
        config.headers[X_AMZ_STORAGE_CLASS] =
          res?.data?.signedHeaders[X_AMZ_STORAGE_CLASS];
        return res.data;
      })
      .then(({ url }) => {
        return this.$http.put(url, config.data, {
          headers: {
            ...config.headers,
          },
        });
      });
  }

  deleteS3Object(
    projectId,
    containerId,
    objectKey,
    containerRegion,
    s3StorageType,
  ) {
    const region = containerRegion || OPENIO_DEFAULT_REGION;
    const key = encodeURIComponent(objectKey).replace(/\./g, '%2E');
    return this.$http
      .delete(
        `/cloud/project/${projectId}/region/${region}/${s3StorageType}/${containerId}/object/${key}`,
      )
      .then(({ data }) => data);
  }

  deleteObject(projectId, container, object) {
    if (container.s3StorageType) {
      return this.deleteS3Object(
        projectId,
        container.id,
        object.name,
        container.region,
        container.s3StorageType,
      );
    }
    return this.requestContainer(projectId, container, {
      method: 'DELETE',
      file: object.name,
    });
  }

  getObjectUrl(projectId, containerId, object) {
    const expirationDate = moment()
      .add(1, 'week')
      .toISOString();
    return this.OvhApiCloudProjectStorage.v6()
      .getURL(
        {
          projectId,
          containerId,
        },
        {
          expirationDate,
          objectName: object.name,
        },
      )
      .$promise.then((resp) => resp.getURL);
  }

  downloadObject(projectId, containerId, object) {
    return this.getObjectUrl(projectId, containerId, object);
  }

  downloadStandardS3Object(serviceName, regionName, containerName, object) {
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/${object.s3StorageType}/${containerName}/presign`,
        {
          expire: OPENIO_PRESIGN_EXPIRE,
          method: 'GET',
          object: object.key,
        },
      )
      .then((res) => res.data);
  }

  unsealObject(projectId, container, object) {
    if (object.retrievalState === OBJECT_TYPE_SEALED) {
      return this.getObjectUrl(projectId, container.id, object)
        .then((url) => this.$http.get(url))
        .catch((error) => {
          // This call make a CORS error, but still initiate the process,
          // swallow status -1 which is what we get when cors fail.
          if (error.status !== -1) {
            throw error;
          }
        });
    }

    return this.$q.resolve();
  }

  getPriceEstimation(ovhSubsidiary) {
    return this.OvhApiOrderCatalogPublic.v6()
      .get({
        productName: PUBLIC_CLOUD_PRODUCT_NAME,
        ovhSubsidiary,
      })
      .$promise.then((catalog) => {
        let priceObj = null;
        find(get(catalog, 'addons', []), (addon) => {
          return (
            get(addon, 'blobs.commercial.name', null) ===
              CONTAINER_COMMERCIAL_NAME &&
            find(get(addon, 'pricings', []), (pricing) => {
              if (get(pricing, 'capacities', []).includes('renew')) {
                priceObj = pricing;
                return true;
              }
              return false;
            })
          );
        });
        return priceObj;
      });
  }
}
