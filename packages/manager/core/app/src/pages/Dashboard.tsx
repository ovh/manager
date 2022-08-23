import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link, SimpleGrid } from '@chakra-ui/react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from '@ovh-ux/manager-themes';
import { startCase } from 'lodash-es';
import { useShell } from '@/core';

import Nutanix, {
  getNutanix,
  getServer,
  getServiceInfos,
  getTechnicalDetails,
  getServerNetworkSpecifications,
  getServerOption,
} from '@/api/nutanix';
import Service, {
  getServiceDetails,
  getHardwareInfo,
  getServiceOptions,
  getServiceUpgrade,
  TechnicalDetails,
  NutanixClusterDetails,
  NutanixClusterLicenseFeatureDetails,
  GenericProductDefinition,
} from '@/api/service';
import DedicatedServer, {
  DedicatedServerOption,
  DedicatedServerOptionEnum,
  DedicatedServerOptionStateEnum,
  NetworkSpecifications,
} from '@/api/dedicatedServer';
import SupportLevel, {
  getSupportLevel,
  getSupportTicketIdsByServiceName,
} from '@/api/support';
import Vrack, { getVrack } from '@/api/vrack';
import IpLoadBalancing, { getIpLoadBalancing } from '@/api/ipLoadbalancing';
import Dashboard, { TileTypesEnum } from '@/components/Dashboard';

