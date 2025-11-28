import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  BaseLayout,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import {
  OkmsBreadcrumbItem,
  RootBreadcrumbItem,
} from '@secret-manager/components/breadcrumb';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import { LocationPathParams } from '@secret-manager/routes/routes.constants';
import { SecretForm } from '@secret-manager/pages/createSecret/SecretForm.component';
import { OrderOkmsModalProvider } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

export default function CreateSecretPage() {
  const { t } = useTranslation('secret-manager');
  const { notifications } = useNotifications();

  const { okmsId } = useParams<LocationPathParams>();

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
            <OkmsBreadcrumbItem />
          </OdsBreadcrumb>
        }
        message={notifications.length > 0 ? <Notifications /> : null}
      >
        <div className="flex flex-col gap-8 max-w-2xl">
          <SecretForm okmsId={okmsId} />
        </div>
        <Outlet />
      </BaseLayout>
    </OrderOkmsModalProvider>
  );
}
