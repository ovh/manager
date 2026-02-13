import { useEffect, useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldLabel,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { useSubnets } from '@/data/hooks/network/useSubnets';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectSubnetsForNetwork } from '@/pages/create/view-model/network.view-model';

export const SubnetSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const selectedMicroRegion = useWatch({ control, name: 'shareData.microRegion' });
  const selectedNetworkId = useWatch({ control, name: 'shareData.privateNetworkId' });

  const { data: subnetOptions = [], isLoading } = useSubnets({
    region: selectedMicroRegion,
    networkId: selectedNetworkId,
    options: { select: selectSubnetsForNetwork(selectedNetworkId) },
    enabled: !!selectedMicroRegion && !!selectedNetworkId,
  });

  const firstSubnetId = useMemo(() => subnetOptions[0]?.value, [subnetOptions]);

  useEffect(() => {
    setValue('shareData.subnetId', firstSubnetId ?? '', { shouldValidate: true });
  }, [firstSubnetId, selectedNetworkId, setValue]);

  if (!selectedNetworkId) return null;
  if (isLoading) return <Spinner size={SPINNER_SIZE.sm} />;

  if (subnetOptions.length === 0) {
    return <Text preset="paragraph">{t('create:network.subnet.empty')}</Text>;
  }

  return (
    <div className="min-w-[320px] max-w-[370px] flex-1">
      <Controller
        name="shareData.subnetId"
        control={control}
        render={({ field }) => {
          const handleSubnetChange = (subnets: SelectValueChangeDetail) =>
            field.onChange(subnets.value[0] ?? '');

          return (
            <FormField>
              <FormFieldLabel>{t('create:network.subnet.label')}</FormFieldLabel>
              <Select
                items={subnetOptions}
                value={field.value ? [field.value] : []}
                onValueChange={handleSubnetChange}
              >
                <SelectControl />
                <SelectContent />
              </Select>
            </FormField>
          );
        }}
      />
    </div>
  );
};
