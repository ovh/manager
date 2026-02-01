import React, { Suspense, useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Icon, ICON_NAME, Link, Card, CARD_COLOR } from '@ovhcloud/ods-react';
import {
  BaseLayout,
  OvhSubsidiary,
  Text,
  Button,
  TEXT_PRESET,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
} from '@ovh-ux/muk';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

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
import { urls } from '@/routes/routes.constant';
import { CONTACT_URL_BY_SUBSIDIARY } from '@/utils/contactList';
import { sortPacksByPrice } from '@/utils/sortPacks';
import { getRenewPrice } from '@/utils/getRenewPrice';
import { TRACKING } from '@/tracking.constant';

export default function Order() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation([
    'hycu/order',
    NAMESPACES.ACTIONS,
    NAMESPACES.ERROR,
  ]);
  const navigate = useNavigate();

  const { environment } = useContext(ShellContext);
  const subsidiary: OvhSubsidiary = environment.getUser()
    .ovhSubsidiary as OvhSubsidiary;

  const [selectedPack, setSelectedPack] = useState<string>(null);
  const [isOrderInitiated, setIsOrderInitiated] = useState(false);

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
    title: t('hycu_order_title'),
  };
  const description: string = t('hycu_order_description');

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id: 'order',
      label: t('hycu_order_title'),
    },
  ];

  if (isError)
    return <Errors>{t(`${NAMESPACES.ERROR}:error_loading_page`)}</Errors>;

  if (isLoading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <BaseLayout
        breadcrumb={<Breadcrumb items={breadcrumbItems} />}
        description={description}
        header={header}
      >
        {!isOrderInitiated ? (
          <>
            <Text preset={TEXT_PRESET.heading2} className="block mb-6">
              {t('hycu_order_subtitle')}
            </Text>
            <Text preset={TEXT_PRESET.paragraph} className="block mb-8">
              <Trans
                t={t}
                i18nKey="hycu_order_subtitle_description"
                components={{
                  contact: (
                    <Link
                      href={CONTACT_URL_BY_SUBSIDIARY[subsidiary]}
                      onClick={() => {
                        trackClick(TRACKING.order.goToSalesClick);
                      }}
                      target="blank"
                    ></Link>
                  ),
                }}
              ></Trans>
            </Text>
            <OrderTileWrapper>
              {sortPacksByPrice(orderCatalogHYCU?.plans).map((product) => (
                <OrderTile
                  checked={product.planCode === selectedPack || undefined}
                  key={product.planCode}
                  label={product.invoiceName}
                  pricing={getRenewPrice(product.pricings)}
                  subsidiary={subsidiary}
                  onClick={() => {
                    trackClick(
                      TRACKING.order.selectPackClick(product.planCode),
                    );
                    setSelectedPack(product.planCode);
                  }}
                ></OrderTile>
              ))}
            </OrderTileWrapper>
            <div className="flex flex-row">
              <Button
                className="mr-4"
                color={BUTTON_COLOR.primary}
                onClick={() => {
                  trackClick(TRACKING.order.cancelClick(selectedPack));
                  navigate(urls.listing);
                }}
                variant={BUTTON_VARIANT.ghost}
              >
                {t(`${NAMESPACES.ACTIONS}:cancel`)}
              </Button>
              <Button
                color={BUTTON_COLOR.primary}
                disabled={(!selectedPack && !orderLink) || undefined}
                onClick={() => {
                  trackClick(TRACKING.order.orderClick(selectedPack));
                  setIsOrderInitiated(true);
                  redirectToOrder();
                }}
              >
                {t(`${NAMESPACES.ACTIONS}:order`)}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card className="mb-8 p-4" color={CARD_COLOR.neutral}>
              <span slot="start">
                <div className="flex flex-col gap-6 mb-6">
                  <Text preset={TEXT_PRESET.heading2}>
                    {t('hycu_order_initiated_title')}
                  </Text>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t('hycu_order_initiated_description')}
                  </Text>
                  <Link
                    className="w-full"
                    target="blank"
                    referrer-policy="strict-origin-cross-origin"
                    href={orderLink}
                  >
                    <div className="inline-flex items-center">
                      {orderLink}
                      <Icon
                        className="ml-4 cursor-pointer"
                        name={ICON_NAME.externalLink}
                        aria-hidden="true"
                      ></Icon>
                    </div>
                  </Link>
                  <Text preset={TEXT_PRESET.span}>
                    {t('hycu_order_initiated_info')}
                  </Text>
                </div>
              </span>
            </Card>
            <Button
              size={BUTTON_SIZE.md}
              color={BUTTON_COLOR.primary}
              onClick={() => {
                navigate(urls.listing);
              }}
            >
              {t(`${NAMESPACES.ACTIONS}:end`)}
            </Button>
          </>
        )}
      </BaseLayout>
    </Suspense>
  );
}
