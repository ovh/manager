angular
  .module('managerApp')
  .filter('infrastructureFlavor', () => (enumType, option) => {
    let out;

    if (option === 'icon') {
      switch (enumType) {
        case 'ovh_vps_ssd':
          out = 'ovh-font-cloudssd';
          break;
        case 'ovh_vps_hdd':
          out = 'ovh-font-cloudhdd';
          break;
        case 'ovh_vps_cloud':
          out = 'ovh-font-cloudcloud';
          break;
        case 'ovh_cpu':
          out = 'ovh-font-cloudcpu';
          break;
        case 'ovh_ceph_hg':
          out = 'ovh-font-cloudcpu';
          break;
        case 'ovh_ram':
          out = 'ovh-font-cloudram';
          break;
        case 'ovh_ssd_cpu':
          out = 'ovh-font-cloudcpu';
          break;
        case 'ovh_ssd_ram':
          out = 'ovh-font-cloudram';
          break;
        default:
          out = '';
      }
      return out;
    }

    return null;
  });
