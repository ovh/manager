import { Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Settings2 } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import BillingSupport from '@/components/biling-support/BillingSupport.component';
import Configuration from './_components/Configuration.component';

const Dashboard = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift');

  return (
    <>
      <h2>{t('settingsTitle')}</h2>
      <div className="flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr gap-2">
        <Card>
          <BillingSupport />
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <Settings2 className="inline size-4 mr-2 mb-1" />
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

export default Dashboard;
