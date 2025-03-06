import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import GitList from './GitListTable.component';
import { Button } from '../ui/button';

interface PublicGitProps {
  gitVolumes: ai.volume.Volume[];
  onDelete?: (volume: ai.volume.Volume) => void;
  updateMode: boolean;
}

const PublicGit = ({ gitVolumes, onDelete, updateMode }: PublicGitProps) => {
  const { t } = useTranslation('components/public-git');
  const navigate = useNavigate();

  const onDeleteVolume = (volume: ai.volume.Volume) => {
    onDelete(volume);
  };
  return (
    <>
      <h2>{t('publicGitTitle')}</h2>
      <p>{t('publicGitDescription')}</p>
      {updateMode && (
        <Button
          data-testid="add-public-git-button"
          size="sm"
          type="button"
          className="text-base"
          onClick={() => navigate('./add-public-git')}
        >
          {t('addPublicGitButton')}
        </Button>
      )}
      <GitList
        git={gitVolumes}
        deleteVol={(volume) => onDeleteVolume(volume)}
        allowUpdate={updateMode}
      />
      <Outlet />
    </>
  );
};

export default PublicGit;
