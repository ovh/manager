import { useTranslation } from 'react-i18next';

import {
  ActionMenu,
  ManagerTile,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { Link, Skeleton, Text } from '@ovhcloud/ods-react';
import {
  useGetAssociatedHosting,
  useGetFreeHostingServices,
} from '@/domain/hooks/data/query';

import { FREE_HOSTING_PLAN_CODE } from '@/common/constants/order';
import { useNavigate } from 'react-router-dom';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { urls } from '@/domain/routes/routes.constant';

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

export default function Hosting({ serviceName }: HostingProps) {
  const { t } = useTranslation(['domain']);
  const { data: availability } = useFeatureAvailability([
    'web-domains:domains:freehosting',
  ]);
  const navigate = useNavigate();
  const { data: associatedHosting } = useGetAssociatedHosting(serviceName);
  const hasHosting = associatedHosting?.length > 0;

  const freeHostingServices = useGetFreeHostingServices(
    associatedHosting || [],
  );

  const hasFreeHosting =
    hasHosting &&
    freeHostingServices.some((query) => {
      return query.data?.billing?.plan?.code === FREE_HOSTING_PLAN_CODE;
    });

  const actionMenuItems = [
    ...(availability?.['web-domains:domains:freehosting'] && !hasFreeHosting
      ? [
        {
          id: 1,
          label: t(
            'domain_tab_general_information_associated_services_hosting_action_activate',
          ),
          // Push (not replace) so the configo's history.back() returns to the
          // general information tab without a hard dashboard reload.
          onClick: () => {
            navigate(
              useGenerateUrl(urls.domainTabFreeHostingOrder, 'path', {
                serviceName,
              }),
            );
          },
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
  );
}
