import filter from 'lodash/filter';
import find from 'lodash/find';

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

    this.availableStreams = [];
    this.attachedReadOnlyStreams = [];

    this.availableAliases = [];
    this.attachedReadOnlyAliases = [];

    this.availableIndices = [];
    this.attachedReadOnlyIndices = [];
    this.attachedReadWriteIndices = [];

    this.availableDashboards = [];
    this.attachedReadOnlyDashboards = [];
    this.attachedReadWriteDashboards = [];

    this.availableOsds = [];
    this.attachedReadOnlyOsds = [];
    this.attachedReadWriteOsds = [];

    this.filteredElements = [];

    this.allPermissions = [];

    this.initLoaders();
  }

  initLoaders() {
    this.roleDetails = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.getRoleDetails(
          this.serviceName,
          this.roleId,
        ).then((role) => {
          this.LogsRolesService.getRolePermissions(
            this.serviceName,
            this.roleId,
          ).then(({ data }) => {
            this.allPermissions = data;

            this.loadAvailableAliases();
            this.loadAvailableDashboards();
            this.loadAvailableIndices();
            this.loadAvailableStreams();
            this.loadAvailableOsds();
          });
          return role;
        }),
    });
    this.roleDetails.load();
  }

  loadAvailableAliases() {
    this.LogsRolesService.getAllAliases(this.serviceName).then((result) => {
      this.availableAliases = this.getAvailable('aliasId', result);
      this.attachedReadOnlyAliases = this.getSelected(
        'aliasId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RO,
      );
    });
  }

  loadAvailableIndices() {
    this.LogsRolesService.getAllIndices(this.serviceName).then((result) => {
      this.availableIndices = this.getAvailable('indexId', result);
      this.attachedReadOnlyIndices = this.getSelected(
        'indexId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RO,
      );
      this.attachedReadWriteIndices = this.getSelected(
        'indexId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RW,
      );
    });
  }

  loadAvailableDashboards() {
    this.LogsRolesService.getAllDashboards(this.serviceName).then((result) => {
      this.availableDashboards = this.getAvailable('dashboardId', result);
      this.attachedReadOnlyDashboards = this.getSelected(
        'dashboardId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RO,
      );
      this.attachedReadWriteDashboards = this.getSelected(
        'dashboardId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RW,
      );
    });
  }

  loadAvailableStreams() {
    this.LogsRolesService.getAllStreams(this.serviceName).then((result) => {
      this.availableStreams = this.getAvailable('streamId', result);
      this.attachedReadOnlyStreams = this.getSelected(
        'streamId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RO,
      );
    });
  }

  loadAvailableOsds() {
    this.LogsRolesService.getAllOsds(this.serviceName).then((result) => {
      this.availableOsds = this.getAvailable('osdId', result);
      this.attachedReadOnlyOsds = this.getSelected(
        'osdId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RO,
      );
      this.attachedReadWriteOsds = this.getSelected(
        'osdId',
        result,
        this.LogsConstants.PERMISSION_TYPES.RW,
      );
    });
  }

  getAvailable(searchId, result) {
    this.filteredElements = filter(
      result,
      (obj) =>
        !find(
          this.allPermissions,
          (permission) => permission[searchId] === obj[searchId],
        ),
    );
    return this.filteredElements;
  }

  getSelected(searchId, result, permissionType) {
    this.filteredElements = filter(result, (obj) =>
      find(
        this.allPermissions,
        (permission) =>
          permission[searchId] === obj[searchId] &&
          permission.permissionType === permissionType,
      ),
    );
    return this.filteredElements;
  }

  findPermission(obj, searchId) {
    const foundPermission = find(
      this.allPermissions,
      (permission) => permission[searchId] === obj[0][searchId],
    );
    return foundPermission.permissionId;
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

  attachOsd(item, rw) {
    this.CucCloudMessage.flushChildMessage();
    this.saveOsd = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.addOsd(
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
    return this.saveOsd.load();
  }

  removePermission(permission, searchId) {
    this.CucCloudMessage.flushChildMessage();
    this.deletePermission = this.CucControllerHelper.request.getArrayLoader({
      loaderFunction: () =>
        this.LogsRolesService.removePermission(
          this.serviceName,
          this.roleId,
          this.findPermission(permission, searchId),
        ),
      errorHandler: () => this.CucControllerHelper.scrollPageToTop(),
    });
    return this.deletePermission.load();
  }
}
