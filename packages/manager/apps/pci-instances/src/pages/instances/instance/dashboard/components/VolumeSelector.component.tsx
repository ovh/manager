import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldLabel,
  Icon,
  Link,
  Message,
  MessageBody,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { TUnattachedVolume } from '../view-models/selectUnattachedResource';

type TVolumeSelectorProps = {
  volume: TUnattachedVolume | null;
  volumes: TUnattachedVolume[];
  onValueChange: (volume: TUnattachedVolume) => void;
};

const VolumeSelector: FC<TVolumeSelectorProps> = ({
  volume,
  volumes,
  onValueChange,
}) => {
  const { t } = useTranslation('actions');
  const projectUrl = useProjectUrl('public-cloud');
  const createVolumeUrl = `${projectUrl}/storages/blocks`;

  const handleVolumeChange = useCallback(
    ({ items }: SelectValueChangeDetail) => {
      const volume = items[0];

      if (volume) onValueChange(volume as TUnattachedVolume);
    },
    [onValueChange],
  );

  return (
    <div className="mt-4">
      {volumes.length ? (
        <>
          <FormField>
            <FormFieldLabel>
              {t('pci_instances_actions_instance_volume_attach_selector_label')}
            </FormFieldLabel>
            <Select items={volumes} onValueChange={handleVolumeChange}>
              <SelectControl
                placeholder={t(
                  'pci_instances_actions_instance_volume_attach_select',
                )}
              />
              <SelectContent />
            </Select>
          </FormField>
          {volume?.canBeDetached && (
            <Message className="mt-5" color="warning" dismissible={false}>
              <MessageIcon
                className="self-center"
                name="triangle-exclamation"
              />
              <MessageBody>
                {t(
                  'pci_instances_actions_instance_volume_attach_detach_warning_message',
                )}
              </MessageBody>
            </Message>
          )}
          <Text className="mt-4">
            {t('pci_instances_actions_instance_volume_attach_information')}
            <Link href={createVolumeUrl}>
              {t('pci_instances_actions_instance_volume_attach_create_link')}
              <Icon name="arrow-right" />
            </Link>
          </Text>
        </>
      ) : (
        <Message color="warning" dismissible={false}>
          <MessageIcon className="self-center" name="triangle-exclamation" />
          <MessageBody>
            {t('pci_instances_actions_instance_volume_attach_empty_message')}
          </MessageBody>
        </Message>
      )}
    </div>
  );
};

export default VolumeSelector;
