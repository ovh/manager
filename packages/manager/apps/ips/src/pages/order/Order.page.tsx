import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/manager-react-components';

import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';

import { Ipv4Order } from './Ipv4Order.component';
import { Ipv6Order } from './Ipv6Order.component';
import { OrderContextProvider } from './order.context';
import { IpVersionSection } from './sections/IpVersionSection.component';
import { TRANSLATION_NAMESPACES } from '@/utils';

export const OrderPage: React.FC = () => {
  const { t: tOrder } = useTranslation(TRANSLATION_NAMESPACES.order);
  const { t: tCommon } = useTranslation(TRANSLATION_NAMESPACES.common);
  const navigate = useNavigate();
  const header = useHeader(tOrder('title'));

  return (
    <BaseLayout
      backLinkLabel={tCommon('back_link')}
      onClickReturn={() => {
        navigate(urls.listing);
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
