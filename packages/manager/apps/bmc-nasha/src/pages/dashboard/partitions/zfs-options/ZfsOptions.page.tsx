import { useState, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, FormField, Button, Select, Checkbox, RadioGroup, Radio } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/nasha.constants';
import { useZfsOptions, useUpdateZfsOptions } from '@/hooks/partitions/useZfsOptions';
import { APP_NAME } from '@/Tracking.constants';
import {
  ZFS_OPTIONS_TEMPLATES,
  formatRecordsizeEnum,
  formatSyncEnum,
  type ZfsOptions,
} from '@/utils/zfs.utils';

type Template = {
  name: string;
  description: string;
};

// Format bytes utility
function formatBytes(bytes: number, binary = false): string {
  const units = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const base = binary ? 1024 : 1000;
  if (!bytes) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(base));
  return `${parseFloat((bytes / base ** i).toFixed(1))} ${units[i]}`;
}

export default function ZfsOptionsPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['common', 'partition']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: zfsOptions, isLoading: isLoadingOptions } = useZfsOptions(
    serviceName ?? '',
    partitionName ?? '',
  );
  const updateZfsOptionsMutation = useUpdateZfsOptions();

  const [model, setModel] = useState<ZfsOptions | null>(null);
  const [baseModel, setBaseModel] = useState<ZfsOptions | null>(null);

  // Templates
  const templates = useMemo<Template[]>(
    () => [
      {
        name: ZFS_OPTIONS_TEMPLATES.CUSTOM,
        description: t('partition:zfs_options.template_custom_description', 'Custom configuration'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.FILE_SYSTEM,
        description: t('partition:zfs_options.template_file_system_description', 'Optimized for large files'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.VIRTUAL_MACHINES,
        description: t('partition:zfs_options.template_vm_description', 'Optimized for virtual machines'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DATABASES,
        description: t('partition:zfs_options.template_databases_description', 'Optimized for databases'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DEFAULT,
        description: t('partition:zfs_options.template_default_description', 'Default configuration'),
      },
    ],
    [t],
  );

  // Recordsize and sync enums
  const recordsizeEnum = useMemo(() => formatRecordsizeEnum(formatBytes), []);
  const syncEnum = useMemo(() => formatSyncEnum(), []);

  // Initialize model when options are loaded
  useEffect(() => {
    if (zfsOptions) {
      setModel({ ...zfsOptions });
      setBaseModel({ ...zfsOptions });
    }
  }, [zfsOptions]);

  // Check if custom template is selected
  const isCustomSelection = useMemo(
    () => model?.template?.name === ZFS_OPTIONS_TEMPLATES.CUSTOM,
    [model],
  );

  // Check if form can be submitted (has changes)
  const canSubmit = useMemo(() => {
    if (!model || !baseModel) return false;
    return (
      model.atime !== baseModel.atime ||
      model.recordsize !== baseModel.recordsize ||
      model.sync !== baseModel.sync ||
      model.template?.name !== baseModel.template?.name
    );
  }, [model, baseModel]);

  const handleTemplateChange = (templateName: string) => {
    if (!model) return;
    const template = templates.find((t) => t.name === templateName);
    setModel({
      ...model,
      template: template ? { name: template.name, description: template.description } : undefined,
    });
  };

  const handleAtimeChange = (checked: boolean) => {
    if (!model) return;
    setModel({ ...model, atime: checked });
  };

  const handleRecordsizeChange = (value: string) => {
    if (!model) return;
    setModel({ ...model, recordsize: value });
  };

  const handleSyncChange = (value: string) => {
    if (!model) return;
    setModel({ ...model, sync: value });
  };

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'zfs-options', 'cancel'],
    });
    // Navigate back to partitions list using relative path
    navigate('../..', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName || !partitionName || !model) return;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'zfs-options', 'confirm'],
    });

    try {
      const result = await updateZfsOptionsMutation.mutateAsync({
        serviceName,
        partitionName,
        options: model,
      });

      // Navigate to task tracker
      navigate('../task-tracker', {
        replace: true,
        state: {
          taskId: result.taskId,
          operation: 'clusterLeclercZfsOptions',
          params: { partitionName },
          taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          trackingData: {
            prefix: `${PREFIX_TRACKING_DASHBOARD_PARTITIONS}::zfs-options`,
            hit: 'close',
          },
        },
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error('Failed to update ZFS options:', error);
    }
  };

  if (isLoadingOptions || !model) {
    return (
      <BaseLayout
        header={{
          title: t('partition:zfs_options.title', 'ZFS Options'),
          description: partitionName,
        }}
      >
        <div>Loading...</div>
      </BaseLayout>
    );
  }

  const getRecordsizeLabel = (recordsize: { default: boolean; label: string; value: string }) => {
    return recordsize.default
      ? `${recordsize.label} ${t('partition:zfs_options.default', '(default)')}`
      : recordsize.label;
  };

  return (
    <BaseLayout
      header={{
        title: t('partition:zfs_options.title', 'ZFS Options'),
        description: partitionName,
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Template selection */}
        <FormField>
          <FormField.Label>
            {t('partition:zfs_options.template_selection_title', 'Template Selection')}
          </FormField.Label>
          <Select
            value={model.template?.name || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            disabled={updateZfsOptionsMutation.isPending}
          >
            <option value="">{t('partition:zfs_options.template_placeholder', 'Select a template')}</option>
            {templates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
                {template.description ? ` - ${template.description}` : ''}
              </option>
            ))}
          </Select>
        </FormField>

        {/* Custom options (only shown when Custom template is selected) */}
        {isCustomSelection && (
          <>
            {/* Atime */}
            <FormField>
              <FormField.Label>
                {t('partition:zfs_options.atime', 'Access Time (atime)')}
              </FormField.Label>
              <Checkbox
                checked={model.atime}
                onChange={(e) => handleAtimeChange(e.target.checked)}
                disabled={updateZfsOptionsMutation.isPending}
              >
                {t('partition:zfs_options.atime_deactivate', 'Deactivate access time')}
              </Checkbox>
              <FormField.Helper>
                {t('partition:zfs_options.atime_description', 'Disable access time updates for better performance')}
              </FormField.Helper>
            </FormField>

            {/* Recordsize */}
            <FormField>
              <FormField.Label>
                {t('partition:zfs_options.recordsize', 'Record Size')}
              </FormField.Label>
              <Select
                value={model.recordsize}
                onChange={(e) => handleRecordsizeChange(e.target.value)}
                disabled={updateZfsOptionsMutation.isPending}
              >
                {recordsizeEnum.map((recordsize) => (
                  <option key={recordsize.value} value={recordsize.value}>
                    {getRecordsizeLabel(recordsize)}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* Sync */}
            <FormField>
              <FormField.Label>
                {t('partition:zfs_options.sync', 'Synchronization')}
              </FormField.Label>
              <RadioGroup
                value={model.sync}
                onChange={(value) => handleSyncChange(value)}
                disabled={updateZfsOptionsMutation.isPending}
              >
                {syncEnum.map((sync) => (
                  <Radio key={sync.value} value={sync.value}>
                    <Radio.Label>
                      {sync.label}
                      {sync.default && (
                        <span className="ml-2 text-sm text-gray-500">
                          {t('partition:zfs_options.default', '(default)')}
                        </span>
                      )}
                    </Radio.Label>
                    <Radio.Description>
                      {t(`partition:zfs_options.sync_${sync.value}_description`, sync.value)}
                      {sync.value === 'disabled' && (
                        <strong className="block mt-1 text-red-600">
                          {t('partition:zfs_options.sync_disabled_warning', 'Warning: Disabling sync can lead to data loss')}
                        </strong>
                      )}
                    </Radio.Description>
                  </Radio>
                ))}
              </RadioGroup>
            </FormField>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={!canSubmit || updateZfsOptionsMutation.isPending}
            isLoading={updateZfsOptionsMutation.isPending}
          >
            {t('partition:zfs_options.submit', 'Confirm')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={updateZfsOptionsMutation.isPending}
          >
            {t('partition:zfs_options.cancel', 'Cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}

