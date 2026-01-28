import { useState } from 'react';

import { Outlet } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { SECRET_MANAGER_SEARCH_PARAMS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@ovhcloud/ods-react';

import { useNotifications } from '@ovh-ux/muk';
import { BaseLayout, Notifications } from '@ovh-ux/muk';

import { PriceTile } from '@/common/components/price-tile/PriceTile';

import { OkmsManagement } from './OkmsManagement.component';
import { SecretForm } from './SecretForm.component';

export default function SecretCreatePage() {
  const { t } = useTranslation('secret-manager');
  const { notifications } = useNotifications();

  const [searchParams] = useSearchParams();
  const okmsIdSearchParam = searchParams.get(SECRET_MANAGER_SEARCH_PARAMS.okmsId) ?? undefined;
  const [selectedOkmsId, setSelectedOkmsId] = useState<string | undefined>(okmsIdSearchParam);

  return (
    <BaseLayout
      header={{
        title: t('create_a_secret'),
        changelogButton: <SecretManagerChangelogButton />,
        guideMenu: <SecretManagerGuidesButton />,
      }}
      breadcrumb={
        <Breadcrumb>
          <RootBreadcrumbItem />
        </Breadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : undefined}
    >
      <div className="flex max-w-2xl flex-col gap-8">
        <PriceTile
          title={t('secrets_pricing_title')}
          subtitle={t('secrets_pricing_subtitle')}
          productCode="secret"
        />
        <OkmsManagement selectedOkmsId={selectedOkmsId} setSelectedOkmsId={setSelectedOkmsId} />
        <SecretForm okmsId={selectedOkmsId} />
      </div>
      <Outlet />
    </BaseLayout>
  );
}
