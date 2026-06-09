import controller from './dedicatedCloud-datacenter-zerto-drp-configuration.controller';
import template from './dedicatedCloud-datacenter-zerto-drp-configuration.html';

export default {
  bindings: {
    formattedState: '<',
    zertoState: '<',
    pccType: '<',
    serviceName: '<',
    datacenterId: '<',
    primaryDatacenter: '<?',
    secondaryDatacenter: '<?',
    serviceInfos: '<?',
    zertoMultiSites: '<?',
    currentUser: '<',
    openDeleteModal: '<',
    goToAddSite: '<',
    openDeleteSiteModal: '<',
  },
  controller,
  name: 'dedicatedCloudDatacenterZertoDrpConfiguration',
  template,
};
