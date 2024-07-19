import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import PrivateDocker from './_components/privateDocker/PrivateDocker.component';
import SharedDocker from './_components/sharedDocker/SharedDocker.component';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-dashboard/docker"
    />
  );
}

const Docker = () => {
  const { t } = useTranslation('pci-ai-dashboard/docker');
  const { projectId } = useParams();
  const regionQuery = useGetRegions(projectId);
  return (
    <>
      <div className="float-right">
        <Guides section={GuideSections.tokens} />
      </div>

      <h3>{t('title')}</h3>
      <p>{t('dockerParagraphe1')}</p>
      <PrivateDocker />
      {regionQuery.isSuccess && <SharedDocker regions={regionQuery.data} />}
    </>
  );
};

export default Docker;
