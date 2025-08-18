import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { Select, SelectControl, SelectContent } from '@ovhcloud/ods-react';
import { TUnattachedResource } from '../view-models/selectUnattachedResource';

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
        <OsdsMessage type={ODS_MESSAGE_TYPE.warning} className="mt-6">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.default}
          >
            {t('pci_instances_actions_instance_network_network_empty_message')}
          </OsdsText>
        </OsdsMessage>
      )}
    </div>
  );
};

export default NetworkSelector;
