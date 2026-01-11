import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  SPINNER_SIZE,
  Select,
  SelectContent,
  SelectControl,
  SelectOptionItem,
  SelectValueChangeDetail,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import {
  defaultRefreshTimeOption,
  defaultRefreshTimeOptions,
} from './RefreshTimeControl.constants';
import { RefreshTimeControlProps } from './RefreshTimeControl.props';
import { SelectItemExtraData } from './RefreshTimeControl.type';
import './time-controls.scss';

export const RefreshTimeControl: React.FC<Readonly<RefreshTimeControlProps>> = ({
  refreshTimeOptions = defaultRefreshTimeOptions,
  defaultRefreshInterval = defaultRefreshTimeOption,
  isLoading,
  onStateChange,
  onRefresh,
  onCancel,
}): JSX.Element => {
  const { t } = useTranslation(NAMESPACES.TIME_CONTROLS);

  const onValueChange = (detail: SelectValueChangeDetail) => {
    const value = detail.value.at(0);
    if (value) {
      onStateChange<number>('refreshInterval', Number(value));
    }
  };

  const onClickRefresh = () => {
    if (isLoading) {
      onCancel();
    } else {
      onRefresh();
    }
  };

  return (
    <div className="inline-flex">
      <Button
        className="rounded-r-none flex items-center justify-center"
        size={BUTTON_SIZE.md}
        variant={BUTTON_VARIANT.outline}
        onClick={onClickRefresh}
      >
        {isLoading ? (
          <Spinner className="ps-2" size={SPINNER_SIZE.xs} />
        ) : (
          <Icon name={ICON_NAME.refresh} />
        )}
        <span>{t(isLoading ? 'button_cancel' : 'button_refresh')}</span>
      </Button>

      <Select
        items={refreshTimeOptions}
        fitControlWidth={false}
        onValueChange={onValueChange}
        defaultValue={defaultRefreshInterval.toString()}
      >
        <SelectControl
          customItemRenderer={({ selectedItems }) => {
            const itemsWithExtraData = selectedItems as SelectOptionItem<SelectItemExtraData>[];

            return (
              <div>
                {itemsWithExtraData.map((item, index) => (
                  <Text
                    key={`${item.value}_${index}`}
                    className="font-semibold text-[var(--ods-color-primary-500)]"
                    preset={TEXT_PRESET.span}
                  >
                    {item.customRendererData?.selectLabel ?? item.label}
                  </Text>
                ))}
              </div>
            );
          }}
        />
        <SelectContent>{t('button_refresh')}</SelectContent>
      </Select>
    </div>
  );
};

export default RefreshTimeControl;
