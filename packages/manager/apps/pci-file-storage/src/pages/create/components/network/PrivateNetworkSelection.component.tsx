import { useEffect } from 'react';

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

import { useNetworks } from '@/data/hooks/network/useNetworks';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectPrivateNetworksForRegion } from '@/pages/create/view-model/network.view-model';

export const PrivateNetworkSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const selectedMicroRegion = useWatch({
    control,
    name: 'shareData.microRegion',
  });

  const { data: privateNetworkOptions = [], isLoading } = useNetworks(selectedMicroRegion, {
    select: selectPrivateNetworksForRegion(selectedMicroRegion),
  });

  useEffect(() => {
    if (privateNetworkOptions[0]) {
      setValue('shareData.privateNetworkId', privateNetworkOptions[0].value);
    }
  }, [privateNetworkOptions, setValue]);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner size={SPINNER_SIZE.sm} />;
    }

    if (privateNetworkOptions.length === 0) {
      return <Text preset="paragraph">{t('create:network.empty')}</Text>;
    }

    return (
      <div className="max-w-[32%]">
        <Controller
          name="shareData.privateNetworkId"
          control={control}
          render={({ field }) => {
            const handleNetworkChange = (networks: SelectValueChangeDetail) =>
              field.onChange(networks.value[0] || undefined);

            return (
              <FormField>
                <FormFieldLabel>{t('create:network.label')}</FormFieldLabel>
                <Select
                  items={privateNetworkOptions}
                  value={field.value ? [field.value] : []}
                  onValueChange={handleNetworkChange}
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

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Text preset="heading-3">{t('create:network.title')}</Text>
        <Text preset="paragraph">{t('create:network.description')}</Text>
      </div>

      {renderContent()}
    </section>
  );
};
