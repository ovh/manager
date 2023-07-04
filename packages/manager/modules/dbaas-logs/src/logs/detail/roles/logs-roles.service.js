export default class LogsRolesService {
  /* @ngInject */
  constructor(
    $q,
    $http,
    $translate,
    CucCloudPoll,
    CucControllerHelper,
    LogsAliasesService,
    LogsDashboardsService,
    LogsHelperService,
    LogsIndexService,
    LogsConstants,
    LogsStreamsService,
    LogsOsdService,
    iceberg,
    CucServiceHelper,
  ) {
    this.$q = $q;
    this.$http = $http;
    this.$translate = $translate;
    this.CucServiceHelper = CucServiceHelper;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsDashboardsService = LogsDashboardsService;
    this.LogsAliasesService = LogsAliasesService;
    this.LogsIndexService = LogsIndexService;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsOsdService = LogsOsdService;
    this.LogsHelperService = LogsHelperService;
    this.iceberg = iceberg;
    this.LogsConstants = LogsConstants;
    this.CucCloudPoll = CucCloudPoll;

    this.newRole = {
      description: '',
      name: '',
    };

    this.readOnlyPermissions = {
      dashboard: [],
      alias: [],
      index: [],
      stream: [],
      osd: [],
    };

    this.readWritePermissions = {
      dashboard: [],
      alias: [],
      index: [],
      stream: [],
      osd: [],
    };
  }

  getNewReadOnlyPermissions() {
    this.readOnlyPermissions.dashboard.length = 0;
    this.readOnlyPermissions.alias.length = 0;
    this.readOnlyPermissions.index.length = 0;
    this.readOnlyPermissions.stream.length = 0;
    this.readOnlyPermissions.osd.length = 0;
    return this.readOnlyPermissions;
  }

  getNewReadWritePermissions() {
    this.readWritePermissions.dashboard.length = 0;
    this.readWritePermissions.alias.length = 0;
    this.readWritePermissions.index.length = 0;
    this.readWritePermissions.stream.length = 0;
    this.readWritePermissions.osd.length = 0;
    return this.readWritePermissions;
  }

  getAllStreams(serviceName) {
    return this.LogsStreamsService.getOwnStreams(serviceName);
  }

  getAllAliases(serviceName) {
    return this.LogsAliasesService.getOwnAliases(serviceName);
  }

  getAllDashboards(serviceName) {
    return this.LogsDashboardsService.getOwnDashboards(serviceName);
  }

  getAllIndices(serviceName) {
    return this.LogsIndexService.getOwnIndices(serviceName);
  }

  getAllOsds(serviceName) {
    return this.LogsOsdService.getOwnOsds(serviceName);
  }

  addAlias(serviceName, roleId, alias) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/permission/alias`, {
        aliasId: alias.aliasId,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_roles_add_alias_error', err, {
          tokenName: alias.name,
        }),
      );
  }

  addDashboard(serviceName, roleId, dashboard, permissionType) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/permission/dashboard`, {
        dashboardId: dashboard.dashboardId,
        permissionType,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_roles_add_dashboard_error',
          err,
          {
            tokenName: dashboard.title,
          },
        ),
      );
  }

  addIndex(serviceName, roleId, index, permissionType) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/permission/index`, {
        indexId: index.indexId,
        permissionType,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_roles_add_index_error', err, {
          tokenName: index.name,
        }),
      );
  }

  addStream(serviceName, roleId, stream) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/permission/stream`, {
        streamId: stream.streamId,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_roles_add_stream_error', err, {
          tokenName: stream.title,
        }),
      );
  }

  addOsd(serviceName, roleId, osd, permissionType) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/permission/osd`, {
        osdId: osd.osdId,
        permissionType,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_roles_add_kibana_error', err, {
          tokenName: osd.name,
        }),
      );
  }

  removePermission(serviceName, roleId, permissionId) {
    return this.$http
      .delete(
        `/dbaas/logs/${serviceName}/role/${roleId}/permission/${permissionId}`,
      )
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_remove_permission_error',
          err,
          {
            tokenName: permissionId,
          },
        ),
      );
  }

  getNewRole() {
    return this.newRole;
  }

  getLogs() {
    return this.iceberg(`/dbaas/logs`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getRoles(serviceName) {
    return this.iceberg(`/dbaas/logs/${serviceName}/role`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getPaginatedRoles(
    serviceName,
    offset = 0,
    pageSize = 25,
    sort = { name: 'name', dir: 'desc' },
    filters = null,
  ) {
    let res = this.iceberg(`/dbaas/logs/${serviceName}/role`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(pageSize)
      .offset(offset)
      .sort(sort.name, sort.dir);
    if (filters !== null) {
      filters.forEach((filter) => {
        res = res.addFilter(filter.name, filter.operator, filter.value);
      });
    }
    return res.execute().$promise.then((response) => ({
      data: response.data,
      meta: {
        totalCount:
          parseInt(response.headers['x-pagination-elements'], 10) || 0,
      },
    }));
  }

  getRoleMembers(serviceName, roleId) {
    return this.iceberg(`/dbaas/logs/${serviceName}/role/${roleId}/member`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getRolePermissions(serviceName, roleId) {
    return this.iceberg(`/dbaas/logs/${serviceName}/role/${roleId}/permission`)
      .query()
      .expand('CachedObjectList-Pages')
      .limit(10000)
      .execute().$promise;
  }

  getRoleDetails(serviceName, roleId) {
    return this.$http.get(`/dbaas/logs/${serviceName}/role/${roleId}`);
  }

  addRole(serviceName, object) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role`, {
        description: object.description,
        name: object.name,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_role_add_success',
          { name: object.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_role_add_error', err, {
          name: object.name,
        }),
      );
  }

  updateRole(serviceName, roleId, object) {
    return this.$http
      .put(`/dbaas/logs/${serviceName}/role/${roleId}`, {
        description: object.description,
        name: object.name,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_role_update_success',
          { name: object.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_role_update_error', err, {
          name: object.name,
        }),
      );
  }

  deleteRole(serviceName, role) {
    return this.$http
      .delete(`/dbaas/logs/${serviceName}/role/${role.roleId}`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_role_delete_success',
          { name: role.name },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_role_delete_error', err, {
          name: role.name,
        }),
      );
  }

  deleteModal(role) {
    return this.CucControllerHelper.modal.showDeleteModal({
      titleText: this.$translate.instant('logs_role_modal_delete_title'),
      textHtml: this.$translate.instant('logs_role_modal_delete_question', {
        name: role.name,
      }),
    });
  }

  createMember(serviceName, roleId, userDetails) {
    return this.$http
      .post(`/dbaas/logs/${serviceName}/role/${roleId}/member`, {
        note: userDetails.note,
        username: userDetails.username,
      })
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_role_member_add_success',
          { name: userDetails.username },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError('logs_role_member_add_error', err, {
          name: userDetails.username,
        }),
      );
  }

  removeMember(serviceName, roleId, username) {
    return this.$http
      .delete(`/dbaas/logs/${serviceName}/role/${roleId}/member/${username}`)
      .then((operation) => {
        return this.LogsHelperService.handleOperation(
          serviceName,
          operation.data || operation,
          'logs_role_member_remove_success',
          { name: username },
        );
      })
      .catch((err) =>
        this.LogsHelperService.handleError(
          'logs_role_member_remove_error',
          err,
          {
            name: username,
          },
        ),
      );
  }

  deleteMemberModal(username) {
    return this.CucControllerHelper.modal.showDeleteModal({
      titleText: this.$translate.instant('logs_member_delete_title'),
      textHtml: this.$translate.instant('logs_member_delete_question', {
        username,
      }),
    });
  }
}
