import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/muk';

import { ZfsOptionsForm } from '@/components/partitions/zfs-options/ZfsOptionsForm.component';
import { useZfsOptions } from '@/hooks/partitions/useZfsOptions';
import { useZfsOptionsForm } from '@/hooks/partitions/useZfsOptionsForm';
import { ZFS_OPTIONS_TEMPLATES } from '@/utils/Zfs.utils';

type Template = {
  name: string;
  description: string;
};

export default function ZfsOptionsPage() {
  const { serviceName, partitionName } = useParams<{
    serviceName: string;
    partitionName: string;
  }>();
  const { t } = useTranslation(['partition']);

  const { data: zfsOptions, isLoading: isLoadingOptions } = useZfsOptions(
    serviceName ?? '',
    partitionName ?? '',
  );

  // Templates
  const templates = useMemo<Template[]>(
    () => [
      {
        name: ZFS_OPTIONS_TEMPLATES.CUSTOM,
        description: t('partition:zfs_options.template_custom_description', 'Custom configuration'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.FILE_SYSTEM,
        description: t(
          'partition:zfs_options.template_file_system_description',
          'Optimized for large files',
        ),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.VIRTUAL_MACHINES,
        description: t(
          'partition:zfs_options.template_vm_description',
          'Optimized for virtual machines',
        ),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DATABASES,
        description: t(
          'partition:zfs_options.template_databases_description',
          'Optimized for databases',
        ),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DEFAULT,
        description: t(
          'partition:zfs_options.template_default_description',
          'Default configuration',
        ),
      },
    ],
    [t],
  );

  const {
    model,
    isCustomSelection,
    canSubmit,
    isPending,
    handleTemplateChange,
    handleAtimeChange,
    handleRecordsizeChange,
    handleSyncChange,
    handleCancel,
    handleSubmit,
  } = useZfsOptionsForm({
    serviceName,
    partitionName,
    initialOptions: zfsOptions ?? null,
  });

  if (isLoadingOptions || !model) {
    return (
      <BaseLayout
        header={{
          title: t('partition:zfs_options.title', 'ZFS Options'),
        }}
        description={partitionName}
      >
        <div>Loading...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('partition:zfs_options.title', 'ZFS Options'),
      }}
      description={partitionName}
    >
      <ZfsOptionsForm
        model={model}
        templates={templates}
        isCustomSelection={isCustomSelection}
        canSubmit={canSubmit}
        isPending={isPending}
        onTemplateChange={(templateName) => handleTemplateChange(templateName, templates)}
        onAtimeChange={handleAtimeChange}
        onRecordsizeChange={handleRecordsizeChange}
        onSyncChange={handleSyncChange}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </BaseLayout>
  );
}
