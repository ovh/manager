import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import GitList from './GitListTable.component';

interface PublicGitProps {
  gitVolumes: ai.volume.Volume[];
}

const PublicGit = ({ gitVolumes }: PublicGitProps) => {
  const { t } = useTranslation('components/public-git');
  return (
    <>
      <h2>{t('publicGitTitle')}</h2>
      <p>{t('publicGitDescription')}</p>
      <GitList git={gitVolumes} />
    </>
  );
};

export default PublicGit;
