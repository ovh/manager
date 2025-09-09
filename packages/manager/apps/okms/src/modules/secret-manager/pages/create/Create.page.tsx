import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BaseLayout, Notifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { SecretManagerChangelogButton } from '@secret-manager/components/secretManagerChangelogButton/SecretManagerChangelogButton.component';
import { DomainManagement } from './DomainManagement.component';
import { SecretForm } from './SecretForm.component';
import { OrderOkmsModalProvider } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

export default function SecretCreatePage() {
  const { t } = useTranslation('secret-manager');

  const [selectedDomainId, setSelectedDomainId] = useState<
    string | undefined
  >();

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
          <DomainManagement
            selectedDomainId={selectedDomainId}
            setSelectedDomainId={setSelectedDomainId}
          />
          <SecretForm domainId={selectedDomainId} />
        </div>
        <Outlet />
      </BaseLayout>
    </OrderOkmsModalProvider>
  );
}
