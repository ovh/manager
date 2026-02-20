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
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { BILLING_TYPE } from '@/types/instance/common.type';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import { TInstanceCreationForm } from '../CreateInstance.schema';

type TBillingChoiceProps = {
  billingTypes: BILLING_TYPE[];
};

const BillingChoice = ({ billingTypes }: TBillingChoiceProps) => {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();

  const selectedBillingType = useWatch({
    control,
    name: 'billingType',
  });

  type TSelectBillingArgs = {
    field: ControllerRenderProps<TInstanceCreationForm, 'billingType'>;
    billingType: BILLING_TYPE;
  };

  const handleSelectBillingType = ({
    field,
    billingType,
  }: TSelectBillingArgs) => () => {
    field.onChange(billingType);
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
      <Divider spacing="48" />
      <div>
        <Text preset="heading-3" className="mb-4">
          {t('creation:pci_instance_creation_select_billing_choice_title')}
        </Text>
      </div>
      <Controller
        name="billingType"
        control={control}
        render={({ field }) => (
          <RadioGroup value={selectedBillingType}>
            <div className="flex items-center gap-6">
              {billingTypes.map((billing) => {
                // eslint-disable-next-line react/no-multi-comp
                const Card = React.forwardRef<
                  HTMLDivElement,
                  React.ComponentProps<typeof PciCard>
                >((props, ref) => (
                  <PciCard
                    ref={ref}
                    selectable
                    selected={selectedBillingType === billing}
                    className="w-2/5"
                    onClick={handleSelectBillingType({
                      field,
                      billingType: billing,
                    })}
                    {...props}
                  >
                    <Radio value={billing}>
                      <div className="flex flex-col items-start gap-2">
                        <RadioLabel className="flex items-center gap-x-4 text-lg font-bold text-[--ods-color-heading]">
                          <RadioControl />
                          <Text className="font-medium text-[--ods-color-heading]">
                            {t(
                              `creation:pci_instance_creation_select_billing_${billing}`,
                            )}
                          </Text>
                        </RadioLabel>
                        <Text preset="caption">
                          {t(
                            `creation:pci_instance_creation_select_billing_choice_subtext_${billing}`,
                          )}
                        </Text>
                      </div>
                    </Radio>
                  </PciCard>
                ));

                Card.displayName = `BillingCard_${billing}`;

                return <Card key={billing} />;
              })}
            </div>
          </RadioGroup>
        )}
      />
    </section>
  );
};

export default BillingChoice;
