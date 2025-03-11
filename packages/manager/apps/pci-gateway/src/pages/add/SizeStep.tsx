import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  StepComponent,
  TilesInputComponent,
  useCatalogPrice,
  convertHourlyPriceToMonthly,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { useData } from '@/api/hooks/data';
import { useRegionGatewayAddons } from '@/api/hooks/useGateways/useGateways';
import { TProductAddonDetail } from '@/types/addon.type';

export const SizeStep = ({
  ovhSubsidiary,
}: {
  ovhSubsidiary: string;
}): JSX.Element => {
  const { projectId } = useParams();

  const { t } = useTranslation(['add', 'stepper', 'catalog-selector']);

  const sizes = useData(projectId);
  const [size, setSize] = useState<TProductAddonDetail>();

  const { tracking } = useContext(ShellContext).shell;
  const store = useNewGatewayStore();

  const addons = useRegionGatewayAddons(
    ovhSubsidiary,
    projectId,
    store.form.regionName || '',
  );

  const {
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice(4);

  useEffect(() => {
    if (sizes.length) {
      store.updateForm.size(sizes[0].payload);
    }
  }, [sizes]);

  useEffect(() => {
    setSize(addons.find((addon) => addon.size === store.form.size));
  }, [store.form.size, addons]);

  return (
    <StepComponent
      id={StepsEnum.SIZE}
      order={2}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      title={t('pci_projects_project_public_gateways_add_size_sub_title')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('pci_projects_project_public_gateways_add_size_info')}
        </OsdsText>
      }
      next={{
        action: store.form.size
          ? (id) => {
              store.updateStep.check(id as StepsEnum);
              store.updateStep.lock(id as StepsEnum);
              store.updateStep.open(StepsEnum.NETWORK);
              tracking.trackClick({
                name: 'public-gateway_add_select-type',
                type: 'action',
              });
            }
          : undefined,
        label: t('stepper:common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateStep.close(StepsEnum.NETWORK);

          store.updateForm.name(undefined);
          store.updateForm.network(undefined, undefined);
        },
        label: t('stepper:common_stepper_modify_this_step'),
        isDisabled: false,
      }}
    >
      <TilesInputComponent<TProductAddonDetail, string, string>
        id="gateway-size-input"
        value={size}
        items={addons}
        label={(item: TProductAddonDetail) => (
          <div className="grid grid-cols-1 gap-2 text-left text w-full">
            <div className="">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t(
                  'catalog-selector:pci_projects_project_gateways_model_selector_size',
                )}{' '}
                {item.size.toUpperCase()}
              </OsdsText>
            </div>
            <div className="text-sm font-normal">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {item.bandwidth > 1000
                  ? t(
                      'catalog-selector:pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
                      { bandwidth: item.bandwidth / 1000 },
                    )
                  : t(
                      'catalog-selector:pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
                      { bandwidth: item.bandwidth },
                    )}
              </OsdsText>
            </div>
            <hr className="w-full border-solid border-0 border-b border-[--ods-color-blue-200]" />
            <div className="text-sm mt-4 text-center">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {getFormattedHourlyCatalogPrice(item.price)}
              </OsdsText>
            </div>
            <div className="text-sm text-center font-normal">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                ~{' '}
                {getFormattedMonthlyCatalogPrice(
                  convertHourlyPriceToMonthly(item.price),
                )}
              </OsdsText>
            </div>
          </div>
        )}
        onInput={(item) => {
          store.updateForm.size(item.size);
        }}
      />
    </StepComponent>
  );
};