export default function DashboardPage(): JSX.Element {
  const { t } = useTranslation('dashboard');
  const { serviceId } = useParams();
  const shell = useShell();

  const SUPPORT_LEVELS = {
    standard: 'Standard',
    premium: 'Premium',
    'premium-accredited': 'Premium Advanced',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const trackingPrefix = 'hpc::nutanix::cluster::dashboard';

  const tiles = [
    {
      name: 'general',
      heading: t('tile_general_title'),
      type: TileTypesEnum.LIST,
      onLoad: async () => {
        const cluster = await getNutanix(serviceId);
        const serviceInfos = await getServiceInfos(serviceId);
        const [serviceDetails, server] = await Promise.all([
          getServiceDetails(serviceInfos.serviceId),
          getServer(cluster),
        ]);
        const technicalDetails = await getTechnicalDetails(
          serviceInfos.serviceId,
          server.serviceId,
        );

        return { cluster, serviceDetails, server, technicalDetails };
      },
      definitions: [
        {
          name: 'name',
          title: t('tile_general_item_name'),
          description: ({ cluster }: { cluster: Nutanix }) => {
            return cluster.serviceName;
          },
          actions: [
            {
              name: 'edit',
              label: t('tile_general_item_name_edit'),
              title: t('tile_general_item_name_edit'),
              to: '',
            },
          ],
        },
        {
          name: 'commercial_range',
          title: t('tile_general_item_commercial_range'),
          description: ({ serviceDetails }: { serviceDetails: Service }) =>
            serviceDetails.billing.plan.invoiceName,
        },
        {
          name: 'cluster_redeploy',
          title: t('tile_general_item_cluster_redeploy'),
          description: () => (
            <Link as={RouterLink} to="">
              {t('tile_general_item_cluster_redeploy_link')} <ArrowRightIcon />
            </Link>
          ),
        },
        {
          name: 'admin_interface',
          title: t('tile_general_item_admin_interface'),
          description: ({ cluster }: { cluster: Nutanix }) => (
            <Link href={cluster.targetSpec.controlPanelURL} isExternal>
              {t('tile_general_item_admin_interface_link')} <ExternalLinkIcon />
            </Link>
          ),
        },
        {
          name: 'license',
          title: t('tile_general_item_license'),
          description: ({
            technicalDetails,
          }: {
            technicalDetails: TechnicalDetails;
          }) => technicalDetails.nutanixCluster.license.distribution,
        },
        {
          name: 'deployment_mode',
          title: t('tile_general_item_deployment_mode'),
          description: ({ cluster }: { cluster: Nutanix }) =>
            cluster.targetSpec.rackAwareness
              ? 'Rack awareness' // TODO: add popover
              : 'Node awareness', // TODO: add popover
        },
        {
          name: 'replication_factor',
          title: t('tile_general_item_replication_factor'),
          description: ({ cluster }: { cluster: Nutanix }) =>
            cluster.targetSpec.redundancyFactor,
        },
        {
          name: 'datacenter',
          title: t('tile_general_item_datacenter'),
          description: ({ server }: { server: DedicatedServer }) =>
            server.datacenter,
        },
        {
          name: 'rack',
          title: t('tile_general_item_rack'),
          description: ({
            cluster,
            server,
          }: {
            cluster: Nutanix;
            server: DedicatedServer;
          }) => (!cluster.targetSpec.rackAwareness ? server.rack || '-' : '-'),
        },
      ],
    },
    {
      name: 'licenses',
      heading: t('tile_licenses_title'),
      type: TileTypesEnum.LIST,
      onLoad: async () => {
        const serviceInfos = await getServiceInfos(serviceId);
        const technicalDetails = await getHardwareInfo(serviceInfos.serviceId);

        return { license: technicalDetails.nutanixCluster.license };
      },
      definitions: ({ license }: NutanixClusterDetails) => {
        return [
          {
            name: 'aol',
            title: 'AOL',
            description: license.edition,
          },
        ].concat(
          (
            (license?.features as NutanixClusterLicenseFeatureDetails[]) || []
          ).map((feature: NutanixClusterLicenseFeatureDetails) => {
            return {
              name: feature.name,
              title: startCase(feature.name),
              description: t(`tile_licenses_license_enabled_${feature.value}`),
            };
          }),
        );
      },
    },
    {
      name: 'billing',
      heading: t('tile_billing_title'),
    },
    {
      name: 'support',
      heading: t('tile_support_title'),
      type: TileTypesEnum.LIST,
      onLoad: async () => {
        const [supportLevel, ticketIds] = await Promise.all([
          getSupportLevel(),
          getSupportTicketIdsByServiceName(serviceId),
        ]);

        const viewTicketsUrl = await shell.navigation.getURL(
          'dedicated',
          '#/support/tickets',
          {
            filters: JSON.stringify({
              property: 'serviceName.value',
              operator: 'is',
              value: serviceId,
            }),
          },
        );
        const createNewTicketUrl = await shell.navigation.getURL(
          'dedicated',
          '#/support/tickets/new',
          {},
        );

        return { supportLevel, ticketIds, viewTicketsUrl, createNewTicketUrl };
      },
      definitions: [
        {
          name: 'support_level',
          title: t('tile_support_item_support_level'),
          description: ({ supportLevel }: { supportLevel: SupportLevel }) => {
            return SUPPORT_LEVELS[supportLevel.level] || supportLevel.level;
          },
        },
        {
          name: 'tickets',
          title: t('tile_support_item_tickets'),
          description: ({ ticketIds }: { ticketIds: number[] }) =>
            ticketIds.length,
          actions: ({
            ticketIds,
            viewTicketsUrl,
            createNewTicketUrl,
          }: {
            ticketIds: number[];
            viewTicketsUrl: string;
            createNewTicketUrl: string;
          }) => [
            ...(ticketIds.length > 0
              ? [
                  {
                    name: 'view_tickets',
                    label: t('tile_support_item_tickets_action_view_tickets'),
                    title: t('tile_support_item_tickets_action_view_tickets'),
                    href: viewTicketsUrl,
                    onClick: () => {
                      shell.tracking.trackClick({
                        name: `${trackingPrefix}::go-to-opened-ticket`,
                        type: 'action',
                        customVars: {},
                      });
                    },
                  },
                ]
              : []),
            {
              name: 'create_ticket',
              label: t('tile_support_item_tickets_action_create_ticket'),
              title: t('tile_support_item_tickets_action_create_ticket'),
              href: createNewTicketUrl,
              onClick: () => {
                shell.tracking.trackClick({
                  name: `${trackingPrefix}::go-to-create-ticket`,
                  type: 'action',
                  customVars: {},
                });
              },
            },
          ],
        },
        {
          name: 'travaux',
          title: t('tile_support_item_travaux'),
          description: () => (
            <Link href="https://www.status-ovhcloud.com/" isExternal>
              {t('tile_support_item_travaux_link')} <ExternalLinkIcon />
            </Link>
          ),
        },
      ],
    },
    {
      name: 'network',
      heading: t('tile_network_title'),
      type: TileTypesEnum.LIST,
      onLoad: async () => {
        const [cluster, serviceInfos] = await Promise.all([
          getNutanix(serviceId),
          getServiceInfos(serviceId),
        ]);
        const vrack = await (cluster.targetSpec.vrack
          ? getVrack(cluster.targetSpec.vrack)
          : Promise.resolve(null));
        const iplb = await (cluster.targetSpec.iplb
          ? getIpLoadBalancing(cluster.targetSpec.iplb)
          : Promise.resolve(null));
        const bandwidth = await getServerNetworkSpecifications(cluster);
        const bandwidthVrackOption = await getServerOption(
          cluster,
          DedicatedServerOptionEnum.BANDWIDTH_VRACK,
        );
        const serviceOptions = await getServiceOptions(serviceInfos.serviceId);

        const privateBandwidthServiceId = serviceOptions.find((service) =>
          service.billing?.plan?.code?.startsWith('cluster-vrack-bandwidth'),
        )?.serviceId;

        const upgradeOptions = await getServiceUpgrade(
          privateBandwidthServiceId,
        );

        const iplbUrl = await (cluster.targetSpec.iplb
          ? shell.navigation.getURL('dedicated', '#/iplb/:serviceName', {
              serviceName: cluster.targetSpec.iplb,
            })
          : Promise.resolve(null));

        const vrackUrl = await (cluster.targetSpec.vrack
          ? shell.navigation.getURL('dedicated', '#/vrack/:serviceName', {
              serviceName: cluster.targetSpec.vrack,
            })
          : Promise.resolve(null));

        return {
          cluster,
          vrack,
          iplb,
          bandwidth,
          bandwidthVrackOption,
          vrackUrl,
          iplbUrl,
          upgradeOptions,
        };
      },
      definitions: ({
        cluster,
        bandwidth,
        iplb,
        vrack,
        iplbUrl,
        vrackUrl,
        bandwidthVrackOption,
        upgradeOptions,
      }: {
        cluster: Nutanix;
        bandwidth: NetworkSpecifications;
        iplb: IpLoadBalancing;
        vrack: Vrack;
        bandwidthVrackOption: DedicatedServerOption;
        upgradeOptions: GenericProductDefinition[];
        iplbUrl: string;
        vrackUrl: string;
      }) => {
        return [
          ...(bandwidth.vrack.bandwidth
            ? [
                {
                  name: 'private_bandwidth',
                  title: t('tile_network_item_private_bandwidth'),
                  description: (
                    <SimpleGrid columns={2}>
                      <div>
                        <ArrowUpIcon /> {bandwidth.vrack.bandwidth.value}{' '}
                        {bandwidth.vrack.bandwidth.unit}{' '}
                        {t('tile_network_item_private_bandwidth_outgoing')}
                        {bandwidthVrackOption.state ===
                          DedicatedServerOptionStateEnum.RELEASED &&
                          t(
                            'tile_network_item_private_bandwidth_vrack_option_released',
                          )}
                      </div>
                      <div>
                        <ArrowDownIcon /> {bandwidth.vrack.bandwidth.value}{' '}
                        {bandwidth.vrack.bandwidth.unit}{' '}
                        {t('tile_network_item_private_bandwidth_incoming')}
                      </div>
                    </SimpleGrid>
                  ),
                  actions: () => [
                    ...(upgradeOptions?.length
                      ? [
                          {
                            name: 'modify',
                            label: t(
                              'tile_network_item_private_bandwidth_modify',
                            ),
                            title: t(
                              'tile_network_item_private_bandwidth_modify',
                            ),
                            to: '', // TODO: add modal
                          },
                        ]
                      : []),
                  ],
                },
              ]
            : []),
          {
            name: 'ipfo',
            title: 'IPFO',
            description: cluster.targetSpec.ipfo, // TODO: add clipboard input
          },
          {
            name: 'private_network',
            title: t('tile_network_item_private_network'),
            description: !cluster.targetSpec.vrack ? (
              t('tile_network_item_load_balancer_none')
            ) : (
              <Link href={vrackUrl}>
                {vrack.name || cluster.targetSpec.vrack}
              </Link>
            ),
          },
          {
            name: 'load_balancer',
            title: 'Load Balancer',
            description: !cluster.targetSpec.iplb ? (
              t('tile_network_item_load_balancer_none')
            ) : (
              <Link href={iplbUrl}>
                {iplb.displayName || cluster.targetSpec.iplb}
              </Link>
            ),
          },
        ];
      },
    },
    {
      name: 'hardware',
      heading: t('tile_hardware_title'),
    },
  ];

  return <Dashboard tiles={tiles} />;
}
