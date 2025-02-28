import { useTranslation } from 'react-i18next';
import {
  ArrowUpRightFromSquare,
  Globe,
  LockKeyhole,
  NotebookText,
  PlayIcon,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import NotebookStatusBadge from '../../_components/NotebookStatusBadge.component';
import { Button } from '@/components/ui/button';
import A from '@/components/links/A.component';
import StartNotebook from './StartNotebook.component';
import StopNotebook from './StopNotebook.component';
import { isDeletingNotebook, isRunningNotebook } from '@/lib/statusHelper';

export const NotebookHeader = ({
  notebook,
}: {
  notebook: ai.notebook.Notebook;
}) => {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
  const { t: tRegions } = useTranslation('regions');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isStopOpen, setIsStopOpen] = useState(false);
  return (
    <>
      <div
        data-testid="notebook-header-container"
        className="flex gap-2 items-center mt-4 mb-6"
      >
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <NotebookText width={40} height={40} />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{notebook.spec.name ?? 'Dashboard'}</h2>
            <div>
              {isRunningNotebook(notebook.status.state) ||
              isDeletingNotebook(notebook.status.state) ? (
                <Button
                  data-testid="open-stop-modal-button"
                  type="button"
                  size="roundedIcon"
                  className="bg-red-400 hover:bg-red-600"
                  onClick={() => setIsStopOpen(true)}
                >
                  <Square className="size-3 fill-white" />
                </Button>
              ) : (
                <Button
                  data-testid="open-start-modal-button"
                  type="button"
                  size="roundedIcon"
                  onClick={() => setIsStartOpen(true)}
                >
                  <PlayIcon className="size-3 fill-white mx-auto" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <NotebookStatusBadge status={notebook.status.state} />

            <Button
              className="capitalize font-semibold flex flex-row gap-1 items-center"
              type="button"
              size="badge"
              disabled={
                notebook.status.state !== ai.notebook.NotebookStateEnum.RUNNING
              }
            >
              <A
                href={notebook.status.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-row gap-1 items-center text-white capitalize">
                  {notebook.spec.env.editorId}
                  <ArrowUpRightFromSquare className="size-3" />
                </div>
              </A>
            </Button>
            <Badge variant={'outline'} className="capitalize">
              {notebook.spec.env.frameworkId}
            </Badge>
            <Badge variant={'outline'}>
              {notebook.spec.env.frameworkVersion}
            </Badge>
            <Badge variant={'outline'} className="capitalize">
              {tRegions(`region_${notebook.spec.region}`)}
            </Badge>
            <Badge variant={'outline'}>
              {notebook.spec.unsecureHttp ? (
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
      {isStartOpen && (
        <StartNotebook
          notebook={notebook}
          onSuccess={() => setIsStartOpen(false)}
          onClose={() => setIsStartOpen(false)}
        />
      )}
      {isStopOpen && (
        <StopNotebook
          notebook={notebook}
          onSuccess={() => setIsStopOpen(false)}
          onClose={() => setIsStopOpen(false)}
        />
      )}
    </>
  );
};

NotebookHeader.Skeleton = function NotebookHeaderSkeleton() {
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook');
  return (
    <div
      data-testid="notebook-header-skeleton"
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
