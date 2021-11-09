export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.acl', {
    url: '/acl',
    component: 'ovhManagerNetAppVolumesDashboardAcl',
    resolve: {
      acls: /* @ngInject */ ($http, serviceName, volumeId) =>
        $http
          .get(`/storage/netapp/${serviceName}/share/${volumeId}/acl`)
          .then(({ data }) => data),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_volumes_acl_breadcrumb'),
      createAcl: /* @ngInject */ ($http, serviceName, trackClick, volumeId) => (
        aclRule,
      ) => {
        trackClick('acl::add');
        return $http.post(
          `/storage/netapp/${serviceName}/share/${volumeId}/acl`,
          {
            ...aclRule,
          },
        );
      },
      deleteAcl: /* @ngInject */ ($http, serviceName, volumeId) => (
        aclRuleId,
      ) =>
        $http
          .delete(
            `/storage/netapp/${serviceName}/share/${volumeId}/acl/${aclRuleId}`,
          )
          .then(({ data }) => data),
      storageApiSchema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),
      shareACLPermissionEnum: /* @ngInject */ ($translate, storageApiSchema) =>
        storageApiSchema.models[
          'storage.NetAppShareACLPermissionEnum'
        ].enum.map((permission) => ({
          label: $translate.instant(
            `netapp_volumes_acl_access_level_${permission}`,
          ),
          value: permission,
        })),
      shareACLTypeEnum: /* @ngInject */ ($translate, storageApiSchema) =>
        storageApiSchema.models['storage.NetAppShareACLTypeEnum'].enum.map(
          (type) => ({
            label: $translate.instant(`netapp_volumes_acl_access_type_${type}`),
            value: type,
          }),
        ),
    },
  });
};
