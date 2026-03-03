import { useEffect, useMemo } from 'react';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Button,
  FormField,
  FormFieldLabel,
  ICON_NAME,
  Icon,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { useNetworks } from '@/data/hooks/network/useNetworks';
import { PciAppUrlSuffix, usePciAppUrl } from '@/hooks/usePciAppUrl';
import { SubnetSelection } from '@/pages/create/components/network/SubnetSelection.component';
import { CreateShareFormValues } from '@/pages/create/schema/CreateShare.schema';
import { selectPrivateNetworksForRegion } from '@/pages/create/view-model/network.view-model';

const PrivateNetworkSelection = () => {
  const { t } = useTranslation(['create']);
  const { control, setValue } = useFormContext<CreateShareFormValues>();
  const privateNetworksUrl = usePciAppUrl(PciAppUrlSuffix.PrivateNetworks);
  const selectedMicroRegion = useWatch({
    control,
    name: 'shareData.microRegion',
  });

  const {
    data: privateNetworkOptions = [],
    isLoading,
    refetch,
    isFetching,
  } = useNetworks(selectedMicroRegion, {
    select: selectPrivateNetworksForRegion(selectedMicroRegion),
  });

  const firstPrivateNetworkId = useMemo(
    () => privateNetworkOptions[0]?.value,
    [privateNetworkOptions],
  );

  useEffect(() => {
    setValue('shareData.privateNetworkId', firstPrivateNetworkId ?? '', { shouldValidate: true });
  }, [firstPrivateNetworkId, setValue]);

  const renderContent = () => {
    if (isLoading) {
      return <Spinner size={SPINNER_SIZE.sm} />;
    }

    if (privateNetworkOptions.length === 0) {
      return <Text preset="paragraph">{t('create:network.empty')}</Text>;
    }

    return (
      <div className="min-w-[320px] max-w-[370px] flex-1">
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

      <div className="flex flex-row flex-wrap gap-4">
        {renderContent()}
        <SubnetSelection />
      </div>
      <div className="flex flex-row flex-wrap items-center gap-4">
        <a href={`${privateNetworksUrl}/new`} target="_blank" rel="noreferrer">
          <Button type="button" variant="outline" color="primary">
            {t('create:network.createPrivateNetwork')}
          </Button>
        </a>
        <Button
          color="primary"
          variant="outline"
          type="button"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label={t('create:network.reloadNetworks')}
        >
          {isFetching ? (
            <Spinner size={SPINNER_SIZE.sm} className="h-[22px]" />
          ) : (
            <Icon name={ICON_NAME.refresh} className="text-[22px]" />
          )}
        </Button>
      </div>
    </section>
  );
};
export { PrivateNetworkSelection };
