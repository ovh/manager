import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertDescription,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  FieldDescription,
  FieldLabel,
  Skeleton,
} from '@datatr-ux/uxlib';
import { AlertTriangle } from 'lucide-react';
import { ReplicationRuleContainer } from './ReplicationRuleContainer.component';
import { FormField } from '@/components/form-field/FormField.component';
import Flag from '@/components/flag/Flag.component';
import { useReplicationFormContext } from './ReplicationForm.context';
import { useGetAvailableDestinationsContainers } from './useGetAvailableDestinationsContainers.hook';

export const ReplicationRuleDestination = () => {
  const {
    form,
    isPending,
    replicationWarningMessage,
  } = useReplicationFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');

  const {
    availableDestinations,
    isLoading: isDestinationsLoading,
  } = useGetAvailableDestinationsContainers();

  const isDisabled = isPending || isDestinationsLoading;

  if (isDestinationsLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  const destination = form.watch('destination');
  const selectedDestination =
    destination &&
    availableDestinations.find(
      (d) => d.name === destination.name && d.region === destination.region,
    );

  const handleSelect = (name: string, region: string) => {
    form.setValue('destination', { name, region });
    form.trigger('destination');
  };

  return (
    <ReplicationRuleContainer title={t('destinationLabel')}>
      <FormField name="destination" form={form}>
        {(field) => (
          <>
            <FieldLabel>{t('destinationFieldLabel')}</FieldLabel>
            <Combobox
              modal
              value={
                selectedDestination
                  ? `${selectedDestination.name}::${selectedDestination.region}`
                  : ''
              }
              onValueChange={(val) => {
                const [name, region] = val.split('::');
                handleSelect(name, region);
              }}
            >
              <ComboboxTrigger disabled={isDisabled} ref={field.ref}>
                <ComboboxValue
                  placeholder={t('destinationPlaceholder')}
                  value={
                    selectedDestination && (
                      <div className="flex items-center gap-2">
                        <Flag
                          flagName={selectedDestination.regionObj?.countryCode}
                        />
                        <span>
                          {`${selectedDestination.name} (${selectedDestination.region})`}
                        </span>
                      </div>
                    )
                  }
                ></ComboboxValue>
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput
                  placeholder={t('offsiteReplicationRegionSearchPlaceholder')}
                />
                <ComboboxList>
                  <ComboboxEmpty>
                    {t('offsiteReplicationRegionhSearchNoResult')}
                  </ComboboxEmpty>
                  <ComboboxGroup>
                    {availableDestinations.map(
                      ({ name, region, regionObj }) => (
                        <ComboboxItem
                          key={`${name}::${region}`}
                          value={`${name}::${region}`}
                          keywords={[name, region]}
                        >
                          <div className="flex items-center gap-2">
                            <Flag flagName={regionObj?.countryCode} />
                            <span>{`${name} (${region})`}</span>
                          </div>
                        </ComboboxItem>
                      ),
                    )}
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <FieldDescription>{t('destinationDescription')}</FieldDescription>

            {replicationWarningMessage && (
              <Alert variant="warning">
                <AlertDescription className="flex gap-2 items-center">
                  <AlertTriangle className="size-4" />
                  {t(replicationWarningMessage)}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </FormField>
    </ReplicationRuleContainer>
  );
};
