import React from 'react';
import {
  BaseLayout,
  DashboardGridLayout,
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  ManagerTile,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsMessage, OdsButton } from '@ovhcloud/ods-components/react';
import {
  ShellContext,
  i18nextLocaleToOvh,
} from '@ovh-ux/manager-react-shell-client';
import { useVeeamBackupVmConsumptionPricing } from '@ovh-ux/manager-module-vcd-api';
import { BillingLink } from '@/components/Links/BillingLink.component';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { OrderVeeamStep2 } from './OrderVeeamStep2.component';
import { productName } from '@/veeam-backup.config';
import { Loading } from '@/components/Loading/Loading';

export default function OrderVeeamPage() {
  const { t, i18n } = useTranslation('order-veeam');
  const [isStep2Visible, setIsStep2Visible] = React.useState(false);
  const { environment } = React.useContext(ShellContext);
  const {
    isLoading,
    error,
    isError,
    pricing,
  } = useVeeamBackupVmConsumptionPricing();

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: productName,
        description: t('description'),
      }}
      subtitle={t('select_offer_title')}
    >
      <OdsText>{t('select_offer_description')}</OdsText>
      <BillingLink className="block mb-4" />
      {isError ? (
        <OdsMessage color="danger">
          {t('catalog_error', { error: error?.response?.data?.message })}
        </OdsMessage>
      ) : (
        <DashboardGridLayout>
          {isLoading ? (
            <Loading />
          ) : (
            <ManagerTile
              className="w-full h-full flex-col mt-4"
              color="primary"
            >
              <OdsText preset="heading-4" className="mb-2">
                {t('offer_title', { productName })}
              </OdsText>
              <OdsText className="block mb-2">
                {t('offer_content_part1')}
              </OdsText>
              <OdsText className="block mb-2">
                {t('offer_content_part2')}
              </OdsText>
              <OdsText>
                <Price
                  value={pricing?.price || 0}
                  tax={pricing?.tax}
                  intervalUnit={
                    (pricing?.intervalUnit as unknown) as IntervalUnitType
                  }
                  locale={i18nextLocaleToOvh(i18n.language)}
                  ovhSubsidiary={
                    environment?.user?.ovhSubsidiary as OvhSubsidiary
                  }
                />
                {t('offer_price')}
              </OdsText>
            </ManagerTile>
          )}
        </DashboardGridLayout>
      )}
      <div className="mt-9">
        {isStep2Visible ? (
          <OrderVeeamStep2 />
        ) : (
          <OdsButton
            label={t('next_step')}
            isDisabled={isLoading || isError}
            onClick={() => setIsStep2Visible(true)}
          />
        )}
      </div>
    </BaseLayout>
  );
}
