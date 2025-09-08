import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Select,
  SelectContent,
  SelectControl,
} from '@ovhcloud/ods-react';
import { TUnattachedResource } from '../../view-models/selectUnattachedResource';

type TNetworkSelectorProps = {
  networks: TUnattachedResource[];
  onValueChange: (id: string) => void;
};

const NetworkSelector: FC<TNetworkSelectorProps> = ({
  networks,
  onValueChange,
}) => {
  const { t } = useTranslation(['actions', 'common']);

  return (
    <div className="mt-4">
      {networks.length ? (
        <Select
          items={networks}
          onValueChange={({ value }) => onValueChange(value[0] ?? '')}
        >
          <SelectControl
            placeholder={t('common:pci_instances_common_search')}
          />
          <SelectContent />
        </Select>
      ) : (
        <Message
          color={MESSAGE_COLOR.warning}
          className="mt-6"
          dismissible={false}
        >
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {t('pci_instances_actions_instance_network_network_empty_message')}
          </MessageBody>
        </Message>
      )}
    </div>
  );
};

export default NetworkSelector;
