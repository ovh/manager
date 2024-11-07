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

export const NotebookHeader = ({
  notebook,
}: {
  notebook: ai.notebook.Notebook;
}) => {
  const { t } = useTranslation('regions');
  return (
    <div
      data-testid="notebook-header-container"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
        <NotebookText width={40} height={40} />
      </div>
      <div className="w-full">
        <div className="flex flex-row  items-center gap-8">
          <h2>{notebook.spec.name ?? 'Dashboard'}</h2>
          <div className="flex flex-row gap-2">
            <Button type="button" size="roundedIcon">
              <PlayIcon className="size-4 ml-1 fill-white" />
            </Button>
            <Button type="button" size="roundedIcon" className="bg-red-400">
              <Square className="size-4 fill-white" />
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
