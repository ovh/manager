import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BaseLayout, Notifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { RootBreadcrumbItem } from '@secret-manager/components/breadcrumb';
import { DomainManagement } from './DomainManagement.component';
import { SecretForm } from './SecretForm.component';
import { OrderOkmsModalProvider } from '@/common/pages/OrderOkmsModal/OrderOkmsModalContext';

export default function SecretCreatePage() {
  const { t } = useTranslation('secret-manager/create');

  const [selectedDomainId, setSelectedDomainId] = useState<
    string | undefined
  >();

  return (
    <OrderOkmsModalProvider>
      <BaseLayout
        header={{ title: t('title') }}
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
