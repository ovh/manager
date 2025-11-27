import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, FormField, FormFieldHelper, FormFieldLabel, Input } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useAuthorizableAccesses } from '@/hooks/partitions/useAuthorizableAccesses';
import { useCreateAccessForm } from '@/hooks/partitions/useCreateAccessForm';
import { usePartitionAccesses } from '@/hooks/partitions/usePartitionAccesses';
import { usePartitionDetail } from '@/hooks/partitions/usePartitionDetail';

const ACL_TYPE_OPTIONS = [
  { value: 'readwrite', label: 'Read write' },
  { value: 'readonly', label: 'Read' },
] as const;

const NFS_PROTOCOL = 'NFS';

export default function CreateAccessPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  // Fetch data
  const { data: partition } = usePartitionDetail(serviceName ?? '', partitionName ?? '');
  const { data: authorizableAccesses, isLoading: isLoadingAuthorizable } = useAuthorizableAccesses(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: existingAccesses } = usePartitionAccesses(serviceName ?? '', partitionName ?? '');

  const { form, handleSubmit, isSubmitting } = useCreateAccessForm({
    serviceName,
    partitionName,
    onSuccess: (taskId) => {
      if (taskId) {
        void navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercPartitionAccessAdd',
            params: { partitionName, ip: form.getValues('ip').trim() },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        void navigate('..');
      }
    },
  });

  // Filter out already used IPs
  const availableAccesses = useMemo(() => {
    if (!authorizableAccesses || !existingAccesses) {
      return [];
    }
    const usedIps = new Set((existingAccesses || []).map((a) => a.ip));
    return authorizableAccesses.filter((a) => !usedIps.has(a.ip));
  }, [authorizableAccesses, existingAccesses]);

  // Filter ACL type options based on protocol
  const aclTypeOptions = useMemo(() => {
    const protocol = partition?.protocol?.toUpperCase();
    if (protocol === NFS_PROTOCOL) {
      return ACL_TYPE_OPTIONS;
    }
    // For CIFS, only readwrite is available
    return ACL_TYPE_OPTIONS.filter((opt) => opt.value === 'readwrite');
  }, [partition]);

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create', 'cancel'],
    });
    // Navigate back to accesses list using relative path
    void navigate('..', { replace: true });
  };

  const onSubmit = async () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create', 'confirm'],
    });

    try {
      await handleSubmit();
    } catch {
      // Error handled by form
    }
  };

  return (
    <BaseLayout
      header={{
        title: t('partition:accesses.create.title', 'Add a new access'),
      }}
      description={t(
        'partition:accesses.create.description',
        'Add an IP address or range authorized to access this partition',
      )}
    >
      <form onSubmit={void handleSubmit} className="flex flex-col gap-4">
        <FormField>
          <FormFieldLabel>
            {t('partition:accesses.create.ip_label', 'IP or IP block')} *
          </FormFieldLabel>
          <select
            {...form.register('ip')}
            disabled={isLoadingAuthorizable || isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">
              {t('partition:accesses.create.ip_placeholder', 'Select an IP or IP block')}
            </option>
            {availableAccesses.map((access) => (
              <option key={access.ip} value={access.ip}>
                {access.ip} ({access.type})
              </option>
            ))}
          </select>
          {form.formState.errors.ip && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.ip.message}
            </FormFieldHelper>
          )}
        </FormField>

        <FormField>
          <FormFieldLabel>{t('partition:accesses.create.type_label', 'Type')} *</FormFieldLabel>
          <select
            {...form.register('type')}
            disabled={isSubmitting}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            {aclTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {form.formState.errors.type && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.type.message}
            </FormFieldHelper>
          )}
        </FormField>

        <FormField>
          <FormFieldLabel>
            {t('partition:accesses.create.description_label', 'Description (optional)')}
          </FormFieldLabel>
          <Input
            type="text"
            {...form.register('description')}
            disabled={isSubmitting}
            maxLength={50}
          />
          {form.formState.errors.description && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.description.message}
            </FormFieldHelper>
          )}
        </FormField>

        {form.formState.errors.root && (
          <div className="text-critical">{form.formState.errors.root.message}</div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partition:accesses.create.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !form.formState.isValid}
            loading={isSubmitting}
            onClick={void onSubmit}
          >
            {t('partition:accesses.create.submit', 'Add access')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
