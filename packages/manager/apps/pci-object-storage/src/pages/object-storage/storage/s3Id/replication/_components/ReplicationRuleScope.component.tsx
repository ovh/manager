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
} from '@datatr-ux/uxlib';
import { AddReplicationFormValues } from '../new/formAddReplication/useAddReplicationForm.hook';
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
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="replication-application-limited"
                  name="replication-application"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  disabled={isPending}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="replication-application-limited"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t('replicationApplicationLimited')}
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="replication-application-all"
                  name="replication-application"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  disabled={isPending}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="replication-application-all"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t('replicationApplicationForAll')}
                </label>
              </div>
            </div>
            {field.value && (
              <Alert>
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
