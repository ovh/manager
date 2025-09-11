import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BaseLayout, Notifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import { OkmsManagement } from './OkmsManagement.component';
import { SecretForm } from './SecretForm.component';
import { OrderOkmsModalProvider } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

export default function SecretCreatePage() {
  const { t } = useTranslation('secret-manager');

  const [selectedOkmsId, setSelectedOkmsId] = useState<string | undefined>();

  return (
    <OrderOkmsModalProvider>
      <BaseLayout
        header={{
          title: t('create_a_secret'),
          changelogButton: <SecretManagerChangelogButton />,
        }}
        breadcrumb={
          <OdsBreadcrumb>
            <RootBreadcrumbItem />
          </OdsBreadcrumb>
        }
        message={<Notifications />}
      >
        <div className="flex flex-col gap-8 max-w-screen-xxl">
          <OkmsManagement
            selectedOkmsId={selectedOkmsId}
            setSelectedOkmsId={setSelectedOkmsId}
          />
          <SecretForm okmsId={selectedOkmsId} />
        </div>
        <Outlet />
      </BaseLayout>
    </OrderOkmsModalProvider>
  );
}
