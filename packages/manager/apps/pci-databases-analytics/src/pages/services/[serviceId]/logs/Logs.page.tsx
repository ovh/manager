import { LogProvider, LogsView } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { useServiceData } from '../Service.context';
import { GuideSections } from '@/types/guide';
import Guides from '@/components/guides/Guides.component';

const Logs = () => {
  const { t } = useTranslation('pci-databases-analytics/services/service/logs');
  const { projectId, service } = useServiceData();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.logs} engine={service.engine} />
      </div>
      <p>{t('description')}</p>
      <div className="[&>div]:md:!h-auto">
        <LogProvider
          logsApiURL={`/cloud/project/${projectId}/database/${service.engine}/${service.id}/log`}
          logsKeys={['message']}
          logsKind="customer_logs"
        >
          <LogsView onGotoStreams={() => navigate('./streams')} />
        </LogProvider>
      </div>
      <Outlet />
    </>
  );
};

export default Logs;
