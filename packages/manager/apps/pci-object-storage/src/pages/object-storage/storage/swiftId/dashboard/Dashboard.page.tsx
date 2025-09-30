import { Card, CardContent, CardHeader, Skeleton } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Globe2, Settings2 } from 'lucide-react';
import { Outlet, useParams } from 'react-router-dom';
import { useSwiftData } from '../Swift.context';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import InformationsDetails from './_components/InformationsDetails.component';
import BillingSupport from '@/components/biling-support/BillingSupport.component';
import Configuration from './_components/Configuration.component';

const Dashboard = () => {
  const { swift } = useSwiftData();
  const { swiftId } = useParams();
  const { regions } = useObjectStorageData();
  const { t } = useTranslation('pci-object-storage/storages/swift');

  if (!regions) return <Dashboard.Skeleton />;
  return (
    <>
      <h2>{t('dashboardTitle')}</h2>
      <div className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2">
        <Card>
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
        <Card>
          <BillingSupport />
          <div className="border-t my-2 pt-2 mx-6"></div>
          <h4 className="px-6 mb-4">
            <Settings2 className="inline size-4 mr-2 mb-1" />
            {t('configurationTitle')}
          </h4>

          <CardContent>
            <Configuration />
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

Dashboard.Skeleton = function DashboardSkeleton() {
  return (
    <>
      <h2>Dashboard</h2>
      <div className="flex space-x-4">
        <Skeleton className="w-1/2 h-[200px]" />
        <Skeleton className="w-1/2 h-[200px]" />
      </div>
    </>
  );
};

export default Dashboard;
