import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import PrivateDocker from './_components/privateDocker/PrivateDocker.component';
import SharedDocker from './_components/sharedDocker/SharedDocker.component';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import { GuideSections } from '@/configuration/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="ai-tools/dashboard/docker"
    />
  );
}

const Docker = () => {
  const { t } = useTranslation('ai-tools/dashboard/docker');
  const { projectId } = useParams();
  const regionQuery = useGetRegions(projectId);
  return (
    <>
      <div className="float-right">
        <Guides section={[GuideSections.registres]} />
      </div>

      <h3>{t('title')}</h3>
      <p>{t('dockerParagraphe1')}</p>
      <PrivateDocker />
      {regionQuery.isSuccess && <SharedDocker regions={regionQuery.data} />}
    </>
  );
};

export default Docker;
