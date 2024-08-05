import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import FlavorBilling from './FlavorBilling.component';

export type BillingAndAntiAffinityStepProps = {
  isChecked: boolean;
  isCheckBoxDisabled?: boolean;
  onChange: () => void;
  maxNodes: number;
  isComingSoonPricingBannerDisplayed?: boolean;
  isBillingWarningMessageDisplayed?: boolean;
};

export default function BillingAndAntiAffinityStep({
  isChecked,
  isCheckBoxDisabled = false,
  onChange,
  maxNodes,
  isComingSoonPricingBannerDisplayed = true,
  isBillingWarningMessageDisplayed = true,
}: Readonly<BillingAndAntiAffinityStepProps>) {
  const { t } = useTranslation('billing-anti-affinity');

  return (
    <>
      <OsdsCheckbox
        name="kube_anti_affinity"
        checked={isChecked}
        disabled={isCheckBoxDisabled}
        onOdsCheckedChange={onChange}
        className="mb-4"
      >
        <OsdsCheckboxButton
          interactive
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
            slot="end"
          >
            {t('kubernetes_node_pool_anti_affinity')}
          </OsdsText>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._100}
        slot="end"
        className="ml-9 mt-4"
      >
        {t('kubernetes_node_pool_anti_affinity_description', {
          maxNodes,
        })}
      </OsdsText>

      {isComingSoonPricingBannerDisplayed && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
          className="my-6"
        >
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="block"
            >
              {t(
                'kubernetes_add_billing_anti_affinity_coming_soon_message_title',
              )}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="block"
            >
              {t(
                'kubernetes_add_billing_anti_affinity_coming_soon_message_description',
              )}
            </OsdsText>
          </div>
        </OsdsMessage>
      )}

      {!isComingSoonPricingBannerDisplayed && (
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-8 block"
        >
          {t('kubernetes_add_billing_type_description')}
        </OsdsText>
      )}

      {/*
       * The FlavorBilling is stateLess
       * Can adapt the props as wanted
       * In this case the props passed will depend on creation stepper formState
       */}
      <FlavorBilling
        isMonthlyBilling={false}
        onClick={(_event) => {}}
        prices={{ hourly: 23456789, monthly: 435678 }}
        addonsLength={1}
        gateway={{ prices: { hourly: 23456789, monthly: 435678 } }}
        floatingIp={{ prices: { hourly: 23456789, monthly: 435678 } }}
        isHourTileDisabled={false}
        isMonthTileDisabled
        isMonthTileDisplayed
      />

      {isBillingWarningMessageDisplayed && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.warning}
          color={ODS_THEME_COLOR_INTENT.warning}
          className="my-6"
        >
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kubernetes_add_billing_auto_scaling_monthly_warning')}
          </OsdsText>
        </OsdsMessage>
      )}

      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block"
      >
        {t('kubernetes_add_billing_type_payment_method')}
      </OsdsText>
    </>
  );
}
