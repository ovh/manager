import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  BaseLayout,
  OvhSubsidiary,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Error from '@/components/Error/Error';
import OrderConfirmation from '@/components/Order/OrderConfirmation';
import PackSelection from '@/components/Order/PackSelection';
import useOrderHYCU from '@/hooks/order/useOrderHYCU';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { subRoutes, urls } from '@/routes/routes.constant';

export default function Edit() {
  const { serviceName } = useParams();
  const { t } = useTranslation('hycu/edit');
  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const subsidiary: OvhSubsidiary = environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;
  const { data: serviceDetails, error } = useServiceDetails({
    resourceName: serviceName,
  });

  const header = {
    title: t('hycu_edit_title'),
  };
  const description: string = t('hycu_edit_description');

  const [selectedPack, setSelectedPack] = useState<string>(null);
  const [isOrderInitiated, setIsOrderInitiated] = useState(false);

  useEffect(() => {
    setSelectedPack(serviceDetails?.data.billing.plan.code);
  }, [serviceDetails]);

  const { orderLink, redirectToOrder } = useOrderHYCU({
    planCode: selectedPack,
    region: subsidiary,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: serviceName,
      label: serviceName,
    },
    {
      id: 'edit',
      label: t('hycu_edit_title'),
    },
  ];

  if (error) return <Error error={error} />;

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      description={description}
      header={header}
    >
      {!isOrderInitiated ? (
        <PackSelection
          orderLink={orderLink}
          orderDisabled={
            selectedPack === serviceDetails?.data.billing.plan.code
          }
          subsidiary={subsidiary}
          selectedPack={selectedPack}
          onClickCancel={() => {
            navigate(
              urls.dashboard.replace(subRoutes.serviceName, serviceName),
            );
          }}
          selectPack={(pack) => setSelectedPack(pack)}
          setOrderInitiated={() => {
            setIsOrderInitiated(true);
            redirectToOrder();
          }}
        ></PackSelection>
      ) : (
        <OrderConfirmation
          description={t('hycu_edit_initiated_description')}
          doneLabel={t('hycu_edit_initiated_cta_done')}
          info={t('hycu_edit_initiated_info')}
          orderLink={orderLink}
          title={t('hycu_edit_initiated_title')}
          onClickDone={() => {
            navigate(
              urls.dashboard.replace(subRoutes.serviceName, serviceName),
            );
          }}
        ></OrderConfirmation>
      )}
    </BaseLayout>
  );
}
