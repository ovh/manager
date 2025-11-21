import React, { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, Button, FormField, Input, Select } from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { useAuthorizableAccesses } from '@/hooks/partitions/useAuthorizableAccesses';
import { useCreateAccess } from '@/hooks/partitions/useCreateAccess';
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
  const createAccessMutation = useCreateAccess();

  // Fetch data
  const { data: partition } = usePartitionDetail(serviceName ?? '', partitionName ?? '');
  const { data: authorizableAccesses, isLoading: isLoadingAuthorizable } = useAuthorizableAccesses(
    serviceName ?? '',
    partitionName ?? '',
  );
  const { data: existingAccesses } = usePartitionAccesses(serviceName ?? '', partitionName ?? '');

  const [ip, setIp] = useState('');
  const [type, setType] = useState<string>('readwrite');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!ip.trim()) {
      newErrors.ip = t('partition:accesses.create.errors.ip_required');
    }

    if (!type) {
      newErrors.type = t('partition:accesses.create.errors.type_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !serviceName || !partitionName) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partition', 'accesses', 'create', 'confirm'],
    });

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await createAccessMutation.mutateAsync({
        serviceName,
        partitionName,
        ip: ip.trim(),
        type,
        aclDescription: description.trim() || undefined,
      });

      // Navigate to task tracker if task was returned
      const taskId = result?.taskId || result?.id;
      if (taskId) {
        void navigate(`../task-tracker`, {
          state: {
            taskId,
            operation: 'clusterLeclercPartitionAccessAdd',
            params: { partitionName, ip: ip.trim() },
            taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          },
        });
      } else {
        // If no task, just go back to accesses list
        void navigate('..');
      }
    } catch (err) {
      setErrors({
        submit: (err as Error).message || t('partition:accesses.create.errors.submit_failed'),
      });
      setIsSubmitting(false);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label={t('partition:accesses.create.ip_label', 'IP or IP block')}
          error={errors.ip}
          required
        >
          <Select
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            disabled={isLoadingAuthorizable || isSubmitting}
            placeholder={t('partition:accesses.create.ip_placeholder', 'Select an IP or IP block')}
          >
            <option value="">
              {t('partition:accesses.create.ip_placeholder', 'Select an IP or IP block')}
            </option>
            {availableAccesses.map((access) => (
              <option key={access.ip} value={access.ip}>
                {access.ip} ({access.type})
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={t('partition:accesses.create.type_label', 'Type')}
          error={errors.type}
          required
        >
          <Select value={type} onChange={(e) => setType(e.target.value)} disabled={isSubmitting}>
            {aclTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={t('partition:accesses.create.description_label', 'Description (optional)')}
          error={errors.description}
        >
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={50}
          />
        </FormField>

        {errors.submit && <div className="text-critical">{errors.submit}</div>}

        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partition:accesses.create.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !ip || !type}
            loading={isSubmitting}
          >
            {t('partition:accesses.create.submit', 'Add access')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
