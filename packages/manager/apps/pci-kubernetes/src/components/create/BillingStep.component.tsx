import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import clsx from 'clsx';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovhcloud/manager-components';
import { ANTI_AFFINITY_MAX_NODES } from '@/constants';

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';

export type TBillingStepProps = {
  antiAffinity: {
    isEnabled: boolean;
    isChecked: boolean;
    onChange: (val: boolean) => void;
  };
  price: number;
  monthlyPrice?: number;
  monthlyBilling: {
    isComingSoon: boolean;
    isChecked: boolean;
    check: (val: boolean) => void;
  };
  warn: boolean;
};

export default function BillingStep(props: TBillingStepProps): JSX.Element {
  const { t } = useTranslation('billing-anti-affinity');
  const { t: tNodePool } = useTranslation('node-pool');
  const { t: tFlavourBilling } = useTranslation('flavor-billing');

  const {
    getFormattedMonthlyCatalogPrice,
    getFormattedHourlyCatalogPrice,
  } = useCatalogPrice(4);

  return (
    <>
      <div>
        <OsdsCheckbox
          data-testid="checkbox"
          name="kube_anti_affinity"
          checked={props.antiAffinity.isChecked}
          disabled={!props.antiAffinity.isEnabled}
          onOdsCheckedChange={(e) =>
            props.antiAffinity.onChange(e.detail.checked)
          }
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
              size={ODS_TEXT_SIZE._400}
              slot="end"
            >
              {t('kubernetes_node_pool_anti_affinity')}
            </OsdsText>
          </OsdsCheckboxButton>
        </OsdsCheckbox>

        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kubernetes_node_pool_anti_affinity_description', {
            maxNodes: ANTI_AFFINITY_MAX_NODES,
          })}
        </OsdsText>
      </div>
      {props.monthlyBilling.isComingSoon ? (
        <OsdsMessage
          data-testid="coming_soon_message"
          type={ODS_MESSAGE_TYPE.info}
          color={ODS_THEME_COLOR_INTENT.info}
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
      ) : (
        <OsdsText
          data-testid="billing_description"
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {tNodePool('kube_add_billing_type_description')}
        </OsdsText>
      )}

      <div className="flex gap-10 my-8">
        <OsdsTile
          data-testid="hourly_tile"
          className={clsx(
            !props.monthlyBilling.isChecked ? checkedClass : uncheckedClass,
            'w-1/2',
          )}
          onClick={() => {
            props.monthlyBilling.check(false);
          }}
          disabled={false}
        >
          <div className="w-full">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tFlavourBilling('pci_project_flavors_billing_hourly')}
            </OsdsText>
            <hr className={separatorClass} />

            <>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                className="block"
              >
                <strong>
                  {tFlavourBilling(
                    'pci_project_flavors_billing_price_hourly_price_label',
                  )}
                </strong>
                {getFormattedHourlyCatalogPrice(props.price)}
              </OsdsText>
            </>
          </div>
        </OsdsTile>
        {props.monthlyPrice !== undefined && (
          <OsdsTile
            data-testid="monthly_tile"
            className={clsx(
              props.monthlyBilling.isChecked ? checkedClass : uncheckedClass,
              'w-1/2',
            )}
            checked={props.monthlyBilling.isChecked}
            onClick={() => {
              props.monthlyBilling.check(true);
            }}
            disabled={false}
          >
            <div className="w-full">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tFlavourBilling('pci_project_flavors_billing_monthly')}
              </OsdsText>
              <hr className={separatorClass} />

              <>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="block"
                >
                  <strong>
                    {tFlavourBilling(
                      'pci_project_flavors_billing_price_monthly_instance_price_label',
                    )}
                  </strong>
                  {getFormattedMonthlyCatalogPrice(props.monthlyPrice)}
                </OsdsText>
              </>
            </div>
          </OsdsTile>
        )}
      </div>

      {props.warn && (
        <OsdsMessage
          data-testid="warn_message"
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
