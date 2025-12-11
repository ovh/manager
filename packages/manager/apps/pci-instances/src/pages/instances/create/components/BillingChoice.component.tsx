import {
  Divider,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { PciCard } from '@/components/pciCard/PciCard.component';
import { TInstanceCreationForm } from '../CreateInstance.page';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
  UseFormStateReturn,
  useWatch,
} from 'react-hook-form';
import { BILLING_TYPE } from '@/types/instance/common.type';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { selectBillingTypes } from '../view-models/BillingTypesViewModel';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';

const BillingChoice = () => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const projectId = useProjectId();

  const [
    selectedBillingType,
    flavorId,
    distributionImageVersionName,
  ] = useWatch({
    control,
    name: [
      'billingType',
      'flavorId',
      'distributionImageVersion.distributionImageVersionName',
    ],
  });

  const handleSelectBilling = (billingType: BILLING_TYPE | null) => {
    if (!billingType) return;
    const pricingTypes = selectBillingTypes(deps)(
      projectId,
      flavorId,
      distributionImageVersionName,
    );
    if (pricingTypes?.[0]) {
      updateBillingSelection(pricingTypes[0]);
    }
  };

  const updateBillingSelection = (billingType: BILLING_TYPE) => {
    setValue('billingType', billingType);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_instance', 'select_billing', billingType],
    });
  };

  return (
    <section>
      <Divider spacing="64" />
      <div>
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_select_billing_choice_title')}
        </Text>
      </div>
      <Controller
        name="billingType"
        control={control}
        render={() => (
          <RadioGroup
            value={selectedBillingType}
            onValueChange={({ value }) => handleSelectBilling(value)}
          >
            <div className="flex items-center space-x-4">
              <PciCard
                compact
                onClick={() => updateBillingSelection(BILLING_TYPE.Hourly)}
                selected={selectedBillingType === BILLING_TYPE.Hourly}
              >
                <Radio value="hourly">
                  <div className="flex flex-col items-start gap-2">
                    <RadioLabel className="flex items-center gap-x-4 text-lg font-bold text-[--ods-color-heading]">
                      <RadioControl />
                      <Text className="font-medium text-[--ods-color-heading]">
                        {t('pci_instances_creation_select_billing_hourly')}
                      </Text>
                    </RadioLabel>
                    <Text preset="caption">
                      {t('pci_instances_creation_select_billing_subtext')}
                    </Text>
                  </div>
                </Radio>
              </PciCard>

              <PciCard
                compact
                onClick={() => updateBillingSelection(BILLING_TYPE.Monthly)}
                selected={selectedBillingType === BILLING_TYPE.Monthly}
              >
                <Radio value="monthly">
                  <div className="flex flex-col items-start gap-2">
                    <RadioLabel className="flex items-center gap-x-4 text-lg font-bold text-[--ods-color-heading]">
                      <RadioControl />
                      <Text className="font-medium text-[--ods-color-heading]">
                        {t('pci_instances_creation_select_billing_monthly')}
                      </Text>
                    </RadioLabel>
                    <Text preset="caption">
                      {t('pci_instances_creation_select_billing_subtext')}
                    </Text>
                  </div>
                </Radio>
              </PciCard>
            </div>
          </RadioGroup>
        )}
      />
    </section>
  );
};

export default BillingChoice;
