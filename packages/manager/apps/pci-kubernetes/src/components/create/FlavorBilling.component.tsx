import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText, OsdsTile } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-100] hover:border-[--ods-color-blue-600]';
const separatorClass = 'h-px my-5 bg-[#85d9fd] border-0';

type FlavorBillingProps = {
  isMonthlyBilling: boolean;
  prices: { monthly: number; hourly: number };
  addonsLength: number;
  onClick: (event) => void;
  gateway?:
    | {
        prices: { monthly: number; hourly: number };
      }
    | undefined;
  floatingIp?:
    | {
        prices: { monthly: number; hourly: number };
      }
    | undefined;
  isHourTileDisabled?: boolean;
  isMonthTileDisabled?: boolean;
  isMonthTileDisplayed?: boolean;
};

export default function FlavorBilling({
  isMonthlyBilling,
  prices,
  addonsLength,
  onClick,
  gateway,
  floatingIp,
  isHourTileDisabled = false,
  isMonthTileDisabled = false,
  isMonthTileDisplayed = true,
}: Readonly<FlavorBillingProps>) {
  const { t } = useTranslation('flavor-billing');

  const {
    getFormattedMonthlyCatalogPrice,
    getFormattedHourlyCatalogPrice,
  } = useCatalogPrice(4);

  const getTotalPriceHourly =
    (prices?.hourly || 0) +
    (gateway?.prices?.hourly || 0) +
    (floatingIp?.prices?.hourly || 0);

  const getTotalPriceMonthly =
    (prices?.monthly || 0) +
    (gateway?.prices?.monthly || 0) +
    (floatingIp?.prices?.monthly || 0);

  return (
    <>
      <div className="flex gap-10 my-8">
        <OsdsTile
          className={!isMonthlyBilling ? checkedClass : uncheckedClass}
          checked={!isMonthlyBilling}
          onClick={onClick}
          disabled={isHourTileDisabled || undefined}
        >
          <div className="w-full">
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {t('pci_project_flavors_billing_hourly')}
            </OsdsText>
            <hr className={separatorClass} />

            {prices && (
              <>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                  className="block"
                >
                  <strong>
                    {t('pci_project_flavors_billing_price_hourly_price_label')}
                  </strong>{' '}
                  {getFormattedHourlyCatalogPrice(prices.hourly)}
                </OsdsText>

                {addonsLength > 0 && (
                  <>
                    {gateway && (
                      <OsdsText
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        color={ODS_THEME_COLOR_INTENT.text}
                        className="block"
                      >
                        <strong>
                          {t(
                            'pci_project_flavors_billing_price_monthly_gateway_price_label',
                          )}
                        </strong>{' '}
                        {getFormattedHourlyCatalogPrice(
                          gateway?.prices?.hourly,
                        )}
                      </OsdsText>
                    )}

                    {floatingIp && (
                      <OsdsText
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        color={ODS_THEME_COLOR_INTENT.text}
                        className="block"
                      >
                        <strong>
                          {t(
                            'pci_project_flavors_billing_price_monthly_floatingip_price_label',
                          )}
                        </strong>{' '}
                        {getFormattedHourlyCatalogPrice(
                          floatingIp?.prices?.hourly,
                        )}
                      </OsdsText>
                    )}

                    <OsdsText
                      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                      color={ODS_THEME_COLOR_INTENT.text}
                      className="block mt-5"
                    >
                      <strong>
                        {t(
                          'pci_projects_project_instances_add_total_price_label',
                        )}
                      </strong>{' '}
                      {getFormattedHourlyCatalogPrice(getTotalPriceHourly)}
                    </OsdsText>
                  </>
                )}
              </>
            )}
          </div>
        </OsdsTile>

        {isMonthTileDisplayed && (
          <OsdsTile
            className={isMonthlyBilling ? checkedClass : uncheckedClass}
            checked={isMonthlyBilling}
            onClick={onClick}
            disabled={isMonthTileDisabled || undefined}
          >
            <div className="w-full">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('pci_project_flavors_billing_monthly')}
              </OsdsText>
              <hr className={separatorClass} />

              {prices && (
                <>
                  <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="block"
                  >
                    <strong>
                      {t(
                        'pci_project_flavors_billing_price_monthly_instance_price_label',
                      )}
                    </strong>{' '}
                    {getFormattedMonthlyCatalogPrice(prices.monthly)}
                  </OsdsText>

                  {addonsLength > 0 && (
                    <>
                      {gateway && (
                        <OsdsText
                          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                          color={ODS_THEME_COLOR_INTENT.text}
                          className="block"
                        >
                          <strong>
                            {t(
                              'pci_project_flavors_billing_price_monthly_gateway_price_label',
                            )}
                          </strong>{' '}
                          {getFormattedMonthlyCatalogPrice(
                            gateway?.prices?.monthly,
                          )}
                        </OsdsText>
                      )}

                      {floatingIp && (
                        <OsdsText
                          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                          color={ODS_THEME_COLOR_INTENT.text}
                          className="block"
                        >
                          <strong>
                            {t(
                              'pci_project_flavors_billing_price_monthly_floatingip_price_label',
                            )}
                          </strong>{' '}
                          {getFormattedMonthlyCatalogPrice(
                            floatingIp?.prices?.monthly,
                          )}
                        </OsdsText>
                      )}

                      <OsdsText
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        color={ODS_THEME_COLOR_INTENT.text}
                        className="block mt-5"
                      >
                        <strong>
                          {t(
                            'pci_projects_project_instances_add_total_price_label',
                          )}
                        </strong>{' '}
                        {getFormattedMonthlyCatalogPrice(getTotalPriceMonthly)}
                      </OsdsText>
                    </>
                  )}
                </>
              )}
            </div>
          </OsdsTile>
        )}
      </div>
    </>
  );
}
