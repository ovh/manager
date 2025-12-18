import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Checkbox,
  CheckboxControl,
  CheckboxLabel,
  FormField,
  FormFieldLabel,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useZfsOptions, useUpdateZfsOptions, useSchema } from '@/hooks/nasha';
import {
  prepareZfsOptions,
  exportZfsOptions,
  formatRecordsizeEnum,
  formatSyncEnum,
  formatBytes,
} from '@/utils/nasha.utils';
import { urls } from '@/routes/Routes.constants';
import {
  ZFS_OPTIONS_TEMPLATES,
  PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION,
} from '@/constants/nasha.constants';
import type { ZfsOptionsModel, EnumOption } from '@/types/nasha.type';

interface PartitionsContext {
  serviceName: string;
}

export default function PartitionZfsOptionsModal() {
  const { serviceName } = useOutletContext<PartitionsContext>();
  const { partitionName } = useParams<{ partitionName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('components');
  const { shell } = useContext(ShellContext);

  const [model, setModel] = useState<ZfsOptionsModel>({
    atime: false,
    recordsize: '131072',
    sync: 'standard',
    template: undefined,
  });
  const [baseModel, setBaseModel] = useState<ZfsOptionsModel | null>(null);

  const { data: zfsOptions, isLoading, error } = useZfsOptions(
    serviceName,
    partitionName || '',
  );
  const { data: schema } = useSchema();
  const updateZfsOptions = useUpdateZfsOptions(serviceName, partitionName || '');

  // Get enum options from schema
  const recordsizeOptions = useMemo(() => {
    if (!schema) return [];
    return formatRecordsizeEnum(schema, formatBytes);
  }, [schema]);

  const syncOptions = useMemo(() => {
    if (!schema) return [];
    return formatSyncEnum(schema);
  }, [schema]);

  // Templates
  const templates = useMemo(
    () => [
      {
        name: ZFS_OPTIONS_TEMPLATES.CUSTOM,
        description: t('nasha_components_partition_zfs_options_custom_template_selection'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.FILE_SYSTEM,
        description: t('nasha_components_partition_zfs_options_template_1_description'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.VIRTUAL_MACHINES,
        description: t('nasha_components_partition_zfs_options_template_2_description'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DATABASES,
        description: t('nasha_components_partition_zfs_options_template_3_description'),
      },
      {
        name: ZFS_OPTIONS_TEMPLATES.DEFAULT,
        description: t('nasha_components_partition_zfs_options_template_4_description'),
      },
    ],
    [t],
  );

  // Initialize model from API data
  useEffect(() => {
    if (zfsOptions || error) {
      const options = prepareZfsOptions(zfsOptions);
      const initialModel = { ...options, template: undefined };
      setModel(initialModel);
      setBaseModel(initialModel);
    }
  }, [zfsOptions, error]);

  const handleClose = () => {
    navigate(urls.partitions(serviceName));
  };

  const handleCancelClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const isCustomSelection = model.template?.name === ZFS_OPTIONS_TEMPLATES.CUSTOM;

  const canSubmit = useMemo(() => {
    if (!baseModel) return false;
    return (
      model.atime !== baseModel.atime ||
      model.recordsize !== baseModel.recordsize ||
      model.sync !== baseModel.sync ||
      model.template !== baseModel.template
    );
  }, [model, baseModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partitionName) return;

    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_ZFS_OPTION}::confirm`,
      type: 'action',
    });

    try {
      const exportedOptions = exportZfsOptions(model, ZFS_OPTIONS_TEMPLATES.CUSTOM);
      await updateZfsOptions.mutateAsync(exportedOptions);
      handleClose();
    } catch (err) {
      console.error('Failed to update ZFS options:', err);
    }
  };

  const getRecordsizeLabel = (opt: EnumOption) =>
    opt.default
      ? `${opt.label} ${t('nasha_components_partition_zfs_options_default')}`
      : opt.label;

  if (isLoading) {
    return (
      <Modal open onOpenChange={(open) => !open && handleClose()}>
        <ModalContent color={MODAL_COLOR.primary}>
          <ModalBody>
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal open onOpenChange={(open) => !open && handleClose()}>
      <ModalContent color={MODAL_COLOR.primary}>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <h2 className="text-xl font-semibold mb-4">
              {t('nasha_components_partition_zfs_options_title')}
            </h2>

            {/* Template Selection */}
            <FormField className="mb-4">
              <FormFieldLabel>
                {t('nasha_components_partition_zfs_template_selection_title')}
              </FormFieldLabel>
              <Select
                value={model.template?.name || ''}
                onValueChange={(value) => {
                  const template = templates.find((tpl) => tpl.name === value);
                  setModel((prev) => ({ ...prev, template }));
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      'nasha_components_partition_zfs_template_selection_placeholder',
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tpl) => (
                    <SelectItem key={tpl.name} value={tpl.name}>
                      <div>
                        <div>{tpl.name}</div>
                        {tpl.description && (
                          <Text preset={TEXT_PRESET.caption} className="text-gray-500">
                            {tpl.description}
                          </Text>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* Custom Options */}
            {isCustomSelection && (
              <>
                {/* Atime */}
                <FormField className="mb-4">
                  <FormFieldLabel>
                    {t('nasha_components_partition_zfs_options_atime')}
                  </FormFieldLabel>
                  <Checkbox
                    checked={model.atime}
                    onCheckedChange={(checked) =>
                      setModel((prev) => ({ ...prev, atime: !!checked }))
                    }
                  >
                    <CheckboxControl />
                    <CheckboxLabel>
                      {t('nasha_components_partition_zfs_options_atime_deactivate')}
                    </CheckboxLabel>
                  </Checkbox>
                  <Text preset={TEXT_PRESET.caption} className="text-gray-500 mt-1">
                    {t('nasha_components_partition_zfs_options_atime_description')}
                  </Text>
                </FormField>

                {/* Recordsize */}
                <FormField className="mb-4">
                  <FormFieldLabel>
                    {t('nasha_components_partition_zfs_options_recordsize')}
                  </FormFieldLabel>
                  <Select
                    value={model.recordsize}
                    onValueChange={(value) =>
                      setModel((prev) => ({ ...prev, recordsize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {recordsizeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {getRecordsizeLabel(opt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Sync */}
                <FormField className="mb-4">
                  <FormFieldLabel>
                    {t('nasha_components_partition_zfs_options_sync')}
                  </FormFieldLabel>
                  <RadioGroup
                    value={model.sync}
                    onValueChange={(value) =>
                      setModel((prev) => ({ ...prev, sync: value }))
                    }
                    className="space-y-2"
                  >
                    {syncOptions.map((opt) => (
                      <Radio key={opt.value} value={opt.value}>
                        <RadioControl />
                        <div>
                          <RadioLabel>
                            {opt.label}
                            {opt.default && (
                              <span className="ml-1 text-gray-500">
                                {t('nasha_components_partition_zfs_options_default')}
                              </span>
                            )}
                          </RadioLabel>
                          <Text preset={TEXT_PRESET.caption} className="text-gray-500 block">
                            {t(
                              `nasha_components_partition_zfs_options_sync_${opt.value}_description`,
                            )}
                          </Text>
                          {opt.value === 'disabled' && (
                            <Text
                              preset={TEXT_PRESET.caption}
                              className="text-red-500 font-semibold block"
                            >
                              {t(
                                'nasha_components_partition_zfs_options_sync_disabled_warning',
                              )}
                            </Text>
                          )}
                        </div>
                      </Radio>
                    ))}
                  </RadioGroup>
                </FormField>
              </>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={handleCancelClick}
                disabled={updateZfsOptions.isPending}
              >
                {t('nasha_components_partition_zfs_options_cancel')}
              </Button>
              <Button
                type="submit"
                color={BUTTON_COLOR.primary}
                disabled={!canSubmit || updateZfsOptions.isPending}
                loading={updateZfsOptions.isPending}
              >
                {t('nasha_components_partition_zfs_options_submit')}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}

