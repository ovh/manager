import { FormEvent, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Radio,
  RadioGroup,
} from '@ovh-ux/muk';

import { type ZfsOptions, formatRecordsizeEnum, formatSyncEnum } from '@/utils/Zfs.utils';

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

type Template = {
  name: string;
  description: string;
};

type ZfsOptionsFormProps = {
  model: ZfsOptions;
  templates: Template[];
  isCustomSelection: boolean;
  canSubmit: boolean;
  isPending: boolean;
  onTemplateChange: (templateName: string) => void;
  onAtimeChange: (checked: boolean) => void;
  onRecordsizeChange: (value: string) => void;
  onSyncChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => Promise<void>;
};

export function ZfsOptionsForm({
  model,
  templates,
  isCustomSelection,
  canSubmit,
  isPending,
  onTemplateChange,
  onAtimeChange,
  onRecordsizeChange,
  onSyncChange,
  onCancel,
  onSubmit,
}: ZfsOptionsFormProps) {
  const { t } = useTranslation(['partition']);

  const recordsizeEnum = useMemo(() => formatRecordsizeEnum(formatBytes), []);
  const syncEnum = useMemo(() => formatSyncEnum(), []);

  const getRecordsizeLabel = (recordsize: { default: boolean; label: string; value: string }) => {
    return recordsize.default
      ? `${recordsize.label} ${t('partition:zfs_options.default', '(default)')}`
      : recordsize.label;
  };

  return (
    <form
      onSubmit={(e) => {
        void onSubmit(e);
      }}
      className="max-w-2xl"
    >
      {/* Template selection */}
      <FormField>
        <FormFieldLabel>
          {t('partition:zfs_options.template_selection_title', 'Template Selection')}
        </FormFieldLabel>
        <select
          value={model.template?.name || ''}
          onChange={(e) => onTemplateChange(e.target.value)}
          disabled={isPending}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">
            {t('partition:zfs_options.template_placeholder', 'Select a template')}
          </option>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
              {template.description ? ` - ${template.description}` : ''}
            </option>
          ))}
        </select>
      </FormField>

      {/* Custom options (only shown when Custom template is selected) */}
      {isCustomSelection && (
        <>
          {/* Atime */}
          <FormField>
            <FormFieldLabel>
              {t('partition:zfs_options.atime', 'Access Time (atime)')}
            </FormFieldLabel>
            <Checkbox
              checked={model.atime}
              onChange={(e) => onAtimeChange((e.target as HTMLInputElement).checked)}
              disabled={isPending}
            >
              {t('partition:zfs_options.atime_deactivate', 'Deactivate access time')}
            </Checkbox>
            <FormFieldHelper>
              {t(
                'partition:zfs_options.atime_description',
                'Disable access time updates for better performance',
              )}
            </FormFieldHelper>
          </FormField>

          {/* Recordsize */}
          <FormField>
            <FormFieldLabel>{t('partition:zfs_options.recordsize', 'Record Size')}</FormFieldLabel>
            <select
              value={model.recordsize}
              onChange={(e) => onRecordsizeChange(e.target.value)}
              disabled={isPending}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {recordsizeEnum.map((recordsize) => (
                <option key={recordsize.value} value={recordsize.value}>
                  {getRecordsizeLabel(recordsize)}
                </option>
              ))}
            </select>
          </FormField>

          {/* Sync */}
          <FormField>
            <FormFieldLabel>{t('partition:zfs_options.sync', 'Synchronization')}</FormFieldLabel>
            <RadioGroup
              value={model.sync}
              onChange={(e: FormEvent<HTMLDivElement>) => {
                const target = e.currentTarget as HTMLDivElement;
                const radio = target.querySelector(
                  'input[type="radio"]:checked',
                ) as HTMLInputElement | null;
                if (radio?.value) onSyncChange(radio.value);
              }}
              disabled={isPending}
            >
              {syncEnum.map((sync) => (
                <Radio key={sync.value} value={sync.value}>
                  <div className="ml-2">
                    <div className="font-medium">
                      {sync.label}
                      {sync.default && (
                        <span className="ml-2 text-sm text-gray-500">
                          {t('partition:zfs_options.default', '(default)')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t(`partition:zfs_options.sync_${sync.value}_description`, sync.value)}
                      {sync.value === 'disabled' && (
                        <strong className="block mt-1 text-red-600">
                          {t(
                            'partition:zfs_options.sync_disabled_warning',
                            'Warning: Disabling sync can lead to data loss',
                          )}
                        </strong>
                      )}
                    </div>
                  </div>
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
          disabled={!canSubmit || isPending}
          loading={isPending}
        >
          {t('partition:zfs_options.submit', 'Confirm')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
          {t('partition:zfs_options.cancel', 'Cancel')}
        </Button>
      </div>
    </form>
  );
}
