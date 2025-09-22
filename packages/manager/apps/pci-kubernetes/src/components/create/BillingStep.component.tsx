import { ReactElement } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { useCatalogPrice, useProjectUrl } from '@ovh-ux/manager-react-components';

import useSavingsPlanAvailable from '@/hooks/useSavingPlanAvailable';

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';

export type TBillingStepProps = {
  price: number | null;
  monthlyPrice?: number;
  monthlyBilling: {
    isComingSoon: boolean;
    isChecked: boolean;
    check: (val: boolean) => void;
  };
  warn: boolean;
};

export default function BillingStep(props: TBillingStepProps): ReactElement {
  const { t } = useTranslation(['billing-anti-affinity', 'add']);
  const { t: tFlavourBilling } = useTranslation('flavor-billing');
  const { getFormattedMonthlyCatalogPrice, getFormattedHourlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });

  const projectURL = useProjectUrl('public-cloud');
  const savingsPlanUrl = `${projectURL}/savings-plan`;
  const showSavingPlan = useSavingsPlanAvailable();

  return (
    <>
      <div className="my-6">
        <OsdsText
          className="mb-4 font-bold block"
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._400}
        >
          {tFlavourBilling('pci_projects_project_instances_configure_billing_type')}
        </OsdsText>
        {props.monthlyBilling.isComingSoon && showSavingPlan ? (
          <OsdsMessage
            data-testid="coming_soon_message"
            type={ODS_MESSAGE_TYPE.info}
            color={ODS_THEME_COLOR_INTENT.info}
          >
            <div className="flex flex-col">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('kubernetes_add_billing_savings_plan_banner')}
              </OsdsText>
              <OsdsLink
                className="mt-2 flex items-center"
                target={OdsHTMLAnchorElementTarget._blank}
                color={ODS_THEME_COLOR_INTENT.primary}
                href={savingsPlanUrl}
              >
                {t('kubernetes_add_billing_savings_plan_cta')}
                <OsdsIcon
                  className="ml-5"
                  aria-hidden="true"
                  name={ODS_ICON_NAME.ARROW_RIGHT}
                  size={ODS_ICON_SIZE.xxs}
                  color={ODS_THEME_COLOR_INTENT.primary}
                />
              </OsdsLink>
            </div>
          </OsdsMessage>
        ) : (
          <OsdsText
            data-testid="billing_description"
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
          >
            {t('add:kube_add_billing_type_description')}{' '}
            {props.monthlyPrice &&
              props.monthlyPrice > 0 &&
              t('add:kubernetes_add_billing_type_description_monthly')}
          </OsdsText>
        )}
      </div>

      <div className="flex gap-10 my-8">
        <OsdsTile
          data-testid="hourly_tile"
          className={clsx(!props.monthlyBilling.isChecked ? checkedClass : uncheckedClass, 'w-1/2')}
          onClick={() => {
            props.monthlyBilling.check(false);
          }}
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
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="block"
            >
              <strong>
                {tFlavourBilling('pci_project_flavors_billing_price_hourly_price_label')}
              </strong>
              {` ${getFormattedHourlyCatalogPrice(Number(props.price))}`}
            </OsdsText>
          </div>
        </OsdsTile>

        {!props.monthlyBilling.isComingSoon && (
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
                {` ${getFormattedMonthlyCatalogPrice(props.monthlyPrice ?? 0)}`}
              </OsdsText>
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
