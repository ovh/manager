import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerChangelogButton } from '@secret-manager/components/secret-manager-changelog-button/SecretManagerChangelogButton.component';
import { SecretManagerGuidesButton } from '@secret-manager/components/guides/SecretManagerGuideButton';
import { OkmsManagement } from './OkmsManagement.component';
import { SecretForm } from './SecretForm.component';

export default function SecretCreatePage() {
  const { t } = useTranslation('secret-manager');
  const { notifications } = useNotifications();

  const [selectedOkmsId, setSelectedOkmsId] = useState<string | undefined>();

  return (
    <BaseLayout
      header={{
        title: t('create_a_secret'),
        changelogButton: <SecretManagerChangelogButton />,
        headerButton: <SecretManagerGuidesButton />,
      }}
      breadcrumb={
        <OdsBreadcrumb>
          <RootBreadcrumbItem />
        </OdsBreadcrumb>
      }
      message={notifications.length > 0 ? <Notifications /> : null}
    >
      <div className="flex flex-col gap-8 max-w-2xl">
        <OkmsManagement
          selectedOkmsId={selectedOkmsId}
          setSelectedOkmsId={setSelectedOkmsId}
        />
        <SecretForm okmsId={selectedOkmsId} />
      </div>
      <Outlet />
    </BaseLayout>
  );
}
