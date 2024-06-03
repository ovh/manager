import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  StepComponent,
  TilesInputComponent,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useParams } from 'react-router-dom';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { TSizeItem, useData } from '@/api/hooks/data';
import { useCatalogPrice } from '@/hooks/catalog-price';

export const SizeStep = (): JSX.Element => {
  const { projectId } = useParams();

  const { t: tAdd } = useTranslation('add');
  const { t: tStepper } = useTranslation('stepper');

  const sizes = useData(projectId);
  const [size, setSize] = useState<TSizeItem>(undefined);

  const store = useNewGatewayStore();

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
    setSize(sizes.find(($size) => $size.payload === store.form.size));
  }, [store.form.size, sizes]);

  return (
    <StepComponent
      id={StepsEnum.SIZE}
      order={1}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      title={tAdd('pci_projects_project_public_gateways_add_size_sub_title')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_size_info')}
        </OsdsText>
      }
      next={{
        action: store.form.size
          ? (id) => {
              store.updateStep.check(id as StepsEnum);
              store.updateStep.lock(id as StepsEnum);
              store.updateStep.open(StepsEnum.LOCATION);
            }
          : undefined,
        label: tStepper('common_stepper_next_button_label'),
        isDisabled: false,
      }}
      edit={{
        action: (id) => {
          store.updateStep.unCheck(id as StepsEnum);
          store.updateStep.unlock(id as StepsEnum);

          store.updateForm.regionName(undefined);
          store.updateStep.close(StepsEnum.LOCATION);
          store.updateStep.unCheck(StepsEnum.LOCATION);
          store.updateStep.unlock(StepsEnum.LOCATION);

          store.updateForm.name(undefined);
          store.updateForm.network(undefined, undefined);
          store.updateStep.close(StepsEnum.NETWORK);
        },
        label: tStepper('common_stepper_modify_this_step'),
        isDisabled: false,
      }}
    >
      <TilesInputComponent<TSizeItem, string, string>
        id="gateway-size-input"
        value={size}
        items={sizes}
        label={(item: TSizeItem) => (
          <div className="grid grid-cols-1 gap-2 text-left text w-full">
            <div className="">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {item.label}
              </OsdsText>
            </div>
            <hr className="w-full border-solid border-0 border-b border-b-[#85d9fd]" />
            <div className="text-sm">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {item.bandwidthLabel}
              </OsdsText>
            </div>
            <div className="text-sm mt-4">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {getFormattedHourlyCatalogPrice(item.hourlyPrice)} (
                {getFormattedMonthlyCatalogPrice(item.monthlyPrice)})
                <span>*</span>
              </OsdsText>
            </div>
          </div>
        )}
        onInput={(item) => {
          store.updateForm.size(item.payload);
        }}
      />
    </StepComponent>
  );
};
