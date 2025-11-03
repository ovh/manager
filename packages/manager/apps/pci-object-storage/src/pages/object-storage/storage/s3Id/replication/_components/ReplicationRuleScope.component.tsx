import { useTranslation } from 'react-i18next';
import { UseFormReturn, Controller } from 'react-hook-form';
import {
  Alert,
  AlertDescription,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Label,
} from '@datatr-ux/uxlib';
import { AddReplicationFormValues } from '../new/useAddReplicationForm.hook';
import { TagInput } from './TagInput.component';
import { ReplicationRuleContainer } from './ReplicatationRuleContainer';

type ReplicationRuleScopeProps = {
  form: UseFormReturn<AddReplicationFormValues>;
  isPending: boolean;
  showScopeFields: boolean;
  isTagsDisabled: boolean;
};

export const ReplicationRuleScope = ({
  form,
  isPending,
  showScopeFields,
  isTagsDisabled,
}: ReplicationRuleScopeProps) => {
  const { t } = useTranslation('pci-object-storage/replication');

  return (
    <ReplicationRuleContainer title={t('replicationApplicationLabel')}>
      <FormField
        control={form.control}
        name="isReplicationApplicationLimited"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <div className="space-y-2">
              <FormDescription>
                {t('replicationApplicationDescription')}
              </FormDescription>
            </div>
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
                <AlertDescription>
                  {t('replicationApplicationLimitedHelper')}
                </AlertDescription>
              </Alert>
            )}
          </FormItem>
        )}
      />

      {showScopeFields && (
        <>
          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('prefixLabel')}</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormDescription>{t('prefixDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Controller
            control={form.control}
            name="tags"
            render={({ field }) => (
              <>
                <TagInput
                  tags={field.value}
                  setTags={(tags) => field.onChange(tags)}
                  isPending={isPending}
                  disabled={isTagsDisabled}
                />
                {isTagsDisabled && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mt-2">
                    <p className="text-sm text-blue-900">
                      {t('tagsDisabledHelper')}
                    </p>
                  </div>
                )}
              </>
            )}
          />
        </>
      )}
    </ReplicationRuleContainer>
  );
};
