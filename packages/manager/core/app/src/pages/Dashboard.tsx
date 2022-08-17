import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import Nutanix, {
  getNutanix,
  getServiceInfos,
  getServer,
  getTechnicalDetails,
  Server,
} from '@/api/nutanix';
import Service, { getServiceDetails, TechnicalDetails } from '@/api/service';
import Dashboard, { TileTypesEnum } from '../components/Dashboard';

export default function DashboardPage(): JSX.Element {
  const { t } = useTranslation('dashboard');
  const { serviceId } = useParams();

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
          getDescription: ({ cluster }: { cluster: Nutanix }) => {
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
          getDescription: ({ serviceDetails }: { serviceDetails: Service }) =>
            serviceDetails.billing.plan.invoiceName,
        },
        {
          name: 'cluster_redeploy',
          title: t('tile_general_item_cluster_redeploy'),
          getDescription: () => (
            <Link as={RouterLink} to="">
              {t('tile_general_item_cluster_redeploy_link')}{' '}
              <ArrowForwardIcon />
            </Link>
          ),
        },
        {
          name: 'admin_interface',
          title: t('tile_general_item_admin_interface'),
          getDescription: ({ cluster }: { cluster: Nutanix }) => (
            <Link href={cluster.targetSpec.controlPanelURL} isExternal>
              {t('tile_general_item_admin_interface_link')} <ExternalLinkIcon />
            </Link>
          ),
        },
        {
          name: 'license',
          title: t('tile_general_item_license'),
          getDescription: ({
            technicalDetails,
          }: {
            technicalDetails: TechnicalDetails;
          }) => technicalDetails.nutanixCluster.license.distribution,
        },
        {
          name: 'deployment_mode',
          title: t('tile_general_item_deployment_mode'),
          getDescription: ({ cluster }: { cluster: Nutanix }) =>
            cluster.targetSpec.rackAwareness
              ? 'Rack awareness' // TODO: add popover
              : 'Node awareness', // TODO: add popover
        },
        {
          name: 'replication_factor',
          title: t('tile_general_item_replication_factor'),
          getDescription: ({ cluster }: { cluster: Nutanix }) =>
            cluster.targetSpec.redundancyFactor,
        },
        {
          name: 'datacenter',
          title: t('tile_general_item_datacenter'),
          getDescription: ({ server }: { server: Server }) => server.datacenter,
        },
        {
          name: 'rack',
          title: t('tile_general_item_rack'),
          getDescription: ({
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
    },
    {
      name: 'billing',
      heading: t('tile_billing_title'),
    },
    {
      name: 'support',
      heading: t('tile_supportl_title'),
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
