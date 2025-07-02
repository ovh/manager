import React, { useState } from 'react';
import { BaseLayout, Notifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { DomainManagement } from './DomainManagement.component';
import { SecretForm } from './SecretForm.component';

export default function SecretCreatePage() {
  const { t } = useTranslation(['secret-manager/create']);

  const [selectedDomainId, setSelectedDomainId] = useState<string>();

  return (
    <BaseLayout header={{ title: t('title') }} message={<Notifications />}>
      <div className="flex flex-col gap-8">
        <DomainManagement
          selectedDomainId={selectedDomainId}
          setSelectedDomainId={setSelectedDomainId}
        />
        <SecretForm domainId={selectedDomainId} />
      </div>
    </BaseLayout>
  );
}
