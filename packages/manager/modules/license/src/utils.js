import cloudLinuxIcon from './images/license/CLOUDLINUX_medium.png';
import cpanelIcon from './images/license/CPANEL_medium.png';
import directAdminIcon from './images/license/DIRECTADMIN_medium.png';
import pleskIcon from './images/license/PLESK_medium.png';
import splaIcon from './images/license/SPLA_medium.png';
import sqlServerIcon from './images/license/SQLSERVER_medium.png';
import virtuozoIcon from './images/license/VIRTUOZZO_medium.png';
import windowsIcon from './images/license/WINDOWS_medium.png';
import worklightIcon from './images/license/WORKLIGHT_medium.png';

const getLicenseTypeIcon = (licenseType) => {
  switch (licenseType) {
    case 'CLOUDLINUX':
      return cloudLinuxIcon;
    case 'CPANEL':
      return cpanelIcon;
    case 'DIRECTADMIN':
      return directAdminIcon;
    case 'PLESK':
      return pleskIcon;
    case 'SPLA':
      return splaIcon;
    case 'SQLSERVER':
      return sqlServerIcon;
    case 'VIRTUOZZO':
      return virtuozoIcon;
    case 'WINDOWS':
      return windowsIcon;
    case 'WORKLIGHT':
      return worklightIcon;
    default:
      return '';
  }
};

export default getLicenseTypeIcon;
