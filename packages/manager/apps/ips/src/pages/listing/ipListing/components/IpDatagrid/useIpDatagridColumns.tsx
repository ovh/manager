import { useTranslation } from 'react-i18next';
import {
  IpActionsCell,
  IpAlerts,
  IpAntiDdos,
  IpAttachedService,
  IpCell,
  IpCountry,
  IpEdgeFirewall,
  IpGameFirewall,
  IpRegion,
  IpReverse,
  IpType,
  IpVmac,
} from '../DatagridCells';

export const useIpDatagridColumns = () => {
  const { t } = useTranslation('listing');

  return [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: IpCell,
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: IpType,
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: IpAlerts,
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: IpRegion,
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: IpCountry,
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: IpAttachedService,
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: IpReverse,
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: IpVmac,
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: IpAntiDdos,
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: IpEdgeFirewall,
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: IpGameFirewall,
    },
    {
      id: 'action',
      label: '',
      cell: IpActionsCell,
    },
  ];
};
