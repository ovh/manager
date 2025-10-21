export default class NetAppVolumesDashboardAclController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.tableHeaders = [
      'netapp_volumes_dashboard_actives_nfs_ip',
      'netapp_volumes_dashboard_actives_nfs_version',
      'netapp_volumes_dashboard_actives_nfs_last_connection',
    ];
  }
}
