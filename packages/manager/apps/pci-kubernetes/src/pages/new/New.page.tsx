import { useTranslation } from 'react-i18next';

import { Spinner } from '@ovhcloud/ods-react';

import { useProject } from '@ovh-ux/manager-pci-common';

import { Breadcrumb } from '@/components/nav/Breadcrumb.component';

import { CreateClusterForm } from './components/createClusterForm/CreateClusterForm.component';

export default function New() {
  const { t } = useTranslation(['add', 'listing', 'common']);
  const project = useProject();

  if (!project) {
    return <Spinner />;
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: t('listing:kube_list_title') }, { label: t('add:kubernetes_add') }]}
      />
      <main className="mt-9">
        <CreateClusterForm />
      </main>
    </>
  );
}
