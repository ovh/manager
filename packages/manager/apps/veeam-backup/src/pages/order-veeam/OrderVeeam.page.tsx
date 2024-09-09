import React from 'react';
import {
  BaseLayout,
  CommonTitle,
  DashboardGridLayout,
  Description,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { BillingLink } from '@/components/Links/BillingLink.component';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { OrderVeeamStep2 } from './OrderVeeamStep2.component';
import { productName } from '@/veeam-backup.config';

export default function OrderVeeamPage() {
  const { t } = useTranslation('order-veeam');
  const [isStep2Visible, setIsStep2Visible] = React.useState(false);

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: productName,
        description: t('description'),
      }}
      subtitle={t('select_offer_title')}
    >
      <Description>{t('select_offer_description')}</Description>
      <BillingLink className="mb-8" />
      <DashboardGridLayout>
        <OsdsTile hoverable checked inline className="w-full h-full flex-col">
          <CommonTitle
            className="block mb-5"
            typoSize={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {t('offer_title', { productName })}
          </CommonTitle>
          <Description className="block mb-4">
            {t('offer_content_part1')}
          </Description>
          <Description className="block mb-4">
            {t('offer_content_part2')}
          </Description>
          <OsdsText
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.heading}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('offer_price')}
          </OsdsText>
        </OsdsTile>
      </DashboardGridLayout>
      <div className="mt-9">
        {isStep2Visible ? (
          <OrderVeeamStep2 />
        ) : (
          <OsdsButton
            inline
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => setIsStep2Visible(true)}
          >
            {t('next_step')}
          </OsdsButton>
        )}
      </div>
    </BaseLayout>
  );
}
