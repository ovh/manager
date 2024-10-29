import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {
  BaseLayout,
  Description,
  OvhSubsidiary,
  Subtitle,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_LINK_REFERRER_POLICY,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Errors from '@/components/Error/Error';
import Loading from '@/components/Loading/Loading.component';
import {
  OrderTile,
  OrderTileWrapper,
} from '@/components/Order/OrderTile.component';

import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import { useOrderCatalogHYCU } from '@/hooks/order/useOrderCatalogHYCU';
import useOrderHYCU from '@/hooks/order/useOrderHYCU';
import { subRoutes, urls } from '@/routes/routes.constant';
import { CONTACT_URL_BY_SUBSIDIARY } from '@/utils/contactList';
import { sortPacksByPrice } from '@/utils/sortPacks';
import { getRenewPrice } from '@/utils/getRenewPrice';

export default function EditPack() {
  const { serviceName } = useParams();
  const { t } = useTranslation('hycu/edit-pack');
  const { t: tCommon } = useTranslation('hycu');
  const { t: tError } = useTranslation('hycu/error');
  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const subsidiary = environment.getUser().ovhSubsidiary as OvhSubsidiary;
  const { data: serviceDetails, error } = useServiceDetails({
    resourceName: serviceName,
  });

  const [selectedPack, setSelectedPack] = useState<string>(null);
  const [isOrderInitiated, setIsOrderInitiated] = useState(false);
  const [currentPack, displayName] = useMemo(
    () => [
      serviceDetails?.data.billing.plan.code ?? null,
      serviceDetails?.data.resource.displayName ?? 'N/A',
    ],
    [serviceDetails],
  );

  const { data: orderCatalogHYCU, isLoading, isError } = useOrderCatalogHYCU(
    subsidiary,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );
  const { orderLink, redirectToOrder } = useOrderHYCU({
    planCode: selectedPack,
    region: subsidiary,
  });

  const header = {
    title: t('hycu_edit_pack_title'),
  };
  const description: string = t('hycu_edit_pack_description');

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: serviceName,
      label: serviceName,
    },
    {
      id: 'edit-pack',
      label: t('hycu_edit_pack_title'),
    },
  ];

  if (isError || error)
    return <Errors>{tError('manager_error_page_default')}</Errors>;

  if (isLoading) return <Loading />;

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      description={description}
      header={header}
    >
      {!isOrderInitiated ? (
        <>
          <Subtitle className="block mb-6">
            {t('hycu_edit_pack_subtitle', {
              displayName,
            })}
          </Subtitle>
          <Description className="mb-8">
            <Trans
              t={t}
              i18nKey="hycu_edit_pack_subtitle_description"
              components={{
                contact: (
                  <OsdsLink
                    color={ODS_THEME_COLOR_INTENT.primary}
                    href={CONTACT_URL_BY_SUBSIDIARY[subsidiary]}
                    target={OdsHTMLAnchorElementTarget._blank}
                  ></OsdsLink>
                ),
              }}
            ></Trans>
          </Description>
          <OrderTileWrapper>
            {sortPacksByPrice(orderCatalogHYCU?.plans).map((product) => (
              <OrderTile
                checked={product.planCode === selectedPack || undefined}
                disabled={product.planCode === currentPack || undefined}
                key={product.planCode}
                label={product.invoiceName}
                pricing={getRenewPrice(product.pricings)}
                subsidiary={subsidiary}
                onClick={() => {
                  setSelectedPack(product.planCode);
                }}
              ></OrderTile>
            ))}
          </OrderTileWrapper>
          <div className="flex flex-row">
            <OsdsButton
              className="mr-4"
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                navigate(
                  urls.dashboard.replace(subRoutes.serviceName, serviceName),
                );
              }}
              slot="actions"
              variant={ODS_BUTTON_VARIANT.ghost}
            >
              {tCommon('hycu_cta_cancel')}
            </OsdsButton>
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              disabled={(!selectedPack && !orderLink) || undefined}
              onClick={() => {
                setIsOrderInitiated(true);
                redirectToOrder();
              }}
              slot="actions"
            >
              {tCommon('hycu_cta_order')}
            </OsdsButton>
          </div>
        </>
      ) : (
        <>
          <OsdsTile className="mb-8">
            <span slot="start">
              <div className="flex flex-col gap-6 mb-6">
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('hycu_edit_pack_initiated_title')}
                </OsdsText>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._800}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('hycu_edit_pack_initiated_description')}
                </OsdsText>
                <OsdsLink
                  color={ODS_THEME_COLOR_INTENT.primary}
                  target={OdsHTMLAnchorElementTarget._blank}
                  referrerpolicy={
                    ODS_LINK_REFERRER_POLICY.strictOriginWhenCrossOrigin
                  }
                  href={orderLink}
                >
                  {orderLink}
                  <span slot="end">
                    <OsdsIcon
                      className="ml-4 cursor-pointer"
                      name={ODS_ICON_NAME.EXTERNAL_LINK}
                      size={ODS_ICON_SIZE.xs}
                      hoverable
                    ></OsdsIcon>
                  </span>
                </OsdsLink>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._800}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t('hycu_edit_pack_initiated_info')}
                </OsdsText>
              </div>
            </span>
          </OsdsTile>
          <OsdsButton
            inline
            size={ODS_BUTTON_SIZE.md}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              navigate(
                urls.dashboard.replace(subRoutes.serviceName, serviceName),
              );
            }}
          >
            {tCommon('hycu_cta_done')}
          </OsdsButton>
        </>
      )}
    </BaseLayout>
  );
}
