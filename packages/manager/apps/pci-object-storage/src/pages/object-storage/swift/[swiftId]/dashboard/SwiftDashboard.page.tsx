import { Card, CardContent, CardHeader, Skeleton } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Globe2, Settings2 } from 'lucide-react';
import { Outlet, useParams } from 'react-router-dom';
import { useSwiftData } from '../Swift.context';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import InformationsDetails from './_components/InformationsDetails.component';
import Guides from '@/components/guides/Guides.component';
import BillingSupport from '@/components/biling-support/BillingSupport.component';
import Configuration from './_components/Configuration.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

const breadcrumb = () => (
  <BreadcrumbItem
    translationKey="dashboardTab"
    namespace="pci-object-storage/storages/header-tabs"
  />
);

const SwiftDashboard = () => {
  const { swift } = useSwiftData();
  const { swiftId } = useParams();
  const { regions } = useObjectStorageData();
  const { t } = useTranslation('pci-object-storage/storages/swift');

  if (!regions) return <SwiftDashboard.Skeleton />;
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('dashboardTitle')}</h2>
        <Guides selectors={['swift']} />
      </div>
      <Card className="w-full">
        <CardHeader>
          <h5>
            <Globe2 className="size-4 inline mr-2" />
            <span>{t('informationTitle')}</span>
          </h5>
        </CardHeader>
        <CardContent>
          <InformationsDetails
            swift={swift}
            region={regions?.find((reg) => reg.name === swift.region)}
            swiftId={swiftId}
          />
        </CardContent>
      </Card>
      <div className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2">
        <Card>
          <BillingSupport />
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <Settings2 className="inline size-4 mr-2" />
              {t('configurationTitle')}
            </h4>
          </CardHeader>
          <CardContent>
            <Configuration />
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

SwiftDashboard.Skeleton = () => {
  return (
    <>
      <h2>Dashboard</h2>
      <div className="flex space-x-4">
        <Skeleton className="w-full h-[200px]" />
      </div>
    </>
  );
};

export { breadcrumb };
export default SwiftDashboard;
