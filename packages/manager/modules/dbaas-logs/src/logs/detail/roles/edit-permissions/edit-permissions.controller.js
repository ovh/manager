import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';

export default class LogsRolesPermissionsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    CucCloudMessage,
    CucControllerHelper,
    LogsRolesService,
    LogsConstants,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.serviceName = this.$stateParams.serviceName;
    this.roleId = this.$stateParams.roleId;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsRolesService = LogsRolesService;
    this.CucCloudMessage = CucCloudMessage;
    this.LogsConstants = LogsConstants;
    this.initLoaders();
  }

  initLoaders() {
    this.availableStreams = this.$q.defer();
    this.attachedReadOnlyStreams = this.$q.defer();

    this.availableAliases = this.$q.defer();
    this.attachedReadOnlyAliases = this.$q.defer();

    this.availableIndices = this.$q.defer();
    this.attachedReadOnlyIndices = this.$q.defer();
    this.attachedReadWriteIndices = this.$q.defer();

    this.availableDashboards = this.$q.defer();
    this.attachedReadOnlyDashboards = this.$q.defer();
    this.attachedReadWriteDashboards = this.$q.defer();

    this.availableKibanas = this.$q.defer();
    this.attachedReadOnlyKibanas = this.$q.defer();
    this.attachedReadWriteKibanas = this.$q.defer();

    this.roleDetails = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getRoleDetails(
          this.serviceName,
          this.roleId,
        ).then((role) => {
          this.loadAttachedPermissions(role.permissions);

          this.loadAvailableAliases(role.permissions);
          this.loadAvailableDashboards(role.permissions);
          this.loadAvailableIndices(role.permissions);
          this.loadAvailableStreams(role.permissions);
          this.loadAvailableKibanas(role.permissions);

          return role;
        }),
    });
    this.roleDetails.load();
  }

  loadAvailableAliases(permissionList) {
    this.allAliases = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getAllAliases(this.serviceName).then((result) => {
          const search = map(
            filter(
              result,
              (alias) =>
                alias.info.isEditable &&
                !find(
                  permissionList,
                  (permission) => permission.aliasId === alias.info.aliasId,
                ),
            ),
            'info',
          );
          this.availableAliases.resolve(search);
        }),
    });
    this.allAliases.load();
  }

  loadAvailableIndices(permissionList) {
    this.allIndices = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getAllIndices(this.serviceName).then((result) => {
          const search = map(
            filter(
              result,
              (index) =>
                index.info.isEditable &&
                !find(
                  permissionList,
                  (permission) => permission.indexId === index.info.indexId,
                ),
            ),
            'info',
          );
          this.availableIndices.resolve(search);
        }),
    });
    this.allIndices.load();
  }

  loadAvailableDashboards(permissionList) {
    this.allDashboards = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getAllDashboards(this.serviceName).then(
          (result) => {
            const search = map(
              filter(
                result,
                (dashboard) =>
                  dashboard.info.isEditable &&
                  !find(
                    permissionList,
                    (permission) =>
                      permission.dashboardId === dashboard.info.dashboardId,
                  ),
              ),
              'info',
            );
            this.availableDashboards.resolve(search);
          },
        ),
    });
    this.allDashboards.load();
  }

  loadAvailableStreams(permissionList) {
    this.allStreams = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getAllStreams(this.serviceName).then((result) => {
          const search = map(
            filter(
              result,
              (stream) =>
                stream.info.isEditable &&
                !find(
                  permissionList,
                  (permission) => permission.streamId === stream.info.streamId,
                ),
            ),
            'info',
          );
          this.availableStreams.resolve(search);
        }),
    });
    this.allStreams.load();
  }

  loadAvailableKibanas(permissionList) {
    this.allKibanas = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getAllKibanas(this.serviceName).then((result) => {
          const search = map(
            filter(
              result,
              (kibana) =>
                kibana.info.isEditable &&
                !find(
                  permissionList,
                  (permission) => permission.kibanaId === kibana.info.kibanaId,
                ),
            ),
            'info',
          );
          this.availableKibanas.resolve(search);
        }),
    });
    this.allKibanas.load();
  }

  /**
   * initializes and loads list of permissions
   * adding permissionId to the object of index, alias, dashboard and stream so as to use it to
   * remove permission later
   * @memberof LogsRolesPermissionsCtrl
   */
  loadAttachedPermissions(permissionList) {
    this.readOnlyPermissions = this.LogsRolesService.getNewReadOnlyPermissions();
    this.readWritePermissions = this.LogsRolesService.getNewReadWritePermissions();
    permissionList.forEach((permission) => {
      if (permission.index) {
        assignIn(permission.index, { permissionId: permission.permissionId });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RO
        ) {
          this.readOnlyPermissions.index.push(permission.index);
        } else if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.index.push(permission.index);
        }
      }
      if (permission.alias) {
        assignIn(permission.alias, { permissionId: permission.permissionId });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RO
        ) {
          this.readOnlyPermissions.alias.push(permission.alias);
        }
      }
      if (permission.stream) {
        assignIn(permission.stream, { permissionId: permission.permissionId });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RO
        ) {
          this.readOnlyPermissions.stream.push(permission.stream);
        }
      }
      if (permission.dashboard) {
        assignIn(permission.dashboard, {
          permissionId: permission.permissionId,
        });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RO
        ) {
          this.readOnlyPermissions.dashboard.push(permission.dashboard);
        } else if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.dashboard.push(permission.dashboard);
        }
      }
      if (permission.kibana) {
        assignIn(permission.kibana, {
          permissionId: permission.permissionId,
        });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RO
        ) {
          this.readOnlyPermissions.kibana.push(permission.kibana);
        } else if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.kibana.push(permission.kibana);
        }
      }
    });
    this.attachedReadOnlyIndices.resolve(this.readOnlyPermissions.index);
    this.attachedReadOnlyAliases.resolve(this.readOnlyPermissions.alias);
    this.attachedReadOnlyDashboards.resolve(this.readOnlyPermissions.dashboard);
    this.attachedReadOnlyStreams.resolve(this.readOnlyPermissions.stream);
    this.attachedReadOnlyKibanas.resolve(this.readOnlyPermissions.kibana);

    this.attachedReadWriteIndices.resolve(this.readWritePermissions.index);
    this.attachedReadWriteDashboards.resolve(
      this.readWritePermissions.dashboard,
    );
    this.attachedReadWriteKibanas.resolve(this.readWritePermissions.kibana);
  }

  loadAttachedReadWritePermissions(permissionList) {
    this.readWritePermissions = this.LogsRolesService.getNewReadWritePermissions();
    permissionList.forEach((permission) => {
      if (permission.index) {
        assignIn(permission.index, { permissionId: permission.permissionId });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.index.push(permission.index);
        }
      }
      if (permission.dashboard) {
        assignIn(permission.dashboard, {
          permissionId: permission.permissionId,
        });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.dashboard.push(permission.dashboard);
        }
      }
      if (permission.kibana) {
        assignIn(permission.kibana, {
          permissionId: permission.permissionId,
        });
        if (
          permission.permissionType === this.LogsConstants.PERMISSION_TYPES.RW
        ) {
          this.readWritePermissions.kibana.push(permission.kibana);
        }
      }
    });

    this.attachedReadWriteIndices.resolve(this.readWritePermissions.index);
    this.attachedReadWriteDashboards.resolve(
      this.readWritePermissions.dashboard,
    );
    this.attachedReadWriteKibanas.resolve(this.readWritePermissions.kibana);
  }

  attachAlias(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveAlias = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addAlias(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveAlias.load();
  }

  attachIndex(item, rw) {
    this.CucCloudMessage.flushChildMessage();
    this.saveIndex = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addIndex(
          this.serviceName,
          this.roleId,
          item[0],
          rw
            ? this.LogsConstants.PERMISSION_TYPES.RW
            : this.LogsConstants.PERMISSION_TYPES.RO,
        ),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveIndex.load();
  }

  attachStream(item) {
    this.CucCloudMessage.flushChildMessage();
    this.saveStream = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addStream(this.serviceName, this.roleId, item[0]),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveStream.load();
  }

  attachDashboard(item, rw) {
    this.CucCloudMessage.flushChildMessage();
    this.saveDashboard = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addDashboard(
          this.serviceName,
          this.roleId,
          item[0],
          rw
            ? this.LogsConstants.PERMISSION_TYPES.RW
            : this.LogsConstants.PERMISSION_TYPES.RO,
        ),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveDashboard.load();
  }

  attachKibana(item, rw) {
    this.CucCloudMessage.flushChildMessage();
    this.saveKibana = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addKibana(
          this.serviceName,
          this.roleId,
          item[0],
          rw
            ? this.LogsConstants.PERMISSION_TYPES.RW
            : this.LogsConstants.PERMISSION_TYPES.RO,
        ),
      successHandler: () => this.roleDetails.load(),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.saveKibana.load();
  }

  removePermission(permission) {
    this.CucCloudMessage.flushChildMessage();
    this.deletePermission = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.removePermission(
          this.serviceName,
          this.roleId,
          permission,
        ),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.deletePermission.load();
  }
}
