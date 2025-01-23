import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../Notebook.context';
import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import GitList from './_components/GitListTable.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-notebooks/notebooks/notebook/public-git"
    />
  );
}

const PublicGit = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation(
    'pci-ai-notebooks/notebooks/notebook/public-git',
  );
  return (
    <>
      <h2>{t('publicGitTitle')}</h2>
      <p>{t('publicGitDescription')}</p>
      <GitList
        git={notebook.spec.volumes.filter(
          (vol: ai.volume.Volume) => vol.volumeSource.publicGit,
        )}
      />
    </>
  );
};

export default PublicGit;
