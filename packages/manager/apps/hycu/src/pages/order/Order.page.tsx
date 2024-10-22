import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BaseLayout, OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import OrderConfirmation from '@/components/Order/OrderConfirmation';
import PackSelection from '@/components/Order/PackSelection';
import useOrderHYCU from '@/hooks/order/useOrderHYCU';

export default function Order() {
  const { t } = useTranslation('hycu/order');

  const { environment } = useContext(ShellContext);
  const subsidiary: OvhSubsidiary = environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;

  const header = {
    title: t('hycu_order_title'),
  };
  const description: string = t('hycu_order_description');

  const [selectedPack, setSelectedPack] = useState<string>(null);
  const [isOrderInitiated, setIsOrderInitiated] = useState(false);

  const { orderLink, redirectToOrder } = useOrderHYCU({
    planCode: selectedPack,
    region: subsidiary,
  });

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      description={description}
      header={header}
    >
      {!isOrderInitiated ? (
        <PackSelection
          orderLink={orderLink}
          subsidiary={subsidiary}
          selectPack={(pack) => setSelectedPack(pack)}
          selectedPack={selectedPack}
          setOrderInitiated={() => {
            setIsOrderInitiated(true);
            redirectToOrder();
          }}
        ></PackSelection>
      ) : (
        <OrderConfirmation orderLink={orderLink}></OrderConfirmation>
      )}
    </BaseLayout>
  );
}
