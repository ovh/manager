import { useTranslation } from 'react-i18next';
import { ArrowUpRightFromSquare } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import A from '@/components/links/A.component';
import { Button } from '@/components/ui/button';
import VolumesList from './_components/VolumesListTable.component';
import * as ai from '@/types/cloud/project/ai';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { GUIDES, GuideSections, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import { useJobData } from '../Job.context';
import { isDataSyncJob } from '@/lib/jobHelper';
import JobStatusBadge from '../../_components/JobStatusBadge.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-ai-training/jobs/job/containers"
    />
  );
}

const Containers = () => {
  const { job } = useJobData();
  const locale = useLocale();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-ai-training/jobs/job/containers');
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
      {!isDataSyncJob(job.status.state) && (
        <>
          <div className="flex flex-row gap-2">
            <p>{t('synchDataButtonHelper1')}</p>
            <JobStatusBadge status={ai.job.JobStateEnum.RUNNING} />
          </div>
          <div className="flex flex-row gap-2">
            <p>{t('synchDataButtonHelper2')}</p>
            <JobStatusBadge status={ai.job.JobStateEnum.SYNC_FAILED} />
          </div>
        </>
      )}
      <div className="flex flex-row gap-3 mt-2">
        <Button
          data-testid="general-data-sync-button"
          size="sm"
          type="button"
          className="text-base"
          onClick={() => navigate('./data-sync')}
          disabled={!isDataSyncJob(job.status.state)}
        >
          {t('synchroniseDataButton')}
        </Button>
      </div>
      <VolumesList
        volumes={job.spec.volumes.filter(
          (vol: ai.volume.Volume) => vol.volumeSource.dataStore,
        )}
      />
      <Outlet />
    </>
  );
};

export default Containers;
