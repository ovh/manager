import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@datatr-ux/uxlib';
import { Plus } from 'lucide-react';
import GitList from './GitListTable.component';
import ai from '@/types/AI';

interface PublicGitProps {
  gitVolumes: ai.volume.Volume[];
  onDelete?: (volume: ai.volume.Volume) => void;
  updateMode: boolean;
}

const PublicGit = ({ gitVolumes, onDelete, updateMode }: PublicGitProps) => {
  const { t } = useTranslation('ai-tools/components/public-git');
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
          <Plus className="size-5" />
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
