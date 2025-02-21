import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { IpVersionSection } from './sections/IpVersionSection.component';
import { OrderContextProvider } from './order.context';
import { Ipv4Order } from './Ipv4Order.component';

export const OrderPage: React.FC = () => {
  const { t } = useTranslation('order');
  const navigate = useNavigate();

  return (
    <BaseLayout
      backLinkLabel={t('back_link')}
      onClickReturn={() => navigate(urls.listing)}
      header={{
        title: t('title'),
      }}
      breadcrumb={<Breadcrumb />}
    >
      <OrderContextProvider>
        <IpVersionSection />
        <Ipv4Order />
      </OrderContextProvider>
    </BaseLayout>
  );
};

export default OrderPage;
