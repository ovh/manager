import React, { useContext, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Link, Icon, ICON_NAME, Card, CARD_COLOR } from '@ovhcloud/ods-react';
import {
  BaseLayout,
  OvhSubsidiary,
  Text,
  Button,
  TEXT_PRESET,
  BUTTON_COLOR,
  BUTTON_VARIANT,
} from '@ovh-ux/muk';
import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
import { subRoutes, urls } from '@/routes/routes.constant';
import { CONTACT_URL_BY_SUBSIDIARY } from '@/utils/contactList';
import { sortPacksByPrice } from '@/utils/sortPacks';
import { getRenewPrice } from '@/utils/getRenewPrice';

export default function EditPack() {
  const { serviceName } = useParams();
  const { t } = useTranslation([
    'hycu/edit-pack',
    NAMESPACES.ERROR,
    NAMESPACES.ACTIONS,
  ]);
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
    serviceName,
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
    return <Errors>{t(`${NAMESPACES.ERROR}:error_loading_page`)}</Errors>;

  if (isLoading) return <Loading />;

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb items={breadcrumbItems} />}
      description={description}
      header={header}
    >
      {!isOrderInitiated ? (
        <>
          <Text preset={TEXT_PRESET.heading2} className="block mb-6">
            {t('hycu_edit_pack_subtitle', {
              displayName,
            })}
          </Text>
          <Text className="block mb-8">
            <Trans
              t={t}
              i18nKey="hycu_edit_pack_subtitle_description"
              components={{
                contact: (
                  <Link
                    href={CONTACT_URL_BY_SUBSIDIARY[subsidiary]}
                    target="blank"
                  ></Link>
                ),
              }}
            ></Trans>
          </Text>
          <OrderTileWrapper>
            {sortPacksByPrice(orderCatalogHYCU?.plans).map((product) => (
              <OrderTile
                checked={product.planCode === selectedPack}
                disabled={product.planCode === currentPack}
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
            <Button
              className="mr-4"
              color={BUTTON_COLOR.primary}
              onClick={() => {
                navigate(
                  urls.dashboard.replace(subRoutes.serviceName, serviceName),
                );
              }}
              variant={BUTTON_VARIANT.ghost}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              color={BUTTON_COLOR.primary}
              disabled={(!selectedPack && !orderLink) || undefined}
              onClick={() => {
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
          <Card color={CARD_COLOR.neutral} className="mb-8 p-4">
            <span slot="start">
              <div className="flex flex-col gap-6 mb-6">
                <Text preset={TEXT_PRESET.heading2}>
                  {t('hycu_edit_pack_initiated_title')}
                </Text>
                <Text preset={TEXT_PRESET.paragraph}>
                  {t('hycu_edit_pack_initiated_description')}
                </Text>
                <Link
                  className="w-full"
                  target="blank"
                  referrer-policy="strict-origin-when-cross-origin"
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
                  {t('hycu_edit_pack_initiated_info')}
                </Text>
              </div>
            </span>
          </Card>
          <Button
            variant={BUTTON_VARIANT.default}
            color={BUTTON_COLOR.primary}
            onClick={() => {
              navigate(
                urls.dashboard.replace(subRoutes.serviceName, serviceName),
              );
            }}
          >
            {t(`${NAMESPACES.ACTIONS}:end`)}
          </Button>
        </>
      )}
    </BaseLayout>
  );
}
