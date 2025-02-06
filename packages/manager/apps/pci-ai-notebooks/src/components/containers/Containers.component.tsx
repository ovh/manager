import { useTranslation } from 'react-i18next';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import A from '@/components/links/A.component';
import { Button } from '@/components/ui/button';
import VolumesList from './VolumesListTable.component';
import * as ai from '@/types/cloud/project/ai';
import Guides from '@/components/guides/Guides.component';
import { GUIDES, GuideSections, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { isDataSync } from '@/lib/statusHelper';

interface ContainersProps {
  volumes: ai.volume.Volume[];
  status: string;
  onDataSync: (volume: ai.volume.Volume) => void;
}

const Containers = ({ volumes, status, onDataSync }: ContainersProps) => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { t } = useTranslation('components/containers');

  const onSyncData = (volume: ai.volume.Volume) => {
    onDataSync(volume);
  };

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('attachedDataTitle')}</h2>
        <Guides section={[GuideSections.data, GuideSections.registres]} />
      </div>
      <p>{t('attachedDataDescription')}</p>
      <A
        href={getGuideUrl(GUIDES.HOW_TO_MANAGE_DATA, locale)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex flex-row gap-1 items-center">
          <p>{t('attachedDataInfoLink')}</p>
          <ArrowUpRightFromSquare className="size-4" />
        </div>
      </A>
      <div className="flex flex-row gap-3 mt-2">
        <Button
          data-testid="general-data-sync-button"
          size="sm"
          type="button"
          className="text-base"
          onClick={() => navigate('./data-sync')}
          disabled={!isDataSync(status)}
        >
          {t('synchroniseDataButton')}
        </Button>
      </div>
      <VolumesList
        volumes={volumes}
        volStatus={status}
        dataSync={(volume) => onSyncData(volume)}
      />
      <Outlet />
    </>
  );
};

export default Containers;
