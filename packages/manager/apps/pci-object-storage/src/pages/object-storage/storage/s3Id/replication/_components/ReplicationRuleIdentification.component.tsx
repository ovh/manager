import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { AddReplicationFormValues } from '../new/formAddReplication/useAddReplicationForm.hook';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';

type ReplicationRuleIdentificationProps = {
  form: UseFormReturn<AddReplicationFormValues>;
  isPending: boolean;
};

export const ReplicationRuleIdentification = ({
  form,
  isPending,
}: ReplicationRuleIdentificationProps) => {
  const { t } = useTranslation('pci-object-storage/replication');

  return (
    <ReplicationRuleContainer title={t('replicationConfigurationTitle')}>
      <FormField
        control={form.control}
        name="ruleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ruleIdLabel')}</FormLabel>
            <FormControl>
              <Input disabled={isPending} {...field} />
            </FormControl>
            <FormDescription>{t('ruleIdDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('statusLabel')}</FormLabel>
            <Select
              disabled={isPending}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="enabled">{t('statusEnabled')}</SelectItem>
                <SelectItem value="disabled">{t('statusDisabled')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('priorityLabel')}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="999"
                disabled={isPending}
                {...field}
              />
            </FormControl>
            <FormDescription>{t('priorityDescription')}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </ReplicationRuleContainer>
  );
};
