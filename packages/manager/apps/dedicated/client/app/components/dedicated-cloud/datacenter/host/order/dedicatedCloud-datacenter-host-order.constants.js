export const GEN2_HOST_PROFILES = [
  // GP-1
  'pcc-host-vsphere-gp1-16x128',
  'pcc-host-premier-gp1-16x128',
  'pcc-host-sddc2016-gp1-16x128',
  'pcc-host-sddc2018-gp1-16x128',
  'pcc-host-essentials-gp1-16x128',
  'pcc-host-nsx-gp1-16x128',
  // GP-2
  'pcc-host-vsphere-gp2-16x256',
  'pcc-host-premier-gp2-16x256',
  'pcc-host-sddc2016-gp2-16x256',
  'pcc-host-sddc2018-gp2-16x256',
  'pcc-host-essentials-gp2-16x256',
  'pcc-host-nsx-gp2-16x256',
  // GP-3
  'pcc-host-vsphere-gp3-24x512',
  'pcc-host-premier-gp3-24x512',
  'pcc-host-sddc2016-gp3-24x512',
  'pcc-host-sddc2018-gp3-24x512',
  'pcc-host-essentials-gp3-24x512',
  'pcc-host-nsx-gp3-24x512',
  // GP-4
  'pcc-host-vsphere-gp4-36x1024',
  'pcc-host-premier-gp4-36x1024',
  'pcc-host-sddc2016-gp4-36x1024',
  'pcc-host-sddc2018-gp4-36x1024',
  'pcc-host-essentials-gp4-36x1024',
  'pcc-host-nsx-gp4-36x1024',
  // GP-5
  'pcc-host-vsphere-gp5-48x1536',
  'pcc-host-premier-gp5-48x1536',
  'pcc-host-sddc2016-gp5-48x1536',
  'pcc-host-sddc2018-gp5-48x1536',
  'pcc-host-essentials-gp5-48x1536',
  'pcc-host-nsx-gp5-48x1536',
  // STO-1
  'pcc-host-vsphere-sto1-24x256',
  'pcc-host-premier-sto1-24x256',
  'pcc-host-sddc2016-sto1-24x256',
  'pcc-host-sddc2018-sto1-24x256',
  'pcc-host-nsx-sto1-24x256',
  // STO-2
  'pcc-host-vsphere-sto2-36x512',
  'pcc-host-premier-sto2-36x512',
  'pcc-host-sddc2016-sto2-36x512',
  'pcc-host-sddc2018-sto2-36x512',
  'pcc-host-nsx-sto2-36x512',
  // STO-3
  'pcc-host-vsphere-sto3-48x1024',
  'pcc-host-premier-sto3-48x1024',
  'pcc-host-sddc2016-sto3-48x1024',
  'pcc-host-sddc2018-sto3-48x1024',
  'pcc-host-nsx-sto3-48x1024',
  // STO-4
  'pcc-host-vsphere-sto4-72x1536',
  'pcc-host-premier-sto4-72x1536',
  'pcc-host-sddc2016-sto4-72x1536',
  'pcc-host-sddc2018-sto4-72x1536',
  'pcc-host-nsx-sto4-72x1536',
];

export const GEN2_HOST_BADGE_LABEL = 'new';

const GEN2_HOST_PROFILES_SET = new Set(GEN2_HOST_PROFILES);

export const isGen2Host = (name) => GEN2_HOST_PROFILES_SET.has(name);

export default {
  GEN2_HOST_PROFILES,
  GEN2_HOST_BADGE_LABEL,
  isGen2Host,
};
