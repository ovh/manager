import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { startCase } from 'lodash-es';
import { useShell } from '@/core';

import Nutanix, {
  getNutanix,
  getServiceInfos,
  getServer,
  getTechnicalDetails,
  Server,
} from '@/api/nutanix';
import Service, {
  getServiceDetails,
  getHardwareInfo,
  TechnicalDetails,
  NutanixClusterDetails,
  NutanixClusterLicenseFeatureDetails,
} from '@/api/service';
import SupportLevel, {
  getSupportLevel,
  getSupportTicketIdsByServiceName,
} from '@/api/support';
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
          getServer(cluster.targetSpec?.nodes[0]?.server),
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
              {t('tile_general_item_cluster_redeploy_link')}{' '}
              <ArrowForwardIcon />
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
          description: ({ server }: { server: Server }) => server.datacenter,
        },
        {
          name: 'rack',
          title: t('tile_general_item_rack'),
          description: ({
            cluster,
            server,
          }: {
            cluster: Nutanix;
            server: Server;
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
    },
    {
      name: 'hardware',
      heading: t('tile_hardware_title'),
    },
  ];

  return <Dashboard tiles={tiles} />;
}
