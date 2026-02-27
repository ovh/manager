import { useTranslation } from 'react-i18next';
import {
  Alert,
  AlertDescription,
  Input,
  RadioGroup,
  RadioGroupItem,
  Label,
  FieldDescription,
  FieldLabel,
} from '@datatr-ux/uxlib';
import { Info } from 'lucide-react';
import { FormField } from '@/components/form-field/FormField.component';
import { TagInput } from '@/components/tag-input/TagInput.component';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';
import { useReplicationFormContext } from './ReplicationForm.context';

export const ReplicationRuleScope = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const {
    form,
    isPending,
    showScopeFields,
    isTagsDisabled,
  } = useReplicationFormContext();

  return (
    <ReplicationRuleContainer title={t('replicationApplicationLabel')}>
      <FormField name="isReplicationApplicationLimited" form={form}>
        {(field) => (
          <>
            <FieldDescription>
              {t('replicationApplicationDescription')}
            </FieldDescription>
            <RadioGroup
              value={field.value ? 'limited' : 'all'}
              onValueChange={(value) => field.onChange(value === 'limited')}
              disabled={isPending}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  value="limited"
                  id="replication-application-limited"
                />
                <Label
                  htmlFor="replication-application-limited"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t('replicationApplicationLimited')}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="all" id="replication-application-all" />
                <Label
                  htmlFor="replication-application-all"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t('replicationApplicationForAll')}
                </Label>
              </div>
            </RadioGroup>
            {field.value && (
              <Alert variant="information" className="rounded-md my-2">
                <AlertDescription className="flex gap-2 items-center">
                  <Info className="size-4" />
                  {t('replicationApplicationLimitedHelper')}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </FormField>

      {showScopeFields && (
        <>
          <FormField name="prefix" form={form}>
            {(field) => (
              <>
                <FieldLabel>{t('prefixLabel')}</FieldLabel>
                <Input disabled={isPending} {...field} />
                <FieldDescription>{t('prefixDescription')}</FieldDescription>
              </>
            )}
          </FormField>

          <FormField name="tags" form={form}>
            {(field) => (
              <>
                <TagInput
                  tags={field.value}
                  setTags={(tags) => field.onChange(tags)}
                  isPending={isPending}
                  disabled={isTagsDisabled}
                  t={t}
                />
                {isTagsDisabled && (
                  <Alert variant="information">
                    <AlertDescription className="flex gap-2 items-center">
                      <Info className="size-4" />
                      {t('tagsDisabledHelper')}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </FormField>
        </>
      )}
    </ReplicationRuleContainer>
  );
};
