import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuitIcon,
  Globe,
  LockKeyhole,
  Repeat1Icon,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Skeleton } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import JobStatusBadge from '../../_components/JobStatusBadge.component';
import KillJob from './KillJob.component';
import RestartJob from './RestartJob.component';
import { isStoppedJob } from '@/lib/statusHelper';

export const JobHeader = ({ job }: { job: ai.job.Job }) => {
  const { t } = useTranslation('ai-tools/jobs/job');
  const naviage = useNavigate();
  const { t: tRegions } = useTranslation('regions');
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isStopOpen, setIsStopOpen] = useState(false);
  return (
    <>
      <div
        data-testid="job-header-container"
        className="flex gap-2 items-center mt-4 mb-6"
      >
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <BrainCircuitIcon width={40} height={40} />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{job.spec.name ?? 'Dashboard'}</h2>
            <div className="flex flex-row gap-2 items-center">
              {!isStoppedJob(job.status.state) && (
                <Button
                  data-testid="open-stop-modal-button"
                  type="button"
                  variant="destructive"
                  className="h-8 w-8 rounded-full p-1"
                  onClick={() => setIsStopOpen(true)}
                >
                  <Square className="size-3 fill-white" />
                </Button>
              )}
              <Button
                data-testid="open-restart-modal-button"
                type="button"
                variant="primary"
                className="h-8 w-8 rounded-full p-1"
                onClick={() => setIsRestartOpen(true)}
              >
                <Repeat1Icon className="size-3 fill-white mx-auto" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <JobStatusBadge status={job.status.state} />
            <Badge variant="outline">{job.spec.image}</Badge>

            <Badge variant="outline">
              {tRegions(`region_${job.spec.region}`)}
            </Badge>
            <Badge variant="outline">
              {job.spec.unsecureHttp ? (
                <div className="flex flex-row gap-1 items-center">
                  <span>{t('publicAccessLabel')}</span>
                  <Globe className="size-3" />
                </div>
              ) : (
                <div className="flex flex-row gap-1 items-center">
                  <span>{t('privateAccessLabel')}</span>
                  <LockKeyhole className="size-3" />
                </div>
              )}
            </Badge>
          </div>
        </div>
      </div>
      {isRestartOpen && (
        <RestartJob
          job={job}
          onSuccess={(newJob) => {
            setIsRestartOpen(false);
            naviage(`../${newJob.id}`);
          }}
          onClose={() => setIsRestartOpen(false)}
        />
      )}
      {isStopOpen && (
        <KillJob
          job={job}
          onSuccess={() => setIsStopOpen(false)}
          onClose={() => setIsStopOpen(false)}
        />
      )}
    </>
  );
};

JobHeader.Skeleton = function JobHeaderSkeleton() {
  const { t } = useTranslation('ai-tools/jobs/job');
  return (
    <div
      data-testid="job-header-skeleton"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>{t('dashboardTab')}</h2>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
};
