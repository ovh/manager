import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useCreatePartition, useSchema } from '@/hooks/nasha';
import { formatProtocolEnum } from '@/utils/nasha.utils';
import { urls } from '@/routes/Routes.constants';
import {
  NAME_PATTERN,
  SIZE_MIN,
  DESCRIPTION_MAX,
  PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE,
} from '@/constants/nasha.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionsContext {
  nasha: Nasha;
  serviceName: string;
  canCreatePartitions: boolean;
  partitions: NashaPartition[];
}

export default function PartitionCreateModal() {
  const { nasha, serviceName, canCreatePartitions, partitions } =
    useOutletContext<PartitionsContext>();
  const navigate = useNavigate();
  const { t } = useTranslation('components');
  const { shell } = useContext(ShellContext);

  const [partitionName, setPartitionName] = useState('');
  const [size, setSize] = useState(SIZE_MIN);
  const [partitionDescription, setPartitionDescription] = useState('');
  const [protocol, setProtocol] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: schema } = useSchema();
  const createPartition = useCreatePartition(serviceName);

  // Get existing partition names
  const existingNames = useMemo(
    () => partitions.map((p) => p.partitionName),
    [partitions],
  );

  // Calculate max size
  const partitionAllocatedSize = useMemo(
    () => partitions.reduce((sum, p) => sum + p.size, 0),
    [partitions],
  );
  const sizeMax = nasha.zpoolSize - partitionAllocatedSize;

  // Get protocol options from schema
  const protocolOptions = useMemo(() => {
    if (!schema) return [];
    return formatProtocolEnum(schema);
  }, [schema]);

  const handleClose = () => {
    navigate(urls.partitions(serviceName));
  };

  const handleCancelClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const validateForm = (): boolean => {
    if (!partitionName.trim()) {
      setError(t('nasha_components_partition_create_name_error'));
      return false;
    }
    if (!NAME_PATTERN.test(partitionName)) {
      setError(t('nasha_components_partition_create_name_rules'));
      return false;
    }
    if (existingNames.includes(partitionName)) {
      setError(t('nasha_components_partition_create_forbid'));
      return false;
    }
    if (size < SIZE_MIN || size > sizeMax) {
      setError(
        t('nasha_components_partition_create_size_rules', {
          min: SIZE_MIN,
          max: sizeMax,
        }),
      );
      return false;
    }
    if (!protocol) {
      setError(t('nasha_components_partition_create_protocol_description'));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_CREATE}::confirm_${protocol}`,
      type: 'action',
    });

    try {
      await createPartition.mutateAsync({
        partitionName,
        size,
        protocol,
        partitionDescription: partitionDescription || undefined,
      });
      handleClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to create partition');
    }
  };

  const isValid =
    partitionName.trim() &&
    NAME_PATTERN.test(partitionName) &&
    !existingNames.includes(partitionName) &&
    size >= SIZE_MIN &&
    size <= sizeMax &&
    protocol;

  // Show error if can't create partitions
  if (!canCreatePartitions) {
    return (
      <Modal open onOpenChange={(open) => !open && handleClose()}>
        <ModalContent color={MODAL_COLOR.warning}>
          <ModalBody>
            <Text preset={TEXT_PRESET.paragraph}>
              {t('nasha_components_partition_create_error_max')}
            </Text>
            <div className="flex justify-end mt-4">
              <Button color={BUTTON_COLOR.neutral} onClick={handleClose}>
                {t('nasha_components_partition_create_cancel')}
              </Button>
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
              {t('nasha_components_partition_create_title')}
            </h2>

            {/* Partition Name */}
            <FormField className="mb-4">
              <FormFieldLabel>
                {t('nasha_components_partition_create_name')}
              </FormFieldLabel>
              <Input
                type="text"
                value={partitionName}
                onChange={(e) => setPartitionName(e.target.value)}
                required
              />
              <FormFieldHelper>
                {t('nasha_components_partition_create_name_rules')}
              </FormFieldHelper>
            </FormField>

            {/* Size */}
            <FormField className="mb-4">
              <FormFieldLabel>
                {t('nasha_components_partition_create_size')}
              </FormFieldLabel>
              <Input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min={SIZE_MIN}
                max={sizeMax}
                required
              />
              <FormFieldHelper>
                {t('nasha_components_partition_create_size_rules', {
                  min: SIZE_MIN,
                  max: sizeMax,
                })}
              </FormFieldHelper>
            </FormField>

            {/* Description */}
            <FormField className="mb-4">
              <FormFieldLabel>
                {t('nasha_components_partition_create_description')}
              </FormFieldLabel>
              <Input
                type="text"
                value={partitionDescription}
                onChange={(e) => setPartitionDescription(e.target.value)}
                maxLength={DESCRIPTION_MAX}
              />
              <FormFieldHelper>
                {t('nasha_components_partition_create_description_rules', {
                  max: DESCRIPTION_MAX,
                })}
              </FormFieldHelper>
            </FormField>

            {/* Protocol */}
            <FormField className="mb-4">
              <FormFieldLabel>
                {t('nasha_components_partition_create_protocol')}
              </FormFieldLabel>
              <RadioGroup
                value={protocol}
                onValueChange={setProtocol}
                className="space-y-2"
              >
                {protocolOptions.map((opt) => (
                  <Radio key={opt.value} value={opt.value}>
                    <RadioControl />
                    <div>
                      <RadioLabel>{opt.label}</RadioLabel>
                      <Text
                        preset={TEXT_PRESET.caption}
                        className="text-gray-500 block"
                      >
                        {t(
                          `nasha_components_partition_create_protocol_description_${opt.value}`,
                        )}
                      </Text>
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            </FormField>

            {error && <FormFieldError className="mb-4">{error}</FormFieldError>}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={handleCancelClick}
                disabled={createPartition.isPending}
              >
                {t('nasha_components_partition_create_cancel')}
              </Button>
              <Button
                type="submit"
                color={BUTTON_COLOR.primary}
                disabled={!isValid || createPartition.isPending}
                loading={createPartition.isPending}
              >
                {t('nasha_components_partition_create_submit')}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}

