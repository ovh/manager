import React from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';

import { ByoipContextProvider } from './Byoip.context';
import { ByoipOrder } from './ByoipOrder.component';

export const ByoipPage: React.FC = () => {
  const { t: tByoip } = useTranslation('byoip');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const header = useHeader(tByoip('title'));

  return (
    <BaseLayout
      backLinkLabel={tCommon('back_link')}
      onClickReturn={() => {
        navigate(urls.listing);
      }}
      header={header}
      breadcrumb={<Breadcrumb />}
      description={tByoip('description')}
    >
      <ByoipContextProvider>
        <ByoipOrder />
        <Outlet />
      </ByoipContextProvider>
    </BaseLayout>
  );
};

export default ByoipPage;
