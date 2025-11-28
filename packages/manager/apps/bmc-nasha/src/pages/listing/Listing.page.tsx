import { useContext } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useNavigationGetUrl,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, ChangelogMenu, Datagrid, GuideMenu } from '@ovh-ux/muk';

import { Breadcrumb } from '@ovh-ux/manager-react-components';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { AppConfig, appName } from '@/App.constants';
import { GUIDES_URL } from '@/constants/Nasha.constants';
import { useListingColumns } from '@/hooks/listing/useListingColumns';
import type { NashaService } from '@/types/Nasha.type';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'listing']);
  const { trackClick } = useOvhTracking();
  const { data: orderUrl } = useNavigationGetUrl(['dedicated', '#/nasha/order', {}]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const columns = useListingColumns();

  const { data, isLoading } = useQuery({
    queryKey: ['listing', APP_FEATURES.listingEndpoint],
    queryFn: () =>
      fetchIcebergV6<NashaService>({ route: APP_FEATURES.listingEndpoint, pageSize: 25 }),
    select: (response) => ({
      flattenData: Array.isArray(response?.data) ? response.data : [],
      totalCount: response?.totalCount || 0,
    }),
  });

  const nashaGuidesUrl = GUIDES_URL[ovhSubsidiary as keyof typeof GUIDES_URL] || GUIDES_URL.DEFAULT;

  const handleOrderClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'listing', 'add'],
    });
    if (orderUrl) window.location.href = orderUrl as string;
  };

  const handleGuideClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [APP_NAME, 'listing', 'guides'],
    });
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} />}
      header={{
        title: t('listing:title'),
        changelogButton: (
          <ChangelogMenu
            links={{
              changelog: 'https://github.com/ovh/manager',
              roadmap: 'https://github.com/ovh/manager',
              'feature-request': 'https://github.com/ovh/manager',
            }}
          />
        ),
        guideMenu: (
          <GuideMenu
            items={[
              {
                id: 1,
                href: nashaGuidesUrl,
                target: '_blank',
                label: t('listing:guides.title', 'Guides'),
                onClick: handleGuideClick,
              },
            ]}
          />
        ),
      }}
    >
      <Datagrid
        columns={columns}
        data={data?.flattenData || []}
        totalCount={data?.totalCount || 0}
        isLoading={isLoading}
        topbar={
          <Button variant="default" onClick={handleOrderClick}>
            {t('listing:order_button')}
          </Button>
        }
      />
    </BaseLayout>
  );
}
