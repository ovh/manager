import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  ArrowUpRightFromSquare,
  Globe,
  LockKeyhole,
  NotebookText,
  OctagonX,
  PlayIcon,
  RefreshCcw,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Skeleton } from '@datatr-ux/uxlib';
import ai from '@/types/AI';
import NotebookStatusBadge from '../../_components/NotebookStatusBadge.component';
import A from '@/components/links/A.component';
import StartNotebook from './StartNotebook.component';
import StopNotebook from './StopNotebook.component';
import { isDeletingNotebook, isRunningNotebook } from '@/lib/statusHelper';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';
import RestartNotebook from '@/pages/notebooks/[notebookId]/_components/RestartNotebook.component';

export const NotebookHeader = ({
  notebook,
}: {
  notebook: ai.notebook.Notebook;
}) => {
  const { t } = useTranslation('ai-tools/notebooks/notebook');
  const { t: tstatus } = useTranslation('ai-tools/notebooks');
  const { t: tRegions } = useTranslation('regions');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isRestartOpen, setIsRestartOpen] = useState(false);
  const [isStopOpen, setIsStopOpen] = useState(false);
  const isAutoRestart = notebook.spec.timeoutAutoRestart;
  const dateLocale = useDateFnsLocale();
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
                <div className="flex flex-row gap-2 items-center">
                  <Button
                    data-testid="open-stop-modal-button"
                    type="button"
                    title={tstatus('tableActionStop')}
                    variant="destructive"
                    className="h-8 w-8 rounded-full p-1"
                    onClick={() => setIsStopOpen(true)}
                  >
                    <Square className="size-3 fill-white" />
                  </Button>
                  <Button
                    data-testid="open-restart-modal-button"
                    type="button"
                    title={tstatus('tableActionRestart')}
                    variant="primary"
                    className="h-8 w-8 rounded-full p-1"
                    onClick={() => setIsRestartOpen(true)}
                  >
                    <RefreshCcw size={18} />
                  </Button>
                </div>
              ) : (
                <Button
                  data-testid="open-start-modal-button"
                  type="button"
                  variant="primary"
                  title={tstatus('tableActionStart')}
                  className="h-8 w-8 rounded-full p-1"
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
              className="capitalize flex flex-row gap-1 items-center h-6 rounded-md px-2.5 py-0.5 text-xs"
              type="button"
              variant="primary"
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
            {notebook.status.lastJobStatus.timeoutAt && (
              <Badge variant="outline">
                <div className=" bottom-0 right-0 flex items-center gap-2 ">
                  {isAutoRestart ? (
                    <>
                      <RefreshCcw className="size-3" />
                      <span>
                        {t('restartLabel')}
                        {format(
                          notebook.status.lastJobStatus.timeoutAt,
                          'PPpp',
                          { locale: dateLocale },
                        )}
                      </span>
                    </>
                  ) : (
                    <>
                      <OctagonX className="size-3" />
                      <span>
                        {t('shutdownLabel')}
                        {format(
                          notebook.status.lastJobStatus.timeoutAt,
                          'PPpp',
                          { locale: dateLocale },
                        )}
                      </span>
                    </>
                  )}
                </div>
              </Badge>
            )}
            <Badge variant="outline">{notebook.spec.env.frameworkId}</Badge>
            <Badge variant="outline">
              {notebook.spec.env.frameworkVersion}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {tRegions(`region_${notebook.spec.region}`)}
            </Badge>
            <Badge className="capitalize" variant="outline">
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
          trackingCategory="dashboard"
        />
      )}
      {isRestartOpen && (
        <RestartNotebook
          notebook={notebook}
          onSuccess={() => setIsRestartOpen(false)}
          onClose={() => setIsRestartOpen(false)}
          trackingCategory="dashboard"
        />
      )}
      {isStopOpen && (
        <StopNotebook
          notebook={notebook}
          onSuccess={() => setIsStopOpen(false)}
          onClose={() => setIsStopOpen(false)}
          trackingCategory="dashboard"
        />
      )}
    </>
  );
};

NotebookHeader.Skeleton = function NotebookHeaderSkeleton() {
  const { t } = useTranslation('ai-tools/notebooks/notebook');
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
