import angular from 'angular';

import datacenterBackupSplaLicenseComponent from '../../../../components/dedicated-cloud/datacenter/backup/splaLicence';
import routing from './splaLicence.routing';

const moduleName = 'managedBaremetalDatacenterBackupSplaLicence';

angular
  .module(moduleName, [datacenterBackupSplaLicenseComponent])
  .config(routing);

export default moduleName;
