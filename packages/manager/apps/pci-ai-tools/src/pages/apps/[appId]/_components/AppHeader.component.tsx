import { useTranslation } from 'react-i18next';
import {
  AppWindowIcon,
  ArrowUpRightFromSquare,
  Globe,
  LockKeyhole,
  PlayIcon,
  Square,
} from 'lucide-react';
import { Badge, Button, Skeleton } from '@datatr-ux/uxlib';
import { useState } from 'react';
import ai from '@/types/AI';
import AppStatusBadge from '../../_components/AppStatusBadge.component';
import StartApp from './StartApp.component';
import StopApp from './StopApp.component';
import { isDeletingApp, isRunningApp } from '@/lib/statusHelper';
import A from '@/components/links/A.component';

export const AppHeader = ({ app }: { app: ai.app.App }) => {
  const { t } = useTranslation('ai-tools/apps/app');
  const { t: tRegions } = useTranslation('regions');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isStopOpen, setIsStopOpen] = useState(false);
  const classNameBagde =
    'capitalize text-text rounded-md text-sm bg-transparent font-semibold border border-neutral-100 px-2.5 py-0.5 h-6';
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
                  data-testid="open-stop-modal-button"
                  type="button"
                  variant="destructive"
                  className="h-8 w-8 rounded-full p-1"
                  onClick={() => setIsStopOpen(true)}
                >
                  <Square className="size-3 fill-white" />
                </Button>
              ) : (
                <Button
                  data-testid="open-start-modal-button"
                  className="h-8 w-8 rounded-full p-1"
                  type="button"
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
              className="capitalize font-semibold flex flex-row gap-1 items-center h-6 rounded-md px-2.5 py-0.5 text-sm"
              type="button"
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
            <Badge className={classNameBagde}>{app.spec.image}</Badge>
            <Badge className={classNameBagde}>
              {tRegions(`region_${app.spec.region}`)}
            </Badge>
            <Badge className={classNameBagde}>
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
  return (
    <div
      data-testid="app-header-skeleton"
      className="flex gap-2 items-center mt-4 mb-6"
    >
      <Skeleton className="rounded-full h-14 w-14" />
      <div>
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
