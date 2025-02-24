import { useTranslation } from 'react-i18next';
import {
  AppWindowIcon,
  ArrowUpRightFromSquare,
  Globe,
  LockKeyhole,
  PlayIcon,
  Square,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import * as ai from '@/types/cloud/project/ai';
import { Button } from '@/components/ui/button';
import AppStatusBadge from '../../_components/AppStatusBadge.component';
import StartApp from './StartApp.component';
import StopApp from './StopApp.component';
import { isDeletingApp, isRunningApp } from '@/lib/statusHelper';
import A from '@/components/links/A.component';

export const AppHeader = ({ app }: { app: ai.app.App }) => {
  const { t } = useTranslation('pci-ai-deploy/apps/app');
  const { t: tRegions } = useTranslation('regions');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isStopOpen, setIsStopOpen] = useState(false);
  return (
    <>
      <div
        data-testid="app-header-container"
        className="flex gap-2 items-center mt-4 mb-6"
      >
        <div className="rounded-full bg-gradient-to-tr from-primary to-slate-50 text-white p-2">
          <AppWindowIcon width={40} height={40} />
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-3">
            <h2>{app.spec.name ?? 'Dashboard'}</h2>
            <div>
              {isRunningApp(app.status.state) ||
              isDeletingApp(app.status.state) ? (
                <Button
                  type="button"
                  size="roundedIcon"
                  className="bg-red-400 hover:bg-red-600"
                  onClick={() => setIsStopOpen(true)}
                >
                  <Square className="size-3 fill-white" />
                </Button>
              ) : (
                <Button
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
            <AppStatusBadge status={app.status.state} />
            <Button
              className="font-semibold flex flex-row gap-1 items-center"
              type="button"
              size="badge"
              disabled={app.status.state !== ai.app.AppStateEnum.RUNNING}
            >
              <A
                href={app.status.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-row gap-1 items-center text-white">
                  {t('accessAppButton')}
                  <ArrowUpRightFromSquare className="size-3" />
                </div>
              </A>
            </Button>
            <Badge variant={'outline'}>{app.spec.image}</Badge>
            <Badge variant={'outline'} className="capitalize">
              {tRegions(`region_${app.spec.region}`)}
            </Badge>
            <Badge variant={'outline'}>
              {app.spec.unsecureHttp ? (
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
        <StartApp
          app={app}
          onSuccess={() => setIsStartOpen(false)}
          onClose={() => setIsStartOpen(false)}
        />
      )}
      {isStopOpen && (
        <StopApp
          app={app}
          onSuccess={() => setIsStopOpen(false)}
          onClose={() => setIsStopOpen(false)}
        />
      )}
    </>
  );
};

AppHeader.Skeleton = function AppHeaderSkeleton() {
  const { t } = useTranslation('pci-ai-training/apps/app');
  return (
    <div className="flex gap-2 items-center mt-4 mb-6">
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
