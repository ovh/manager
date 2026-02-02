import { useTranslation } from 'react-i18next';
import {
  FieldDescription,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@datatr-ux/uxlib';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';
import { FormField } from '@/components/form-field/FormField.component';
import { useReplicationFormContext } from './ReplicationForm.context';

export const ReplicationRuleIdentification = () => {
  const {
    form,
    isPending,
    isEditMode,
    replicationTitle,
  } = useReplicationFormContext();
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');

  return (
    <ReplicationRuleContainer title={replicationTitle}>
      <FormField name="ruleId" form={form}>
        {(field) => (
          <>
            <FieldLabel>{t('ruleIdLabel')}</FieldLabel>
            <Input {...field} disabled={isEditMode} />
            <FieldDescription>{t('ruleIdDescription')}</FieldDescription>
          </>
        )}
      </FormField>
      <FormField name="status" form={form}>
        {(field) => (
          <>
            <FieldLabel>{t('statusLabel')}</FieldLabel>
            <Select
              disabled={isPending}
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger ref={field.ref}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">{t('statusEnabled')}</SelectItem>
                <SelectItem value="disabled">{t('statusDisabled')}</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </FormField>
      <FormField name="priority" form={form}>
        {(field) => (
          <>
            <FieldLabel>{t('priorityLabel')}</FieldLabel>
            <Input type="number" {...field} />
            <FieldDescription>{t('priorityDescription')}</FieldDescription>
          </>
        )}
      </FormField>
    </ReplicationRuleContainer>
  );
};
