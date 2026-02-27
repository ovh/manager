import { useTranslation } from 'react-i18next';

import { Breadcrumb } from '@/components/nav/Breadcrumb.component';

import { CreateClusterForm } from './components/CreateClusterForm.component';

export default function New() {
  const { t } = useTranslation(['add', 'listing', 'common']);

  return (
    <>
      <Breadcrumb
        entries={[{ label: t('listing:kube_list_title') }, { label: t('add:kubernetes_add') }]}
      />
      <main className="mt-9">
        <CreateClusterForm />
      </main>
    </>
  );
}
