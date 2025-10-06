import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { FormattedStorage } from '@/types/Storages';
import { AddReplicationFormValues } from '../new/formAddReplication/useAddReplicationForm.hook';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';

type ReplicationRuleDestinationProps = {
  form: UseFormReturn<AddReplicationFormValues>;
  availableDestinations: FormattedStorage[];
  isPending: boolean;
};

export const ReplicationRuleDestination = ({
  form,
  availableDestinations,
  isPending,
}: ReplicationRuleDestinationProps) => {
  const { t } = useTranslation('pci-object-storage/replication');

  const getDestinationLabel = (value: string) => {
    const destination = availableDestinations.find(
      (d) => `${d.name}:${d.region}` === value,
    );
    return destination ? `${destination.name} (${destination.region})` : '';
  };

  return (
    <ReplicationRuleContainer title={t('destinationLabel')}>
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <Select
              disabled={isPending || availableDestinations.length === 0}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('destinationPlaceholder')}>
                    {field.value ? getDestinationLabel(field.value) : null}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableDestinations.map(({ id, name, region }) => (
                  <SelectItem
                    key={`{${id}:${name}:${region}}`}
                    value={`${name}:${region}`}
                  >
                    {name} ({region})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>{t('destinationDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </ReplicationRuleContainer>
  );
};
