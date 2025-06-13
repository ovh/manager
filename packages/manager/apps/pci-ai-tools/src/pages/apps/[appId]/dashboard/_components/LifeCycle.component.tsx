import { useTranslation } from 'react-i18next';
import { Activity, ArrowUpRightFromSquare } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useAppData } from '../../App.context';
import AppStatusHistory from '@/components/status-history/app-status-history.component';
import A from '@/components/links/A.component';

const LifeCycle = () => {
  const { app } = useAppData();
  const { t } = useTranslation('ai-tools/apps/app/dashboard');
  return (
    <>
      <AppStatusHistory history={app.status.history} />
      <div className="flex flex-row gap-2 items-center mt-4 mb-2">
        <h5>{t('grafanaTitle')}</h5>
        <Activity className="size-4" />
      </div>
      <Button
        className="w-full"
        type="button"
        mode="outline"
        disabled={!app.status.monitoringUrl}
      >
        <A
          href={app.status.monitoringUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-row gap-1 items-center ">
            {t('grafanaButton')}
            <ArrowUpRightFromSquare className="size-4" />
          </div>
        </A>
      </Button>
    </>
  );
};

export default LifeCycle;
