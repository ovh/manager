import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsButton,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  convertHourlyPriceToMonthly,
  StepComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { useAddons } from '@/api/hooks/useAddons/useAddons';
import { GATEWAY_ADDON_FAMILY } from '@/api/hooks/useAddons/useAddons.constant';
import { filterProductRegionBySize } from '@/api/hooks/useAddons/useAddons.select';
import { TProductAddonDetail } from '@/types/product.type';
import usePublicIpPrice from '@/hooks/usePublicIpPrice';
import selectGatewayPrices from '@/pages/add/view-models/selectGatewayPrices';
import GatewayPrices from '@/components/price/GatewayPrices.component';
import { useGatewayCreation } from '@/pages/add/useGatewayCreation';

export const ConfirmStep = (): JSX.Element => {
  const { t } = useTranslation(['add', 'stepper']);
  const { t: tAdd } = useTranslation('add');
  const navigate = useNavigate();
  const store = useNewGatewayStore();
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4, { exclVat: true });

  const { addons, isFetching: isAddonsFetching } = useAddons({
    ovhSubsidiary,
    projectId: store.project?.id,
    addonFamily: GATEWAY_ADDON_FAMILY,
    select: (products: TProductAddonDetail[]) =>
      filterProductRegionBySize(products, store.form.regionName),
  });

  const publicIpPrice = usePublicIpPrice(
    store.project?.id,
    store.form.regionName,
  );

  const { create, isCreating } = useGatewayCreation(StepsEnum.CONFIRM);

  const confirmStep = store.steps.get(StepsEnum.CONFIRM);

  const arePricesFetching = isAddonsFetching || publicIpPrice.isPending;

  const selectedGateway = addons.find(({ size }) => size === store.form.size);

  const getPrices = selectGatewayPrices(
    tAdd,
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
    convertHourlyPriceToMonthly,
  );

  return (
    <StepComponent
      id={StepsEnum.CONFIRM}
      order={4}
      isOpen={confirmStep.isOpen}
      isChecked={confirmStep.isChecked}
      isLocked={confirmStep.isLocked}
      title={t('add:pci_projects_project_public_gateways_add_confirm_title')}
    >
      <p className="mb-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('add:pci_projects_project_public_gateways_add_cost_title')}
        </OsdsText>
      </p>
      {arePricesFetching ? (
        <div className="mb-6">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <GatewayPrices
          rows={getPrices(
            store.form.size,
            selectedGateway?.price,
            publicIpPrice.price?.hour ?? null,
          )}
        />
      )}

      {isCreating ? (
        <p>
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t(
              'add:pci_projects_project_public_gateways_add_creating_wait_message',
            )}
          </OsdsText>
        </p>
      ) : (
        <div className="flex gap-x-5">
          <OsdsButton
            type={ODS_BUTTON_TYPE.button}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            inline
            onClick={() => navigate('..')}
          >
            {t('stepper:common_stepper_cancel_button_label')}
          </OsdsButton>
          <OsdsButton
            size={ODS_BUTTON_SIZE.md}
            inline
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
            {...((arePricesFetching || store.project?.isDiscovery) && {
              disabled: true,
            })}
            onClick={create}
          >
            {t('add:pci_projects_project_public_gateways_add_submit_label')}
          </OsdsButton>
        </div>
      )}
    </StepComponent>
  );
};
