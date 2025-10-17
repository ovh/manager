import { Configuration } from "@/types/configuration";
import { Region } from "@ovh-ux/manager-config";

export const ConfigurationMock: Configuration = {
  'applications': {
      'account': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'account',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/account',
          'url': 'https://www.ovh.com/manager/account',
          'universe': 'dedicated'
      },
      'billing': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'billing',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/billing',
          'url': 'https://www.ovh.com/manager/billing',
          'universe': 'dedicated'
      },
      'carbon-calculator': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'carbon-calculator',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/carbon-calculator',
          'url': 'https://www.ovh.com/manager/carbon-calculator/',
          'universe': 'server'
      },
      'catalog': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'catalog',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/catalog',
          'url': 'https://www.ovh.com/manager/catalog',
          'universe': 'hub'
      },
      'cloud': {
          'container': {
            'enabled': true,
            'isDefault': false,
            'path': 'cloud',
            containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/cloud/repsac/',
          'url': 'https://www.ovh.com/manager/cloud/repsac/',
          'universe': 'server'
      },
      'cloud-shell': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'cloud-shell',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/cloud-shell',
          'url': 'https://www.ovh.com/manager/cloud-shell/',
          'universe': 'hub',
      },
      'communication': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'communication',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/communication',
          'url': 'https://www.ovh.com/manager/communication/',
          'universe': 'hub'
      },
      'dedicated': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'dedicated',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/dedicated',
          'url': 'https://www.ovh.com/manager/dedicated/',
          'universe': 'server'
      },
      'dedicated-servers': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'dedicated-servers',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/dedicated-servers',
          'url': 'https://www.ovh.com/manager/dedicated-servers/',
          'universe': 'server'
      },
      'exchange': {
          'container': {
            'enabled': true,
            'isDefault': false,
            'path': 'exchange',
            containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/web/',
          'url': 'https://www.ovh.com/manager/web/',
          'universe': 'web'
      },
      'freefax': {
          'container': {
            'enabled': true,
            'isDefault': false,
            'path': 'freefax',
            containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/telecom/',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'hpc-vmware-managed-vcd': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'hpc-vmware-managed-vcd',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/hpc-vmware-managed-vcd',
          'url': 'https://www.ovh.com/manager/hpc-vmware-managed-vcd/',
          'universe': 'hpc'
      },
      'hpc-vmware-public-vcf-aas': {
          'container': {
              'enabled': true,
              'hash': '/public-vcf-aas',
              'isDefault': false,
              'path': 'vmware',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/vmware/public-vcf-aas',
          'url': 'https://www.ovh.com/manager/hpc-vmware-public-vcf-aas/',
          'universe': 'hpc'
      },
      'hpc-vmware-vsphere': {
          'container': {
              'enabled': true,
              'hash': '/vsphere',
              'isDefault': false,
              'path': 'vmware',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/vmware/vsphere',
          'url': 'https://www.ovh.com/manager/hpc-vmware-vsphere/',
          'universe': 'hpc'
      },
      'hub': {
          'container': {
              'enabled': true,
              'hash': '/',
              'isDefault': true,
              'path': 'hub',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/hub',
          'url': 'https://www.ovh.com/manager/hub/',
          'universe': 'hub'
      },
      'hycu': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'hycu',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/hycu',
          'url': 'https://www.ovh.com/manager/hycu/',
          'universe': 'hpc'
      },
      'iam': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'iam',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/iam',
          'url': 'https://www.ovh.com/manager/iam',
          'universe': 'server'
      },
      'identity-access-management': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'identity-access-management',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/identity-access-management',
          'url': 'https://www.ovh.com/manager/identity-access-management/',
          'universe': 'server'
      },
      'okms': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'okms',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/okms',
          'url': 'https://www.ovh.com/manager/okms/',
          'universe': 'server'
      },
      'overthebox': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'overthebox',
              containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/telecom/',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'pack-xdsl': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'pack-xdsl',
              containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/telecom/',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'pci-ai-endpoints': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/ai/endpoints',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-ai-endpoints/',
          'universe': 'public-cloud'
      },
      'pci-ai-tools': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/ai-ml',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-ai-tools/',
          'universe': 'public-cloud'
      },
      'pci-billing': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/billing',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-billing/',
          'universe': 'public-cloud'
      },
      'pci-block-storage': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/storages/blocks',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-block-storage/',
          'universe': 'public-cloud'
      },
      'pci-cold-archive': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/storages/cold-archive',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-cold-archive/',
          'universe': 'public-cloud'
      },
      'pci-databases-analytics': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/databases-analytics',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-databases-analytics/',
          'universe': 'public-cloud'
      },
      'pci-dataplatform': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/dataplatform',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-dataplatform/',
          'universe': 'public-cloud'
      },
      'pci-gateway': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/gateway',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-gateway/',
          'universe': 'public-cloud'
      },
      'pci-instances': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/instances',
              'hashes': [
                  '/pci/projects/:projectId/instances',
                  '/pci/projects/:projectId/instances/onboarding',
                  '/pci/projects/:projectId/instances/region/*',
                  '/pci/projects/:projectId/instances/delete',
                  '/pci/projects/:projectId/instances/:instanceId/delete',
                  '/pci/projects/:projectId/instances/start',
                  '/pci/projects/:projectId/instances/:instanceId/start',
                  '/pci/projects/:projectId/instances/stop',
                  '/pci/projects/:projectId/instances/:instanceId/stop',
                  '/pci/projects/:projectId/instances/shelve',
                  '/pci/projects/:projectId/instances/:instanceId/shelve',
                  '/pci/projects/:projectId/instances/unshelve',
                  '/pci/projects/:projectId/instances/:instanceId/unshelve',
                  '/pci/projects/:projectId/instances/hard-reboot',
                  '/pci/projects/:projectId/instances/:instanceId/hard-reboot',
                  '/pci/projects/:projectId/instances/soft-reboot',
                  '/pci/projects/:projectId/instances/:instanceId/soft-reboot',
                  '/pci/projects/:projectId/instances/rescue/*',
                  '/pci/projects/:projectId/instances/:instanceId/rescue/*',
                  '/pci/projects/:projectId/instances/backup',
                  '/pci/projects/:projectId/instances/:instanceId/backup',
                  '/pci/projects/:projectId/instances/reinstall',
                  '/pci/projects/:projectId/instances/:instanceId/reinstall',
                  '/pci/projects/:projectId/instances/billing/*',
                  '/pci/projects/:projectId/instances/:instanceId/billing/*',
                  '/pci/projects/:projectId/instances/:instanceId/network/private/attach',
                  '/pci/projects/:projectId/instances/:instanceId/attach'
              ],
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-instances/',
          'universe': 'public-cloud'
      },
      'pci-kubernetes': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/kubernetes',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-kubernetes/',
          'universe': 'public-cloud'
      },
      'pci-load-balancer': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/octavia-load-balancer',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-load-balancer/',
          'universe': 'public-cloud'
      },
      'pci-object-storage': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/storages/objects',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-object-storage/',
          'universe': 'public-cloud'
      },
      'pci-private-network': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/private-networks',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-private-network/',
          'universe': 'public-cloud'
      },
      'pci-private-registry': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/private-registry',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-private-registry/',
          'universe': 'public-cloud'
      },
      'pci-public-ip': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/public-ips',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-public-ip/',
          'universe': 'public-cloud'
      },
      'pci-quantum-emulators': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/quantum/emulators',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-quantum-emulators/',
          'universe': 'public-cloud'
      },
      'pci-quota': {
          'container': {
              'enabled': true,
              'hashes': [
                  '/pci/projects/:projectId/quota/*',
                  '/pci/projects/:projectId/regions/*'
              ],
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-quota/',
          'universe': 'public-cloud'
      },
      'pci-rancher': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/rancher',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-rancher/',
          'universe': 'public-cloud'
      },
      'pci-savings-plan': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/savings-plan',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-savings-plan/',
          'universe': 'public-cloud'
      },
      'pci-ssh-keys': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/ssh',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-ssh-keys/',
          'universe': 'public-cloud'
      },
      'pci-users': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/users',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-users/',
          'universe': 'public-cloud'
      },
      'pci-volume-backup': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/storages/volume-backup',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-volume-backup/',
          'universe': 'public-cloud'
      },
      'pci-volume-snapshot': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/storages/volume-snapshots',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-volume-snapshot/',
          'universe': 'public-cloud'
      },
      'pci-vouchers': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/vouchers',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-vouchers/',
          'universe': 'public-cloud'
      },
      'pci-workflow': {
          'container': {
              'enabled': true,
              'hash': '/pci/projects/:projectId/workflow',
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/pci-workflow/',
          'universe': 'public-cloud'
      },
      'public-cloud': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'public-cloud',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/public-cloud',
          'url': 'https://www.ovh.com/manager/public-cloud/',
          'universe': 'public-cloud'
      },
      'restricted': {
          'container': {
            'enabled': false,
            'isDefault': false,
            'path': 'restricted',
            containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/restricted/',
          'url': 'https://www.ovh.com/manager/restricted/',
          'universe': 'server'
      },
      'sap-features-hub': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'sap-features-hub',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/sap-features-hub',
          'url': 'https://www.ovh.com/manager/sap-features-hub/',
          'universe': 'hpc'
      },
      'sign-up': {
          'container': {
              'enabled': false,
              'isDefault': false,
              'path': 'signup',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/signup/',
          'url': 'https://www.ovh.com/manager/signup/',
          'universe': 'hub'
      },
      'sms': {
          'container': {
            'enabled': true,
            'isDefault': false,
            'path': 'sms',
            containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/telecom/',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'sunrise': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'sunrise',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/sunrise/',
          'url': 'https://www.ovh.com/manager/sunrise/',
          universe: 'sunrise',
      },
      'telecom': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'telecom',
              containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/#/telecom',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'telephony': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'telephony',
              containerURL: '',
          },
          'publicURL': 'https://www.ovhtelecom.fr/manager/telecom/',
          'url': 'https://www.ovhtelecom.fr/manager/telecom/',
          'universe': 'telecom'
      },
      'user': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'user',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/dedicated/',
          'url': 'https://www.ovh.com/manager/dedicated/',
          'universe': 'server'
      },
      'veeam-backup': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'veeam-backup',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/veeam-backup',
          'url': 'https://www.ovh.com/manager/veeam-backup/',
          'universe': 'hpc'
      },
      'vrack-services': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'vrack-services',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/vrack-services',
          'url': 'https://www.ovh.com/manager/vrack-services/',
          'universe': 'server'
      },
      'web': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'web',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/web',
          'url': 'https://www.ovh.com/manager/web/',
          'universe': 'web'
      },
      'web-domains': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'web-domains',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/web-domains',
          'url': 'https://www.ovh.com/manager/web-domains/',
          'universe': 'web'
      },
      'web-hosting': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'web-hosting',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/web-hosting',
          'url': 'https://www.ovh.com/manager/web-hosting/',
          'universe': 'web'
      },
      'web-office': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'web-office',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/web-office',
          'url': 'https://www.ovh.com/manager/web-office/',
          'universe': 'web'
      },
      'web-ongoing-operations': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'web-ongoing-operations',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/web-ongoing-operations',
          'url': 'https://www.ovh.com/manager/web-ongoing-operations/',
          'universe': 'web'
      },
      'zimbra': {
          'container': {
              'enabled': true,
              'isDefault': false,
              'path': 'zimbra',
              containerURL: '',
          },
          'publicURL': 'https://www.ovh.com/manager/#/zimbra',
          'url': 'https://www.ovh.com/manager/zimbra/',
          'universe': 'web'
      }
  },
  'message': null,
  'region': Region.EU,
  'universe': '',
  'user': {
      'address': 'Villeneuve Test',
      'area': 'IN-WB',
      'birthCity': 'Lille',
      'birthDay': '1950-05-10',
      'city': 'Roubaix Test',
      'companyNationalIdentificationNumber': null,
      'complementaryAddress': null,
      'corporationType': 'Société à responsabilité limitée (SARL)',
      'country': 'FR',
      'currency': {
          'code': 'EUR',
          'symbol': '€',
          'format': '€',
      },
      'customerCode': '3040-1483-74',
      'email': 'squad.qa+ls@interne.ovh.net',
      'fax': null,
      'firstname': 'F_QA',
      'italianSDI': '0000000',
      'kycValidated': true,
      'language': 'fr_FR',
      'legalform': 'corporation',
      'name': 'N_QA',
      'nationalIdentificationNumber': null,
      'nichandle': 'ls148374-ovh',
      'organisation': 'OVH',
      'ovhCompany': 'ovh',
      'ovhSubsidiary': 'FR',
      'phone': '+33.327000000',
      'phoneCountry': 'FR',
      'phoneType': 'mobile',
      'purposeOfPurchase': null,
      'sex': 'male',
      'spareEmail': 'squad.qa+lsqa@interne.ovh.net',
      'state': 'complete',
      'vat': null,
      'zip': '98609',
      'auth': {
          'account': 'ls148374-ovh',
          'allowedRoutes': null,
          'description': 'Jacques Larique',
          'identities': [
              'urn:v1:eu:identity:user:ls148374-ovh/provider/jacques.larique.ext@corp.ovh.com',
              'urn:v1:eu:identity:group:ls148374-ovh/Domain Users',
              'urn:v1:eu:identity:group:ls148374-ovh/login-manager-ls148374-rw-fr'
          ],
          'method': 'provider',
          'roles': [
              'REGULAR'
          ],
          'user': 'jacques.larique.ext@corp.ovh.com'
      },
      'certificates': [
          'domains-batch-autorenew',
          'internal-payment-nic',
          'consent-marketing-email'
      ],
      'enterprise': false,
      'isTrusted': false,
      'supportLevel': {
          'level': 'standard'
      }
  },
  'applicationURLs': {
      'account': 'https://www.ovh.com/manager/account',
      'billing': 'https://www.ovh.com/manager/billing',
      'carbon-calculator': 'https://www.ovh.com/manager/carbon-calculator/',
      'catalog': 'https://www.ovh.com/manager/catalog',
      'cloud': 'https://www.ovh.com/manager/cloud/repsac/',
      'cloud-shell': 'https://www.ovh.com/manager/cloud-shell/',
      'communication': 'https://www.ovh.com/manager/communication/',
      'dedicated': 'https://www.ovh.com/manager/dedicated/',
      'dedicated-servers': 'https://www.ovh.com/manager/dedicated-servers/',
      'exchange': 'https://www.ovh.com/manager/web/',
      'freefax': 'https://www.ovhtelecom.fr/manager/telecom/',
      'hpc-vmware-managed-vcd': 'https://www.ovh.com/manager/hpc-vmware-managed-vcd/',
      'hpc-vmware-public-vcf-aas': 'https://www.ovh.com/manager/hpc-vmware-public-vcf-aas/',
      'hpc-vmware-vsphere': 'https://www.ovh.com/manager/hpc-vmware-vsphere/',
      'hub': 'https://www.ovh.com/manager/hub/',
      'hycu': 'https://www.ovh.com/manager/hycu/',
      'iam': 'https://www.ovh.com/manager/iam',
      'identity-access-management': 'https://www.ovh.com/manager/identity-access-management/',
      'okms': 'https://www.ovh.com/manager/okms/',
      'overthebox': 'https://www.ovhtelecom.fr/manager/telecom/',
      'pack-xdsl': 'https://www.ovhtelecom.fr/manager/telecom/',
      'pci-ai-endpoints': 'https://www.ovh.com/manager/pci-ai-endpoints/',
      'pci-ai-tools': 'https://www.ovh.com/manager/pci-ai-tools/',
      'pci-billing': 'https://www.ovh.com/manager/pci-billing/',
      'pci-block-storage': 'https://www.ovh.com/manager/pci-block-storage/',
      'pci-cold-archive': 'https://www.ovh.com/manager/pci-cold-archive/',
      'pci-databases-analytics': 'https://www.ovh.com/manager/pci-databases-analytics/',
      'pci-dataplatform': 'https://www.ovh.com/manager/pci-dataplatform/',
      'pci-gateway': 'https://www.ovh.com/manager/pci-gateway/',
      'pci-instances': 'https://www.ovh.com/manager/pci-instances/',
      'pci-kubernetes': 'https://www.ovh.com/manager/pci-kubernetes/',
      'pci-load-balancer': 'https://www.ovh.com/manager/pci-load-balancer/',
      'pci-object-storage': 'https://www.ovh.com/manager/pci-object-storage/',
      'pci-private-network': 'https://www.ovh.com/manager/pci-private-network/',
      'pci-private-registry': 'https://www.ovh.com/manager/pci-private-registry/',
      'pci-public-ip': 'https://www.ovh.com/manager/pci-public-ip/',
      'pci-quantum-emulators': 'https://www.ovh.com/manager/pci-quantum-emulators/',
      'pci-quota': 'https://www.ovh.com/manager/pci-quota/',
      'pci-rancher': 'https://www.ovh.com/manager/pci-rancher/',
      'pci-savings-plan': 'https://www.ovh.com/manager/pci-savings-plan/',
      'pci-ssh-keys': 'https://www.ovh.com/manager/pci-ssh-keys/',
      'pci-users': 'https://www.ovh.com/manager/pci-users/',
      'pci-volume-backup': 'https://www.ovh.com/manager/pci-volume-backup/',
      'pci-volume-snapshot': 'https://www.ovh.com/manager/pci-volume-snapshot/',
      'pci-vouchers': 'https://www.ovh.com/manager/pci-vouchers/',
      'pci-workflow': 'https://www.ovh.com/manager/pci-workflow/',
      'public-cloud': 'https://www.ovh.com/manager/public-cloud/',
      'restricted': 'https://www.ovh.com/manager/restricted/',
      'sap-features-hub': 'https://www.ovh.com/manager/sap-features-hub/',
      'sign-up': 'https://www.ovh.com/manager/signup/',
      'sms': 'https://www.ovhtelecom.fr/manager/telecom/',
      'sunrise': 'https://www.ovh.com/manager/sunrise/',
      'telecom': 'https://www.ovhtelecom.fr/manager/telecom/',
      'telephony': 'https://www.ovhtelecom.fr/manager/telecom/',
      'user': 'https://www.ovh.com/manager/dedicated/',
      'veeam-backup': 'https://www.ovh.com/manager/veeam-backup/',
      'vrack-services': 'https://www.ovh.com/manager/vrack-services/',
      'web': 'https://www.ovh.com/manager/web/',
      'web-domains': 'https://www.ovh.com/manager/web-domains/',
      'web-hosting': 'https://www.ovh.com/manager/web-hosting/',
      'web-office': 'https://www.ovh.com/manager/web-office/',
      'web-ongoing-operations': 'https://www.ovh.com/manager/web-ongoing-operations/',
      'zimbra': 'https://www.ovh.com/manager/zimbra/'
  }
}