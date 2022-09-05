import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from '@ovh-ux/manager-themes';

import { useShell } from '@/core';
import Nutanix, {
  getNutanix,
  getServer,
  getServiceInfos,
  getNutanixFullTechnicalDetails,
  getServerNetworkSpecifications,
  getServerOption,
} from '@/api/nutanix';
import Service, {
  getServiceDetails,
  getTechnicalDetails,
  getServiceOptions,
  getServiceUpgrade,
  TechnicalDetails,
  NutanixClusterLicenseFeatureDetails,
  GenericProductDefinition,
  BareMetalServerDetails,
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
  const [actionUrls, setActionUrls] = useState<Record<string, unknown>>({});

  const SUPPORT_LEVELS = {
    standard: 'Standard',
    premium: 'Premium',
    'premium-accredited': 'Premium Advanced',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  const trackingPrefix = 'hpc::nutanix::cluster::dashboard';

  const getDiskByUsage = (
    technicalDetails: BareMetalServerDetails,
    diskUsage: string,
  ) => {
    const disks = technicalDetails?.storage?.disks;
    return disks.filter((disk) => disk.usage === diskUsage);
  };

  const getFormattedDisks = (
    technicalDetails: BareMetalServerDetails,
    diskUsage: string,
  ): string[] => {
    const disks = getDiskByUsage(technicalDetails, diskUsage);
    if (!disks.length) {
      return [];
    }
    const gbTranslated = t('tile_hardware_item_ram_size_unit');
    const tbTranslated = t('tile_hardware_item_ram_size_unit_tb');
    return disks.map((disk) => {
      const number = disk.number || 1;
      const technology = disk.technology || '';
      const diskInterface = disk.interface || '';
      const { capacity } = disk;
      let capacityStr;

      if (Number.isNaN(capacity)) {
        capacityStr = '-';
      } else if (capacity >= 1000) {
        capacityStr = `${Math.round((100 * (capacity as number)) / 1000) /
          100} ${tbTranslated}`;
      } else {
        capacityStr = `${capacity} ${gbTranslated}`;
      }

      return `${number}×${capacityStr} ${technology} ${diskInterface}`;
    });
  };

  const clusterQuery = useQuery(
    ['nutanix', serviceId],
    async () => getNutanix(serviceId),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const serviceInfosQuery = useQuery(
    ['nutanix_service_details', serviceId],
    async () => getServiceInfos(serviceId),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const { data: nutanixCluster } = clusterQuery;
  const { data: nutanixServiceInfos } = serviceInfosQuery;

  const serviceDetailsQuery = useQuery(
    ['service_details', nutanixServiceInfos?.serviceId],
    async () => getServiceDetails(nutanixServiceInfos?.serviceId),
    {
      enabled: !!nutanixServiceInfos?.serviceId,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const serverQuery = useQuery(
    ['nutanix_metaInfos', serviceId],
    async () => getServer(nutanixCluster),
    {
      enabled: !!nutanixCluster?.targetSpec?.nodes?.[0]?.server,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const { data: nutanixServer } = serverQuery;

  const fullTechnicalDetailsQuery = useQuery(
    [
      'nutanix_techical_details',
      nutanixServiceInfos?.serviceId,
      nutanixServer?.serviceId,
    ],
    async () =>
      getNutanixFullTechnicalDetails(
        nutanixServiceInfos?.serviceId,
        nutanixServer?.serviceId,
      ),
    {
      enabled: !!nutanixServiceInfos?.serviceId && !!nutanixServer?.serviceId,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const nutanixServiceTechnicalDetailsQuery = useQuery(
    ['service_technical_details', nutanixServiceInfos?.serviceId],
    async () => getTechnicalDetails(nutanixServiceInfos?.serviceId),
    {
      enabled: !!nutanixServiceInfos?.serviceId,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const supportLevelQuery = useQuery(['me_support_level'], async () =>
    getSupportLevel(),
  );

  const supportTicketsQuery = useQuery(
    ['support_tickets', serviceId],
    async () => getSupportTicketIdsByServiceName(serviceId),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const vrackQuery = useQuery(
    ['vrack', serviceId],
    async () =>
      nutanixCluster?.targetSpec?.vrack
        ? getVrack(nutanixCluster?.targetSpec?.vrack)
        : Promise.resolve(null),
    {
      enabled: !!nutanixCluster,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const iplbQuery = useQuery(
    ['ip_load_balancing', serviceId],
    async () =>
      nutanixCluster?.targetSpec?.iplb
        ? getIpLoadBalancing(nutanixCluster?.targetSpec?.iplb)
        : Promise.resolve(null),
    {
      enabled: !!nutanixCluster,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const bandwidthQuery = useQuery(
    ['dedicated_server_specifications_network', serviceId],
    async () => getServerNetworkSpecifications(nutanixCluster),
    {
      enabled: !!nutanixCluster?.targetSpec?.nodes?.[0]?.server,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const bandwidthVrackOptionQuery = useQuery(
    [
      'dedicated_server_option',
      serviceId,
      DedicatedServerOptionEnum.BANDWIDTH_VRACK,
    ],
    async () =>
      getServerOption(
        nutanixCluster,
        DedicatedServerOptionEnum.BANDWIDTH_VRACK,
      ),
    {
      enabled: !!nutanixCluster?.targetSpec?.nodes?.[0]?.server,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const serviceOptionsQuery = useQuery(
    ['services_option', nutanixServiceInfos?.serviceId],
    async () => getServiceOptions(nutanixServiceInfos?.serviceId),
    {
      enabled: !!nutanixServiceInfos?.serviceId,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  const { data: serviceOptions } = serviceOptionsQuery;

  const privateBandwidthServiceId = serviceOptions?.find((service) =>
    service.billing?.plan?.code?.startsWith('cluster-vrack-bandwidth'),
  )?.serviceId;

  const upgradeOptionsQuery = useQuery(
    ['services_upgrade', privateBandwidthServiceId],
    async () => getServiceUpgrade(privateBandwidthServiceId),
    {
      enabled: !!privateBandwidthServiceId,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  useEffect(() => {
    Promise.all([
      shell.navigation.getURL('dedicated', '#/support/tickets', {
        filters: JSON.stringify({
          property: 'serviceName.value',
          operator: 'is',
          value: serviceId,
        }),
      }),
      shell.navigation.getURL('dedicated', '#/support/tickets/new', {}),
    ]).then(([viewTicketsUrl, createNewTicketUrl]) =>
      setActionUrls({
        ...actionUrls,
        viewTicketsUrl,
        createNewTicketUrl,
      }),
    );
  }, []);

  useEffect(() => {
    if (nutanixCluster) {
      Promise.all([
        nutanixCluster.targetSpec.iplb
          ? shell.navigation.getURL('dedicated', '#/iplb/:serviceName', {
              serviceName: nutanixCluster.targetSpec.iplb,
            })
          : Promise.resolve(null),
        nutanixCluster.targetSpec.vrack
          ? shell.navigation.getURL('dedicated', '#/vrack/:serviceName', {
              serviceName: nutanixCluster.targetSpec.vrack,
            })
          : Promise.resolve(null),
      ]).then(([iplbUrl, vrackUrl]) =>
        setActionUrls({
          ...actionUrls,
          iplbUrl,
          vrackUrl,
        }),
      );
    }
  }, [nutanixCluster]);

  const tiles = [
    {
      name: 'general',
      heading: t('tile_general_title'),
      type: TileTypesEnum.LIST,
      loadingQueries: {
        cluster: clusterQuery,
        serviceInfos: serviceInfosQuery,
        serviceDetails: serviceDetailsQuery,
        server: serverQuery,
        technicalDetails: fullTechnicalDetailsQuery,
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
      loadingQueries: {
        technicalDetails: nutanixServiceTechnicalDetailsQuery,
      },
      definitions: ({
        technicalDetails,
      }: {
        technicalDetails: TechnicalDetails;
      }) => {
        const { license } = technicalDetails.nutanixCluster;

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
            // build the title with the feature name startCased
            let title = `${feature.name
              .charAt(0)
              .toUpperCase()}${feature.name.slice(1)}`;
            title = title.match(/[A-Z]?[a-z]+[a-z]/g).join(' ');
            return {
              name: feature.name,
              title,
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
      loadingQueries: {
        supportLevel: supportLevelQuery,
        ticketIds: supportTicketsQuery,
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
          actions: ({ ticketIds }: { ticketIds: number[] }) => [
            ...(ticketIds.length > 0
              ? [
                  {
                    name: 'view_tickets',
                    label: t('tile_support_item_tickets_action_view_tickets'),
                    title: t('tile_support_item_tickets_action_view_tickets'),
                    href: actionUrls.viewTicketsUrl as string,
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
              href: actionUrls.createNewTicketUrl as string,
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
      loadingQueries: {
        cluster: clusterQuery,
        bandwidth: bandwidthQuery,
        iplb: iplbQuery,
        vrack: vrackQuery,
        upgradeOptions: upgradeOptionsQuery,
        bandwidthVrackOption: bandwidthVrackOptionQuery,
      },
      definitions: ({
        cluster,
        bandwidth,
        iplb,
        vrack,
        bandwidthVrackOption,
        upgradeOptions,
      }: {
        cluster: Nutanix;
        bandwidth: NetworkSpecifications;
        iplb: IpLoadBalancing;
        vrack: Vrack;
        bandwidthVrackOption: DedicatedServerOption;
        upgradeOptions: GenericProductDefinition[];
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
              <Link href={actionUrls.vrackUrl as string}>
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
              <Link href={actionUrls.iplbUrl as string}>
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
      type: TileTypesEnum.LIST,
      loadingQueries: {
        technicalDetails: fullTechnicalDetailsQuery,
      },
      definitions: ({
        technicalDetails,
      }: {
        technicalDetails: TechnicalDetails;
      }) => {
        const { baremetalServers } = technicalDetails;

        return [
          {
            name: 'cpu',
            title: t('tile_hardware_item_cpu'),
            description: () => {
              const cpu = baremetalServers.server?.cpu;
              if (!cpu) {
                return '-';
              }
              const cpuNumber = cpu?.number || 1;
              const freqUnit = t('tile_hardware_item_cpu_frequency_unit');
              const cpuBrand = cpu?.brand || '';
              const cpuModel = cpu?.model || '';
              const cpuCores = cpu.cores ? `${cpu.cores}c` : '';
              const cpuThreads = cpu.threads
                ? `${cpu.cores && '/'}${cpu.threads}t`
                : '';
              const cpuFrequency = cpu.frequency
                ? `${cpu.frequency} ${freqUnit}`
                : '';
              const cpuBoost =
                cpu.boost !== cpu.frequency ? `/${cpu.boost} ${freqUnit}` : '';
              return `${
                cpuNumber > 1 ? `${cpuNumber}×` : ''
              } ${cpuBrand} ${cpuModel} - ${cpuCores}${cpuThreads} - ${cpuFrequency}${cpuBoost}`;
            },
          },
          {
            name: 'ram',
            title: t('tile_hardware_item_ram'),
            description: () => {
              const ram = baremetalServers.memory;
              if (!ram) {
                return '-';
              }
              const freqUnit = t('tile_hardware_item_ram_frequency_unit');
              const gbTranslated = t('tile_hardware_item_ram_size_unit');
              const ramSize = ram.size ? `${ram.size} ${gbTranslated}` : '';
              const ramType = ram.ramType || '';
              const ramECC = ram.ecc ? 'ECC' : '';
              const ramFrequency = ram.frequency
                ? `${ram.frequency} ${freqUnit}`
                : '';
              return `${ramSize} ${ramType} ${ramECC} ${ramFrequency}`;
            },
          },
          ...(getDiskByUsage(baremetalServers, 'os').length
            ? [
                {
                  name: 'system_disk',
                  title: t('tile_hardware_item_system_disk'),
                  description: () =>
                    getFormattedDisks(
                      baremetalServers,
                      'os',
                    ).map((formattedDisk, index) => (
                      <p key={index}>{formattedDisk}</p>
                    )),
                },
              ]
            : []),
          ...(getDiskByUsage(baremetalServers, 'data').length
            ? [
                {
                  name: 'data_disk',
                  title: t('tile_hardware_item_data_disk'),
                  description: () =>
                    getFormattedDisks(
                      baremetalServers,
                      'data',
                    ).map((formattedDisk, index) => (
                      <p key={index}>{formattedDisk}</p>
                    )),
                },
              ]
            : []),
          ...(baremetalServers.storage?.raid !== 'none'
            ? [
                {
                  name: 'extension_card',
                  title: t('tile_hardware_item_extension_card'),
                  description: baremetalServers.storage?.raid,
                },
              ]
            : []),
        ];
      },
    },
  ];

  return <Dashboard tiles={tiles} />;
}
