import React, { Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { AclDatagrid } from '@/pages/dashboard/Acl/components/AclDatagrid.component';

const AclPage: React.FC = () => {
  const { t } = useTranslation('acl');

  return (
    <>
      <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-3 md:items-start md:gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <Text preset="paragraph">{t('acl:description')}</Text>
          <AclDatagrid />
        </div>
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
};

export default AclPage;
