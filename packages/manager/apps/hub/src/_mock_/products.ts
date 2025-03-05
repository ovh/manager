import { ProductList, HubProduct } from '@/types/services.type';

export const aFewProductsMocked: ProductList = {
  count: 1,
  data: {
    CDN_DEDICATED: {
      count: 1,
      data: [
        {
          propertyId: 'service',
          resource: {
            displayName: 'displayName1',
            name: 'name1',
            product: {
              description: 'description1',
              name: 'infrastructure',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cdn/dedicated/{serviceName}',
          },
          serviceId: 111111111,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/cdn/displayName1',
        },
      ],
    },
  },
};

export const lotsOfProductsMocked: ProductList = {
  count: 32,
  data: {
    CDN_DEDICATED: {
      count: 3,
      data: [
        {
          propertyId: 'service',
          resource: {
            displayName: 'cdn_dedicated_1',
            name: 'cdn_dedicated_1',
            product: {
              description: 'CDN description 1',
              name: 'infrastructure',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cdn/dedicated/{serviceName}',
          },
          serviceId: 1111111,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_1',
        },
        {
          propertyId: 'service',
          resource: {
            displayName: 'cdn_dedicated_2',
            name: 'cdn_dedicated_2',
            product: {
              description: 'CDN description 2',
              name: 'infrastructure',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cdn/dedicated/{serviceName}',
          },
          serviceId: 2222222,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_2',
        },
        {
          propertyId: 'service',
          resource: {
            displayName: '',
            name: 'cdn_dedicated_3',
            product: {
              description: 'CDN description 3',
              name: 'infrastructure',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cdn/dedicated/{serviceName}',
          },
          serviceId: 3333333,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_3',
        },
      ],
    },
    CLOUD_PROJECT: {
      count: 8,
      data: [
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 1',
            name: 'fakeName1',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-1',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 11111111,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/fakeName1',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 2',
            name: 'pci-project-2',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-2',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 22222222,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-2',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 3',
            name: 'pci-project-3',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-3',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 33333333,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-3',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 4',
            name: 'pci-project-4',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-4',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 44444444,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-4',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 5',
            name: 'pci-project-5',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-5',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 55555555,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-5',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 6',
            name: 'pci-project-6',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-6',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 66666666,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-6',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 7',
            name: 'pci-project-7',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-7',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 77777777,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-7',
        },
        {
          propertyId: 'project_id',
          resource: {
            displayName: 'PCI Project 8',
            name: 'pci-project-8',
            product: {
              description: 'PCI Project description',
              name: 'pci-project-8',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/cloud/project/{serviceName}',
          },
          serviceId: 88888888,
          universe: {
            CA: 'public-cloud',
            EU: 'public-cloud',
            US: 'public-cloud',
          },
          url:
            'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-8',
        },
      ],
    },
    DBAAS_LOGS: {
      count: 5,
      data: [
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'LDP-1',
            name: 'ldp-1',
            product: {
              description: 'Logs - Account',
              name: 'logs-account',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dbaas/logs/{serviceName}',
          },
          serviceId: 1111111,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-1/home',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'LDP-2',
            name: 'ldp-2',
            product: {
              description: 'Logs - Account',
              name: 'logs-account',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dbaas/logs/{serviceName}',
          },
          serviceId: 2222222,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-2/home',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'LDP-3',
            name: 'ldp-3',
            product: {
              description: 'Logs - Account',
              name: 'logs-account',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dbaas/logs/{serviceName}',
          },
          serviceId: 3333333,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-3/home',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'LDP-4',
            name: 'ldp-4',
            product: {
              description: 'Logs - Account',
              name: 'logs-account',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dbaas/logs/{serviceName}',
          },
          serviceId: 4444444,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-4/home',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'LDP-5',
            name: 'ldp-5',
            product: {
              description: 'Logs - Account',
              name: 'logs-account',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dbaas/logs/{serviceName}',
          },
          serviceId: 5555555,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-5/home',
        },
      ],
    },
    DEDICATED_CLOUD: {
      count: 9,
      data: [
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-1',
            name: 'pcc-1',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 111,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-1',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-2',
            name: 'pcc-2',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 222,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-2',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-3',
            name: 'pcc-3',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 333,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-3',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-4',
            name: 'pcc-4',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 444,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-4',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-5',
            name: 'pcc-5',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 555,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-5',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-6',
            name: 'pcc-6',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 666,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-6',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-7',
            name: 'pcc-7',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 777,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-7',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-8',
            name: 'pcc-8',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 888,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-8',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'pcc-9',
            name: 'pcc-9',
            product: {
              description: 'Dedicated Cloud Hypervisor',
              name: 'pcc-hypervisor',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicatedCloud/{serviceName}',
          },
          serviceId: 999,
          serviceType: 'DEDICATED_CLOUD',
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-9',
        },
      ],
    },
    DEDICATED_HOUSING: {
      count: 1,
      data: [
        {
          propertyId: 'name',
          resource: {
            displayName: 'dedicated_housing_1',
            name: 'dedicated_housing_1',
            resellingProvider: null,
            state: 'toSuspend',
          },
          route: {
            path: '/dedicated/housing/{serviceName}',
          },
          serviceId: 1,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/housing/dedicated_housing_1',
        },
      ],
    },
    DEDICATED_NASHA: {
      count: 2,
      data: [
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'nasha_1',
            name: 'nasha_1',
            product: {
              description: 'NAS HA Description',
              name: 'nas-ha-name',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicated/nasha/{serviceName}',
          },
          serviceId: 11,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_1/partitions',
        },
        {
          propertyId: 'serviceName',
          resource: {
            displayName: 'nasha_2',
            name: 'nasha_2',
            product: {
              description: 'NAS HA Description',
              name: 'nas-ha-name',
            },
            resellingProvider: null,
            state: 'active',
          },
          route: {
            path: '/dedicated/nasha/{serviceName}',
          },
          serviceId: 22,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_2/partitions',
        },
      ],
    },
    DEDICATED_SERVER: {
      count: 4,
      data: [
        {
          propertyId: 'name',
          resource: {
            displayName: 'dedicated_server_1',
            name: 'dedicated_server_1',
            product: {
              description: 'Dedicated server description',
              name: 'Dedicated server name',
            },
            resellingProvider: 'ovh.ca',
            state: 'active',
          },
          route: {
            path: '/dedicated/server/{serviceName}',
          },
          serviceId: 11111,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_1',
        },
        {
          propertyId: 'name',
          resource: {
            displayName: 'dedicated_server_2',
            name: 'dedicated_server_2',
            product: {
              description: 'Dedicated server description',
              name: 'Dedicated server name',
            },
            resellingProvider: 'ovh.ca',
            state: 'active',
          },
          route: {
            path: '/dedicated/server/{serviceName}',
          },
          serviceId: 22222,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_2',
        },
        {
          propertyId: 'name',
          resource: {
            displayName: 'dedicated_server_3',
            name: 'dedicated_server_3',
            product: {
              description: 'Dedicated server description',
              name: 'Dedicated server name',
            },
            resellingProvider: 'ovh.ca',
            state: 'active',
          },
          route: {
            path: '/dedicated/server/{serviceName}',
          },
          serviceId: 33333,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_3',
        },
        {
          propertyId: 'name',
          resource: {
            displayName: 'dedicated_server_4',
            name: 'dedicated_server_4',
            product: {
              description: 'Dedicated server description',
              name: 'Dedicated server name',
            },
            resellingProvider: 'ovh.ca',
            state: 'active',
          },
          route: {
            path: '/dedicated/server/{serviceName}',
          },
          serviceId: 44444,
          universe: {
            CA: 'dedicated',
            EU: 'dedicated',
            US: 'dedicated',
          },
          url:
            'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_4',
        },
      ],
    },
  },
};

export const lotsOfProductsParsedMocked: HubProduct[] = [
  {
    count: 9,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-1',
          name: 'pcc-1',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 111,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-1',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-2',
          name: 'pcc-2',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 222,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-2',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-3',
          name: 'pcc-3',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 333,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-3',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-4',
          name: 'pcc-4',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 444,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-4',
      },
    ],
    type: 'DEDICATED_CLOUD',
    formattedType: 'dedicated-cloud',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 8,
    data: [
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 1',
          name: 'fakeName1',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-1',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 11111111,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/fakeName1',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 2',
          name: 'pci-project-2',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-2',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 22222222,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-2',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 3',
          name: 'pci-project-3',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-3',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 33333333,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-3',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 4',
          name: 'pci-project-4',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-4',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 44444444,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-4',
      },
    ],
    type: 'CLOUD_PROJECT',
    formattedType: 'cloud-project',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 5,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-1',
          name: 'ldp-1',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 1111111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-1/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-2',
          name: 'ldp-2',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 2222222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-2/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-3',
          name: 'ldp-3',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 3333333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-3/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-4',
          name: 'ldp-4',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 4444444,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-4/home',
      },
    ],
    type: 'DBAAS_LOGS',
    formattedType: 'dbaas-logs',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 4,
    data: [
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_1',
          name: 'dedicated_server_1',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 11111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_1',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_2',
          name: 'dedicated_server_2',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 22222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_2',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_3',
          name: 'dedicated_server_3',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 33333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_3',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_4',
          name: 'dedicated_server_4',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 44444,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_4',
      },
    ],
    type: 'DEDICATED_SERVER',
    formattedType: 'dedicated-server',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 3,
    data: [
      {
        propertyId: 'service',
        resource: {
          displayName: 'cdn_dedicated_1',
          name: 'cdn_dedicated_1',
          product: {
            description: 'CDN description 1',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 1111111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_1',
      },
      {
        propertyId: 'service',
        resource: {
          displayName: 'cdn_dedicated_2',
          name: 'cdn_dedicated_2',
          product: {
            description: 'CDN description 2',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 2222222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_2',
      },
      {
        propertyId: 'service',
        resource: {
          displayName: '',
          name: 'cdn_dedicated_3',
          product: {
            description: 'CDN description 3',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 3333333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_3',
      },
    ],
    type: 'CDN_DEDICATED',
    formattedType: 'cdn-dedicated',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 2,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'nasha_1',
          name: 'nasha_1',
          product: {
            description: 'NAS HA Description',
            name: 'nas-ha-name',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicated/nasha/{serviceName}',
        },
        serviceId: 11,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_1/partitions',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'nasha_2',
          name: 'nasha_2',
          product: {
            description: 'NAS HA Description',
            name: 'nas-ha-name',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicated/nasha/{serviceName}',
        },
        serviceId: 22,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_2/partitions',
      },
    ],
    type: 'DEDICATED_NASHA',
    formattedType: 'dedicated-nasha',
    link: Promise.resolve('https://fake-link.com'),
  },
];

export const lotsOfProductsParsedExpandedMocked: HubProduct[] = [
  {
    count: 9,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-1',
          name: 'pcc-1',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 111,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-1',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-2',
          name: 'pcc-2',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 222,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-2',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-3',
          name: 'pcc-3',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 333,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-3',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'pcc-4',
          name: 'pcc-4',
          product: {
            description: 'Dedicated Cloud Hypervisor',
            name: 'pcc-hypervisor',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicatedCloud/{serviceName}',
        },
        serviceId: 444,
        serviceType: 'DEDICATED_CLOUD',
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/dedicated_cloud/pcc-4',
      },
    ],
    type: 'DEDICATED_CLOUD',
    formattedType: 'dedicated-cloud',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 8,
    data: [
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 1',
          name: 'fakeName1',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-1',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 11111111,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/fakeName1',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 2',
          name: 'pci-project-2',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-2',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 22222222,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-2',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 3',
          name: 'pci-project-3',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-3',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 33333333,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-3',
      },
      {
        propertyId: 'project_id',
        resource: {
          displayName: 'PCI Project 4',
          name: 'pci-project-4',
          product: {
            description: 'PCI Project description',
            name: 'pci-project-4',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cloud/project/{serviceName}',
        },
        serviceId: 44444444,
        universe: {
          CA: 'public-cloud',
          EU: 'public-cloud',
          US: 'public-cloud',
        },
        url:
          'https://www.ovh.com/manager/#/public-cloud/pci/projects/pci-project-4',
      },
    ],
    type: 'CLOUD_PROJECT',
    formattedType: 'cloud-project',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 5,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-1',
          name: 'ldp-1',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 1111111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-1/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-2',
          name: 'ldp-2',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 2222222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-2/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-3',
          name: 'ldp-3',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 3333333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-3/home',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'LDP-4',
          name: 'ldp-4',
          product: {
            description: 'Logs - Account',
            name: 'logs-account',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dbaas/logs/{serviceName}',
        },
        serviceId: 4444444,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs/ldp-4/home',
      },
    ],
    type: 'DBAAS_LOGS',
    formattedType: 'dbaas-logs',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 4,
    data: [
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_1',
          name: 'dedicated_server_1',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 11111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_1',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_2',
          name: 'dedicated_server_2',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 22222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_2',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_3',
          name: 'dedicated_server_3',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 33333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_3',
      },
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_server_4',
          name: 'dedicated_server_4',
          product: {
            description: 'Dedicated server description',
            name: 'Dedicated server name',
          },
          resellingProvider: 'ovh.ca',
          state: 'active',
        },
        route: {
          path: '/dedicated/server/{serviceName}',
        },
        serviceId: 44444,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/server/dedicated_server_4',
      },
    ],
    type: 'DEDICATED_SERVER',
    formattedType: 'dedicated-server',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 3,
    data: [
      {
        propertyId: 'service',
        resource: {
          displayName: 'cdn_dedicated_1',
          name: 'cdn_dedicated_1',
          product: {
            description: 'CDN description 1',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 1111111,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_1',
      },
      {
        propertyId: 'service',
        resource: {
          displayName: 'cdn_dedicated_2',
          name: 'cdn_dedicated_2',
          product: {
            description: 'CDN description 2',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 2222222,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_2',
      },
      {
        propertyId: 'service',
        resource: {
          displayName: '',
          name: 'cdn_dedicated_3',
          product: {
            description: 'CDN description 3',
            name: 'infrastructure',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/cdn/dedicated/{serviceName}',
        },
        serviceId: 3333333,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/cdn/cdn_dedicated_3',
      },
    ],
    type: 'CDN_DEDICATED',
    formattedType: 'cdn-dedicated',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 2,
    data: [
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'nasha_1',
          name: 'nasha_1',
          product: {
            description: 'NAS HA Description',
            name: 'nas-ha-name',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicated/nasha/{serviceName}',
        },
        serviceId: 11,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_1/partitions',
      },
      {
        propertyId: 'serviceName',
        resource: {
          displayName: 'nasha_2',
          name: 'nasha_2',
          product: {
            description: 'NAS HA Description',
            name: 'nas-ha-name',
          },
          resellingProvider: null,
          state: 'active',
        },
        route: {
          path: '/dedicated/nasha/{serviceName}',
        },
        serviceId: 22,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/paas/nasha/nasha_2/partitions',
      },
    ],
    type: 'DEDICATED_NASHA',
    formattedType: 'dedicated-nasha',
    link: Promise.resolve('https://fake-link.com'),
  },
  {
    count: 1,
    data: [
      {
        propertyId: 'name',
        resource: {
          displayName: 'dedicated_housing_1',
          name: 'dedicated_housing_1',
          resellingProvider: null,
          state: 'toSuspend',
        },
        route: {
          path: '/dedicated/housing/{serviceName}',
        },
        serviceId: 1,
        universe: {
          CA: 'dedicated',
          EU: 'dedicated',
          US: 'dedicated',
        },
        url:
          'https://www.ovh.com/manager/#/dedicated/configuration/housing/dedicated_housing_1',
      },
    ],
    type: 'DEDICATED_HOUSING',
    formattedType: 'dedicated-housing',
    link: Promise.resolve('https://fake-link.com'),
  },
];
