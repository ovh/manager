import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelecSearchInput,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectOptions,
  MultiSelectValue,
} from '@datatr-ux/uxlib';
import { TNetwork } from '@/types/network/entity.type';

type TNetworkSelectorProps = {
  networkIds: string[];
  setNetworkIds: (ids: string[]) => void;
  networkOptions: TNetwork[];
};

const NetworkSelector: FC<TNetworkSelectorProps> = ({
  networkIds,
  networkOptions,
  setNetworkIds,
}) => {
  const { t } = useTranslation(['actions', 'common']);

  return (
    <div className="mt-4">
      {networkOptions.length ? (
        <MultiSelect
          onChange={(ids) => setNetworkIds([...ids])}
          value={networkIds}
        >
          <MultiSelectTrigger
            placeholder={t('common:pci_instances_common_search')}
            className="w-full"
          >
            {networkIds.map((id) => {
              const option = networkOptions.find((opt) => opt.id === id);
              return (
                <MultiSelectValue
                  key={id}
                  value={id}
                  onRemove={() =>
                    setNetworkIds(
                      networkIds.filter((networkId) => networkId !== id),
                    )
                  }
                >
                  {option?.name}
                </MultiSelectValue>
              );
            })}
          </MultiSelectTrigger>
          <MultiSelectContent>
            <MultiSelecSearchInput />
            <MultiSelectOptions>
              {networkOptions.map((option) => (
                <MultiSelectItem key={option.id} value={option.id}>
                  <div className="flex flex-col items-start text-primary-800">
                    <p className={`text-bold text-l`}>{option.name}</p>
                  </div>
                </MultiSelectItem>
              ))}
            </MultiSelectOptions>
          </MultiSelectContent>
        </MultiSelect>
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
