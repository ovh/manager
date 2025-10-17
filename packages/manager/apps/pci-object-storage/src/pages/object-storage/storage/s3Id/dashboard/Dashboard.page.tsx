import { Card, CardContent, CardHeader } from '@datatr-ux/uxlib';
import { Archive, Tag } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BucketOverview from './_components/BucketOverview.components';
import Tags from './_components/Tags.component';
import Guides from '@/components/guides/Guides.component';

const Dashboard = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('dashboardTitle')}</h2>
        <Guides />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h4>
              <Archive className="size-4 inline mr-2" />
              <span>{t('overviewTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <BucketOverview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h4>
              <Tag className="size-4 inline mr-2" />
              <span>{t('tagsTitle')}</span>
            </h4>
          </CardHeader>
          <CardContent>
            <Tags />
          </CardContent>
        </Card>
      </div>
      <Outlet />
    </>
  );
};

export default Dashboard;
