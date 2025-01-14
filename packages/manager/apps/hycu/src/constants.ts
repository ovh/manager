export const packTypeLabel = {
  'hycu-cloud-vm-pack-25': '25 VMs',
  'hycu-cloud-vm-pack-50': '50 VMs',
  'hycu-cloud-vm-pack-100': '100 VMs',
  'hycu-cloud-vm-pack-150': '150 VMs',
  'hycu-cloud-vm-pack-200': '200 VMs',
  'hycu-cloud-vm-pack-250': '250 VMs',
  'hycu-cloud-vm-pack-500': '500 VMs',
} as const;

// CHANGELOG
export const CHANGELOG_PREFIXES = ['tile-changelog-roadmap', 'external-link'];
export const CHANGELOG_DESTINATION = {
  CHANGELOG: 'changelog',
  ROADMAP: 'roadmap',
  FEATURE_REQUEST: 'feature-request',
};

export const GO_TO = (link: string) => `go-to-${link}`;
