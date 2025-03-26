export const DEPLOYMENT_MODES_TYPES = ['region', 'region-3-az', 'localzone'];

export const getDeploymentBetaKey = (name) =>
  `public-cloud:deployment-beta-${name}`;
export const getDeploymentComingSoonKey = (name) =>
  `public-cloud:deployment-coming-soon-${name}`;

export const DEPLOYMENT_FEATURES = DEPLOYMENT_MODES_TYPES.flatMap((d) => [
  getDeploymentBetaKey(d),
  getDeploymentComingSoonKey(d),
]);

export const DEPLOYMENT_MODE_CHIP_CLASS = {
  region: 'oui-oui-badge_new oui-1az',
  'region-3-az': 'oui-badge_new my-1 oui-3az',
  localzone: 'oui-badge_promotion oui-localzone',
};

export const DEPLOYMENT_MODE_CHIP_LABEL = {
  region: 'pci_project_flavors_zone_global_region',
  'region-3-az': 'pci_project_flavors_zone_3az_region',
  localzone: 'pci_project_flavors_zone_localzone',
};
