import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertDescription,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@datatr-ux/uxlib';
import { Info } from 'lucide-react';
import { ReplicationRuleContainer } from './ReplicationRuleContainer.component';
import storages from '@/types/Storages';
import { FormField } from '@/components/form-field/FormField.component';
import { useReplicationFormContext } from './ReplicationForm.context';

export const ReplicationRuleAdvanced = () => {
  const {
    form,
    isPending,
    isDeleteMarkerDisabled,
    showStorageClassField,
    availableStorageClasses,
  } = useReplicationFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { t: tObj } = useTranslation(
    'pci-object-storage/storages/s3/object-class',
  );

  return (
    <>
      <ReplicationRuleContainer title={t('destinationStorageClass')}>
        <FormField name="useStorageClass" form={form}>
          {(field) => (
            <>
              <FieldDescription>
                {t('useStorageClassDescription')}
              </FieldDescription>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isPending || !form.getValues('destination.region')}
              />
              {!form.getValues('destination.region') && (
                <p className="text-xs italic">
                  {t('disabledClassDestinationHelper')}
                </p>
              )}
            </>
          )}
        </FormField>

        {showStorageClassField && (
          <FormField name="storageClass" form={form}>
            {(field) => (
              <>
                <FieldLabel>{t('storageClassLabel')}</FieldLabel>
                <Select
                  disabled={isPending}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStorageClasses.map(
                      (storeClass: storages.StorageClassEnum) => (
                        <SelectItem key={storeClass} value={storeClass}>
                          {tObj(`objectClass_${storeClass}`)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </>
            )}
          </FormField>
        )}
      </ReplicationRuleContainer>

      <ReplicationRuleContainer title={t('deleteMarkerReplication')}>
        <FormField name="deleteMarkerReplication" form={form}>
          {(field) => (
            <>
              <FieldLabel>{t('deleteMarkerReplicationLabel')}</FieldLabel>
              {isDeleteMarkerDisabled && (
                <Alert variant="information">
                  <AlertDescription className="flex gap-2 items-center">
                    <Info className="size-4" />
                    {t('deleteMarkerDisabledHelper')}
                  </AlertDescription>
                </Alert>
              )}
              <Select
                disabled={isPending || isDeleteMarkerDisabled}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger ref={field.ref}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">{t('statusEnabled')}</SelectItem>
                  <SelectItem value="disabled">
                    {t('statusDisabled')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                {t('deleteMarkerReplicationDescription')}
              </FieldDescription>
            </>
          )}
        </FormField>
      </ReplicationRuleContainer>
    </>
  );
};
