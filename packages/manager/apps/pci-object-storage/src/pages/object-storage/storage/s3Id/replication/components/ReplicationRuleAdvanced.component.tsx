import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@datatr-ux/uxlib';
import { AddReplicationFormValues } from '../new/formAddReplication/useAddReplicationForm.hook';
import {
  getStorageClassLabel,
  storageClassOptions,
} from '../utils/storageClass.util';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';

type ReplicationRuleAdvancedProps = {
  form: UseFormReturn<AddReplicationFormValues>;
  isPending: boolean;
  showStorageClassField: boolean;
  isDeleteMarkerDisabled: boolean;
};

export const ReplicationRuleAdvanced = ({
  form,
  isPending,
  showStorageClassField,
  isDeleteMarkerDisabled,
}: ReplicationRuleAdvancedProps) => {
  const { t } = useTranslation('pci-object-storage/replication');

  return (
    <>
      <ReplicationRuleContainer title={t('destinationStorageClass')}>
        <FormField
          control={form.control}
          name="useStorageClass"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-0.5">
                <FormDescription>
                  {t('useStorageClassDescription')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showStorageClassField && (
          <FormField
            control={form.control}
            name="storageClass"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('storageClassLabel')}</FormLabel>
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
                    {storageClassOptions.map((storageClass) => (
                      <SelectItem key={storageClass} value={storageClass}>
                        {getStorageClassLabel(storageClass, t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </ReplicationRuleContainer>

      <ReplicationRuleContainer title={t('additionalOptionsTitle')}>
        <FormField
          control={form.control}
          name="deleteMarkerReplication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('deleteMarkerReplicationLabel')}</FormLabel>
              {isDeleteMarkerDisabled && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-900">
                    {t('deleteMarkerDisabledHelper')}
                  </p>
                </div>
              )}
              <Select
                disabled={isPending || isDeleteMarkerDisabled}
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
                  <SelectItem value="disabled">
                    {t('statusDisabled')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('deleteMarkerReplicationDescription')}
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </ReplicationRuleContainer>
    </>
  );
};
