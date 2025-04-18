import {
  DbaasLogsAccountSelector,
  StreamsList,
  TDbaasLog,
  LogProvider,
} from '@ovh-ux/manager-pci-common';
import {
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@datatr-ux/uxlib';
import { useLocation } from 'react-router-dom';
import { useServiceData } from '../Service.context';
import { GuideSections } from '@/types/guide';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import OvhLink from '@/components/links/OvhLink.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="streamsBreadcrumb"
      namespace="pci-databases-analytics/services/service/logs"
    />
  );
}
const Streams = () => {
  const [account, setAccount] = useState<TDbaasLog>();
  const { projectId, service } = useServiceData();
  const { t } = useTranslation('pci-databases-analytics/services/service/logs');
  const location = useLocation();
  const { clearNotifications } = useNotifications();

  useEffect(() => {
    clearNotifications();
  }, [location]);
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('streamsTitle')}</h2>
        <Guides section={GuideSections.logs} engine={service.engine} />
      </div>
      <Link to="../" className="flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t('streamsBackLink')}
      </Link>
      <p>{t('streamsDescription')}</p>
      <Button type="button" mode="outline" asChild>
        <OvhLink
          className="hover:no-underline"
          application="dedicated"
          path={`#/dbaas/logs/${account?.serviceName}/streams/add`}
        >
          <Plus className="w-4 h-4 mr-2" /> {t('streamsAdd')}
        </OvhLink>
      </Button>
      <LogProvider
        logsApiURL={`/cloud/project/${projectId}/database/${service.engine}/${service.id}/log`}
        logsKeys={['message']}
        logsKind="customer_logs"
      >
        <Notifications />
        <DbaasLogsAccountSelector
          account={account}
          onAccountChange={setAccount}
        />
        {account && (
          <div className="mt-4">
            <StreamsList account={account} serviceName={service.id} />
          </div>
        )}
      </LogProvider>
    </>
  );
};

export default Streams;
