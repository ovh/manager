import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';

import { Ipv4Order } from './Ipv4Order.component';
import { Ipv6Order } from './Ipv6Order.component';
import { OrderContextProvider } from './order.context';
import { IpVersionSection } from './sections/IpVersionSection.component';

export const OrderPage: React.FC = () => {
  const { t: tOrder } = useTranslation('order');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();
  const header = useHeader(tOrder('title'));

  return (
    <BaseLayout
      backLink={{
        label: tCommon('back_link'),
        onClick: () => {
          navigate(urls.listing);
        },
      }}
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
