import { useTranslation } from 'react-i18next';
import { H2 } from '@/components/typography';
import { useServiceData } from '../layout';
import { database } from '@/models/database';
import CurrentQueries from './_components/currentQueries';
import QueryStatistics from './_components/queryStatistics';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';

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
      <H2 className="mb-2">{t('title')}</H2>
      {service.capabilities.currentQueries?.read ===
        database.service.capability.StateEnum.enabled && <CurrentQueries />}
      {service.capabilities.queryStatistics?.read ===
        database.service.capability.StateEnum.enabled && <QueryStatistics />}
    </>
  );
};

export default Queries;
