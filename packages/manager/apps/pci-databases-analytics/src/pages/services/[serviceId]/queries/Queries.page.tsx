import { useTranslation } from 'react-i18next';
import { useServiceData } from '../Service.context';
import * as database from '@/types/cloud/project/database';
import CurrentQueries from './_components/CurrentQueries.component';
import QueryStatistics from './_components/QueryStatistics.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/queries"
    />
  );
}

const Queries = () => {
  const { service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/queries',
  );
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('title')}</h2>
        <Guides section={GuideSections.queries} engine={service.engine} />
      </div>
      {service.capabilities.currentQueries?.read ===
        database.service.capability.StateEnum.enabled && <CurrentQueries />}
      {service.capabilities.queryStatistics?.read ===
        database.service.capability.StateEnum.enabled && <QueryStatistics />}
    </>
  );
};

export default Queries;
