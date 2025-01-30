import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Datagrid,
  BaseLayout,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsButton, OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import Loading from '@/components/Loading/Loading';
import { urls } from '@/routes/routes.constant';
import { useGetIpList } from '@/data/hooks/ip';
import {
  IpRegion,
  IpType,
  IpCountry,
  IpAttachedService,
  IpReverse,
  IpVmac,
  IpAntiDdos,
  IpEdgeFirewall,
  IpGameFirewall,
  IpAlerts,
  IpCell,
} from '@/components/DatagridCells';

export default function Listing() {
  const [paginatedIpList, setPaginatedIpList] = useState<string[]>([]);
  const [numberOfPageDisplayed, setNumberOfPageDisplayed] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const { t } = useTranslation('listing');
  const { t: tError } = useTranslation('error');

  const { ipList, isLoading, error, isError } = useGetIpList();
  const columns = [
    {
      id: 'ip',
      label: t('listingColumnsIp'),
      cell: (ip: string) => {
        return <IpCell ipGroup={ip}></IpCell>;
      },
    },
    {
      id: 'ip-type',
      label: t('listingColumnsIpType'),
      cell: (ip: string) => {
        return <IpType ip={ip}></IpType>;
      },
    },
    {
      id: 'ip-alerts',
      label: t('listingColumnsIpAlerts'),
      cell: (ip: string) => {
        return <IpAlerts ipGroup={ip}></IpAlerts>;
      },
    },
    {
      id: 'ip-region',
      label: t('listingColumnsIpRegion'),
      cell: (ip: string) => {
        return <IpRegion ip={ip}></IpRegion>;
      },
    },
    {
      id: 'ip-country',
      label: t('listingColumnsIpCountry'),
      cell: (ip: string) => {
        return <IpCountry ip={ip}></IpCountry>;
      },
    },
    {
      id: 'ip-attached-service',
      label: t('listingColumnsIpAttachedService'),
      cell: (ip: string) => {
        return <IpAttachedService ip={ip}></IpAttachedService>;
      },
    },
    {
      id: 'ip-reverse',
      label: t('listingColumnsIpReverseDNS'),
      cell: (ip: string) => {
        return <IpReverse ipGroup={ip}></IpReverse>;
      },
    },
    {
      id: 'ip-vmac',
      label: t('listingColumnsIpVMac'),
      cell: (ip: string) => {
        return <IpVmac ipGroup={ip}></IpVmac>;
      },
    },
    {
      id: 'ip-ddos',
      label: t('listingColumnsIpAntiDDos'),
      cell: (ip: string) => {
        return <IpAntiDdos ipGroup={ip}></IpAntiDdos>;
      },
    },
    {
      id: 'ip-edge-firewall',
      label: t('listingColumnsIpEdgeFirewall'),
      cell: (ip: string) => {
        return <IpEdgeFirewall ipGroup={ip}></IpEdgeFirewall>;
      },
    },
    {
      id: 'ip-game-firewall',
      label: t('listingColumnsIpGameFirewall'),
      cell: (ip: string) => {
        return <IpGameFirewall ipGroup={ip}></IpGameFirewall>;
      },
    },
  ];

  useEffect(() => {
    if (!ipList) return;
    setPaginatedIpList(ipList.slice(0, pageSize * numberOfPageDisplayed));
  }, [ipList, numberOfPageDisplayed]);

  const loadMoreIps = () => {
    setNumberOfPageDisplayed(numberOfPageDisplayed + 1);
  };

  const header = {
    title: t('title'),
  };

  return (
    <RedirectionGuard
      isLoading={isLoading || !ipList}
      condition={!isLoading && !ipList?.length}
      route={urls.onboarding}
      isError={isError}
      errorComponent={<ErrorBanner error={error as ApiError} />}
    >
      <BaseLayout header={header}>
        <OdsButton
          className="mb-5"
          variant={ODS_BUTTON_VARIANT.outline}
          icon={ODS_ICON_NAME.plus}
          onClick={() => navigate(urls.order)}
          label={t('orderIps')}
        />
        <React.Suspense fallback={<Loading />}>
          <Datagrid
            columns={columns}
            items={paginatedIpList}
            totalItems={ipList?.length}
            hasNextPage={numberOfPageDisplayed * pageSize < ipList?.length}
            onFetchNextPage={loadMoreIps}
          />
        </React.Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
