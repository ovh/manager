import { FC } from 'react';
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
  Text,
} from '@ovhcloud/ods-react';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { TUnattachedResource } from '../view-models/selectUnattachedResource';

type TVolumeSelectorProps = {
  volumes: TUnattachedResource[];
  onValueChange: (id: string) => void;
};

const VolumeSelector: FC<TVolumeSelectorProps> = ({
  volumes,
  onValueChange,
}) => {
  const { t } = useTranslation('actions');
  const projectUrl = useProjectUrl('public-cloud');
  const createVolumeUrl = `${projectUrl}/storages/blocks`;

  return (
    <div className="mt-4">
      {volumes.length ? (
        <>
          <FormField>
            <FormFieldLabel>
              {t('pci_instances_actions_instance_volume_attach_selector_label')}
            </FormFieldLabel>
            <Select
              items={volumes}
              onValueChange={({ value }) => onValueChange(value[0] ?? '')}
            >
              <SelectControl
                placeholder={t(
                  'pci_instances_actions_instance_volume_attach_select',
                )}
              />
              <SelectContent />
            </Select>
          </FormField>
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
