import { useTranslation } from 'react-i18next';
import {
  NotebookText,
  Play,
  PlayCircle,
  PlayIcon,
  Square,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import NotebookStatusBadge from '../../_components/NotebookStatusBadge.component';
import { Button } from '@/components/ui/button';
import StartNotebook from './StartNotebook.component';
import { useModale } from '@/hooks/useModale';
import StopNotebook from './StopNotebook.component';
import { isDeletingNotebook, isRunningNotebook } from '@/lib/notebookHelper';

export const NotebookHeader = ({
  notebook,
}: {
  notebook: ai.notebook.Notebook;
}) => {
  const { t } = useTranslation('regions');
  const startModale = useModale('start');
  const stopModale = useModale('stop');
  return (
    <div
      data-testid="notebook-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
        <NotebookText width={40} height={40} />
      </div>
      <div className="w-full">
        <div className="flex flex-row  items-center gap-5">
          <h2>{notebook.spec.name ?? 'Dashboard'}</h2>
          <div className="flex flex-row gap-2">
            <Button
              type="button"
              size="roundedIcon"
              onClick={() => startModale.open()}
              disabled={
                isRunningNotebook(notebook.status.state) ||
                isDeletingNotebook(notebook.status.state)
              }
            >
              <PlayIcon className="size-3 fill-white" />
            </Button>
            <Button
              type="button"
              size="roundedIcon"
              className="bg-red-400 hover:bg-red-600"
              onClick={() => stopModale.open()}
              disabled={
                !isRunningNotebook(notebook.status.state) ||
                isDeletingNotebook(notebook.status.state)
              }
            >
              <Square className="size-3 fill-white" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <NotebookStatusBadge status={notebook.status.state} />
          <Badge variant={'outline'} className="capitalize">
            {notebook.spec.env.frameworkId}
          </Badge>
          <Badge variant={'outline'}>
            {notebook.spec.env.frameworkVersion}
          </Badge>
          <Badge variant={'outline'} className="capitalize">
            {t(`region_${notebook.spec.region}`)}
          </Badge>
          <Badge variant={'outline'} className="capitalize">
            {notebook.spec.env.editorId}
          </Badge>
        </div>
      </div>
      <StartNotebook
        controller={startModale.controller}
        notebook={notebook}
        onSuccess={() => {
          startModale.close();
        }}
      />
      <StopNotebook
        controller={stopModale.controller}
        notebook={notebook}
        onSuccess={() => {
          stopModale.close();
        }}
      />
    </div>
  );
};

NotebookHeader.Skeleton = function NotebookHeaderSkeleton() {
  return (
    <div className="flex gap-2 items-center mt-4 mb-6">
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
        <h2>Dashboard</h2>
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
