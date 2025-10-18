import React from 'react';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { IpVersionSection } from './sections/IpVersionSection.component';
import { OrderContextProvider } from './order.context';
import { Ipv4Order } from './Ipv4Order.component';
import { Ipv6Order } from './Ipv6Order.component';
import { useHeader } from '@/components/Header/Header';

export const OrderPage: React.FC = () => {
  const { t: tOrder } = useTranslation('order');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const header = useHeader(tOrder('title'));

  return (
    <BaseLayout
      backLinkLabel={tCommon('back_link')}
      onClickReturn={() => navigate(urls.listing)}
      header={header}
      breadcrumb={<Breadcrumb />}
    >
      <OrderContextProvider>
        <IpVersionSection />
        <Ipv4Order />
        <Ipv6Order />
      </OrderContextProvider>
    </BaseLayout>
  );
};

export default OrderPage;
