import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import {
  getListingIceberg,
  getListingIcebergQueryKey,
  useOrderPollingStatus,
  getDeliveringOrderList,
  OrderDescription,
  getDeliveringOrderQueryKey,
} from '@/api';
import { Datagrid } from '@/components/listing/DataGrid';
import { BreadcrumbHandleParams } from '@/components/Breadcrumb';
import { PageLayout } from '@/components/layout-helpers';
import { ApiError, ErrorPage } from '@/components/Error';
import { DeliveringMessages } from '@/components/listing/DeliveringMessages';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.id;
}

export default function ListingPage() {
  const { t } = useTranslation('vrack-services/listing');
  const navigate = useNavigate();

  const {
    data: vrackServicesDeliveringOrders,
    isLoading: areOrdersLoading,
  } = useQuery({
    queryKey: getDeliveringOrderQueryKey(OrderDescription.vrackServices),
    queryFn: getDeliveringOrderList(OrderDescription.vrackServices),
  });

  useOrderPollingStatus({
    pollingKey: OrderDescription.vrackServices,
    orderList: vrackServicesDeliveringOrders,
    queryToInvalidateOnDelivered: getListingIcebergQueryKey,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: getListingIcebergQueryKey,
    queryFn: getListingIceberg,
  });

  if (error) {
    return <ErrorPage error={error as ApiError} />;
  }

  if (
    !isLoading &&
    !areOrdersLoading &&
    data?.data.length === 0 &&
    vrackServicesDeliveringOrders?.length === 0
  ) {
    return <Navigate to="onboarding" />;
  }

  return (
    <PageLayout>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._600}
        className="block mt-7 mb-5"
      >
        {t('title')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block mb-8"
      >
        {t('description')}
      </OsdsText>
      <OsdsButton
        className="mb-8"
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
        onClick={() => navigate('create', { replace: true })}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            navigate('create', { replace: true });
          }
        }}
      >
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.ADD}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
        {t('createVrackServicesButtonLabel')}
      </OsdsButton>

      {vrackServicesDeliveringOrders?.length > 0 && (
        <DeliveringMessages
          message={t('deliveringVrackServicesMessage')}
          orders={vrackServicesDeliveringOrders}
        />
      )}
      {(isLoading || areOrdersLoading) && (
        <div>
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      )}
      {!isLoading && !areOrdersLoading && data.data.length > 0 && (
        <Datagrid data={data.data} />
      )}
      {!isLoading && !areOrdersLoading && data.data.length === 0 && (
        <OsdsText
          className="block"
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.subheading}
        >
          {t('emptyDataGrid')}
        </OsdsText>
      )}
    </PageLayout>
  );
}
