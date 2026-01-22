import { useTranslation } from 'react-i18next';

import { Spinner } from '@ovhcloud/ods-react';

import { useAvailabilityRegions } from '@/api/hooks/useAvailabilityRegions';
import { Breadcrumb } from '@/components/nav/Breadcrumb.component';
import { use3azAvailability } from '@/hooks/useFeatureAvailability';

import { CreateClusterForm } from './components/CreateClusterForm.component';
import { selectAre3azRegionsAvailable } from './view-models/regions.viewmodel';

export default function New() {
  const { t } = useTranslation(['add', 'listing', 'common']);

  const { data: are3azRegionsAvailable, isLoading: is3azRegionsAvailableLoading } =
    useAvailabilityRegions({
      select: selectAre3azRegionsAvailable,
    });

  const { data: is3azFFAvailable, isLoading: is3azAvailableLoading } = use3azAvailability();

  const is3AZAvailable = !!are3azRegionsAvailable && is3azFFAvailable;
  const is3AZCheckLoading = is3azRegionsAvailableLoading || is3azAvailableLoading;

  return (
    <>
      <Breadcrumb
        entries={[{ label: t('listing:kube_list_title') }, { label: t('add:kubernetes_add') }]}
      />
      <main className="mt-9">
        {is3AZCheckLoading ? <Spinner /> : <CreateClusterForm is3azAvailable={is3AZAvailable} />}
      </main>
    </>
  );
}
