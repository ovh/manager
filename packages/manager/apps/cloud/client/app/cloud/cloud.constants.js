angular
  .module('managerApp')
  .constant('CLOUD_INSTANCE_DEFAULTS', {
    region: 'WAW1',
    image: 'Ubuntu 16.04',
    flavor: 'b2-30',
  })
  .constant('CLOUD_INSTANCE_DEFAULT_FALLBACK', {
    region: 'WAW1',
    image: 'Ubuntu 16.04',
    flavor: 's1-2',
  })
  .constant('CLOUD_FLAVORTYPE_CATEGORY', [
    {
      id: 'balanced',
      types: ['ovh.ceph.eg', 'ovh.ssd.eg'],
      migrationNotAllowed: ['vps'],
      order: 1,
    },
    {
      id: 'cpu',
      types: ['ovh.cpu', 'ovh.ssd.cpu', 'ovh.ceph.hg'],
      migrationNotAllowed: ['vps'],
      order: 2,
    },
    {
      id: 'ram',
      types: ['ovh.ram', 'ovh.ssd.ram'],
      migrationNotAllowed: ['vps'],
      order: 3,
    },
    {
      id: 'accelerated',
      types: [
        'ovh.ssd.gpu',
        'ovh.ssd.gpu2',
        'ovh.ssd.gpu3',
        'ovh.ssd.fpga2',
        'ovh.raid-nvme.t1',
      ],
      migrationNotAllowed: ['vps'],
      order: 4,
    },
    {
      id: 'vps',
      types: ['ovh.vps-ssd'],
      migrationNotAllowed: [],
      order: 5,
    },
  ])
  .constant('CLOUD_FLAVOR_SPECIFIC_IMAGE', ['g1', 'g2', 'g3', 't1'])
  .constant('CLOUD_INSTANCE_CPU_FREQUENCY', {
    'ovh.vps-ssd': 2.4,
    'ovh.cpu': 3.1,
    'ovh.ram': 2.4,
    'ovh.ceph.eg': 2.3,
    'ovh.ssd.ram': 2.4,
    'ovh.ssd.cpu': 3.1,
    'ovh.ssd.eg': 2.3,
    'ovh.ssd.gpu': 3.1,
    'ovh.ssd.gpu2': 3.1,
    'ovh.ssd.gpu3': 3.1,
    'ovh.raid-nvme.t1': 2.1,
  })
  .constant('CLOUD_INSTANCE_NUMBER_OF_GPUS', {
    default: 1,
    120: 3,
    45: 1,
    90: 2,
  })
  .constant('CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES', [
    'balanced',
    'ram',
    'cpu',
    'accelerated',
  ])
  .constant('CLOUD_VOLUME_TYPES', ['classic', 'high-speed'])
  .constant('CLOUD_IPFO_ORDER_LIMIT', {
    'ovh.vps-ssd': 16,
    'ovh.cpu': 256,
    'ovh.ram': 256,
    'ovh.ssd.cpu': 256,
    'ovh.ssd.ram': 256,
    'ovh.ssd.eg': 256,
    'ovh.ceph.eg': 256,
    'ovh.ssd.gpu': 256,
    'ovh.ssd.gpu2': 256,
    'ovh.ssd.gpu3': 256,
  })
  .constant('CLOUD_GEOLOCALISATION', {
    instance: {
      EU: [
        'SBG1',
        'GRA1',
        'GRA3',
        'GRA5',
        'SBG3',
        'SBG5',
        'WAW1',
        'DE1',
        'UK1',
      ],
      CA: ['BHS1', 'BHS3'],
      APAC: ['SYD1', 'SGP1'],
    },
    user: {
      EU: [
        'CZ',
        'DE',
        'ES',
        'EU',
        'FI',
        'FR',
        'GB',
        'IE',
        'IT',
        'LT',
        'MA',
        'NL',
        'PL',
        'PT',
        'SN',
        'TN',
      ],
      CA: ['ASIA', 'AU', 'CA', 'QC', 'SG', 'WE', 'WS'],
    },
    ipfo: {
      EU: [
        'BE',
        'CZ',
        'DE',
        'ES',
        'FI',
        'FR',
        'IE',
        'IT',
        'LT',
        'NL',
        'PL',
        'PT',
        'UK',
      ],
      CA: ['CA', 'US'],
    },
  })
  .constant('CLOUD_VM_STATE', {
    pending: [
      'BUILD',
      'BUILDING',
      'REBUILD',
      'DELETING',
      'RESIZE',
      'VERIFY_RESIZE',
      'REVERT_RESIZE',
      'MIGRATING',
      'REBOOT',
      'HARD_REBOOT',
      'RESCUING',
      'UNRESCUING',
      'SNAPSHOTTING',
      'RESUMING',
    ],
    openstack: ['PAUSED', 'STOPPED', 'SUSPENDED', 'SHUTOFF', 'RESCUE'],
    error: ['ERROR'],
  })
  .constant('CLOUD_UNIT_CONVERSION', {
    KILOBYTE_TO_BYTE: 1000,
    MEGABYTE_TO_BYTE: 1000000,
    GIGABYTE_TO_BYTE: 1000000000,
    GIBIBYTE_TO_BYTE: 1073741824,
  })
  .constant('CLOUD_MONITORING', {
    alertingEnabled: false,
    vm: {
      upgradeAlertThreshold: 90,
      period: 'lastweek',
      type: ['mem:used', 'mem:max', 'cpu:used', 'cpu:max', 'net:tx', 'net:rx'],
    },
  })
  .constant('CLOUD_PROJECT_OVERVIEW_THRESHOLD', {
    instances: 15,
    ips: 32,
  })
  .constant('CLOUD_PROJECT_STATE', {
    deleting: 'deleting',
    deleted: 'deleted',
    ok: 'ok',
    suspended: 'suspended',
  })
  .constant('CLOUD_PCA_FILE_STATE', {
    SEALED: 'sealed',
    UNSEALING: 'unsealing',
    UNSEALED: 'unsealed',
    USERNAME: 'pca',
  })
  .constant('TRACKING_CLOUD', {
    pci_menu_header_instances: 'cloud::pci::menu::instances',
    pci_menu_header_ssh_keys: 'cloud::pci::menu::ssh_keys',
    pci_menu_header_snapshots: 'cloud::pci::menu::snapshots',
    pci_menu_header_volume: 'cloud::pci::menu::additional_drives',
    pci_menu_header_storage: 'cloud::pci::menu::storage',
    pci_menu_header_openstack_users: 'cloud::pci::menu::openstack_users',
    pci_menu_header_quota: 'cloud::pci::menu::quota',
    pci_menu_header_regions: 'cloud::pci::menu::add_localisations',
    pci_menu_header_consumption: 'cloud::pci::menu::consumption',
    pci_menu_header_billing_history: 'cloud::pci::menu::billing_history',
    pci_menu_header_credits: 'cloud::pci::menu::credits_and_vouchers',
    pci_menu_header_contracts: 'cloud::pci::menu::contracts',
  });
