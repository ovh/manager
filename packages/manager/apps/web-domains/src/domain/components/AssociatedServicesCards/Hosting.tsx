import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionMenu, ManagerTile } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { Link, Skeleton, Text } from '@ovhcloud/ods-react';
import { Region, Subsidiary } from '@ovh-ux/manager-config';
import {
  useGetAssociatedHosting,
  useGetFreeHostingServices,
  useInitialOrderFreeHosting,
  useOrderFreeHosting,
} from '@/domain/hooks/data/query';

import FreeHostingDrawer from './FreeHostingDrawer';
import { FREE_HOSTING_PLAN_CODE } from '@/common/constants/order';
import { useNavigate } from 'react-router-dom';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';
import { ServiceRoutes } from '@/common/enum/common.enum';
import { useGetServiceInformation } from '@/common/hooks/data/query';

interface HostingProps {
  readonly serviceName: string;
}

function HostingLink({ hosting }: Readonly<{ hosting: string }>) {
  const { data: hostingUrl } = useNavigationGetUrl([
    'web',
    `/hosting/${hosting}`,
    {},
  ]);
  return <Link href={hostingUrl}>{hosting}</Link>;
}

export interface FreeHostingOptions {
  dnsA: boolean;
  dnsMx: boolean;
  consent: boolean;
}

export default function Hosting({ serviceName }: HostingProps) {
  const { t } = useTranslation(['domain']);
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  const ovhSubsidiary = context.environment.getUser()
    .ovhSubsidiary as Subsidiary;
  const [isFreeHostingOpen, setIsFreeHostingOpen] = useState(false);
  const [freeHostingOptions, setFreeHostingOptions] = useState<
    FreeHostingOptions
  >({
    dnsA: false,
    dnsMx: false,
    consent: false,
  });
  const navigate = useNavigate();
  const { serviceInfo } = useGetServiceInformation(
    'domain',
    serviceName,
    ServiceRoutes.Domain,
  );
  const { data: associatedHosting } = useGetAssociatedHosting(serviceName);
  const {
    orderCartDetails,
    isInitialOrderFreeHostingPending,
    getInitialOrder,
  } = useInitialOrderFreeHosting(
    serviceName,
    ovhSubsidiary,
    serviceInfo?.billing?.pricing?.pricingMode,
  );

  const {
    orderFreeHosting,
    isOrderFreeHostingPending,
    orderCompleted,
  } = useOrderFreeHosting();
  const hasHosting = associatedHosting?.length > 0;

  const freeHostingServices = useGetFreeHostingServices(
    associatedHosting || [],
  );

  useEffect(() => {
    if (orderCompleted) {
      setIsFreeHostingOpen(false);
    }
  }, [orderCompleted]);

  useEffect(() => {
    if (isFreeHostingOpen) {
      getInitialOrder();
    }
  }, [isFreeHostingOpen]);

  const hasFreeHosting =
    hasHosting &&
    freeHostingServices.some((query) => {
      return query.data?.billing?.plan?.code === FREE_HOSTING_PLAN_CODE;
    });

  const actionMenuItems = [
    ...(region === Region.EU && !hasFreeHosting
      ? [
        {
          id: 1,
          label: t(
            'domain_tab_general_information_associated_services_hosting_action_activate',
          ),
          onClick: () => setIsFreeHostingOpen(true),
        },
      ]
      : []),
    {
      id: 2,
      label: t(
        'domain_tab_general_information_associated_services_hosting_action_order',
      ),
      onClick: () => {
        navigate(
          useGenerateUrl(urls.domainTabWebHostingOrder, 'path', {
            serviceName,
          }),
          { replace: true },
        );
      },
    },
  ];

  return (
    <>
      {isFreeHostingOpen && (
        <div
          className="fixed inset-0 bg-[--ods-color-primary-500] opacity-75 z-40"
          onClick={() => setIsFreeHostingOpen(false)}
        />
      )}
      <ManagerTile.Item>
        <ManagerTile.Item.Label>
          {t('domain_tab_general_information_associated_services_hosting')}
        </ManagerTile.Item.Label>
        <div className="flex items-center justify-between">
          {hasHosting ? (
            <ul className="list-none space-y-2 p-0 m-0">
              {associatedHosting.map((hosting, idx) => {
                const query = freeHostingServices[idx];
                return (
                  <li key={hosting} className="flex items-center gap-2">
                    <HostingLink hosting={hosting} />
                    {query?.isLoading && <Skeleton />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Text>
              {t(
                'domain_tab_general_information_associated_services_hosting_content',
              )}
            </Text>
          )}
          <ActionMenu id="hosting-service" isCompact items={actionMenuItems} />
        </div>
      </ManagerTile.Item>
      <FreeHostingDrawer
        isDrawerOpen={isFreeHostingOpen}
        onClose={() => setIsFreeHostingOpen(false)}
        freeHostingOptions={freeHostingOptions}
        setFreeHostingOptions={setFreeHostingOptions}
        orderFreeHosting={orderFreeHosting}
        isOrderFreeHostingPending={isOrderFreeHostingPending}
        orderCartDetails={orderCartDetails}
        isInitialOrderFreeHostingPending={isInitialOrderFreeHostingPending}
      />
    </>
  );
}
