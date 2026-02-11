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

import { NAMESPACES as COMMON_NAMESPACES } from '@ovh-ux/manager-common-translations';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import {
  defaultRefreshTimeOption,
  defaultRefreshTimeOptions,
} from '@/constants/timeControls/RefreshTimeControl.constants';

import { SelectItemExtraData } from '@/types/timeControls/RefreshTimeControl.type';

import { RefreshTimeControlProps } from '@/components/timeControls/RefreshTimeControl.props';

export const RefreshTimeControl: React.FC<Readonly<RefreshTimeControlProps>> = ({
  refreshTimeOptions = defaultRefreshTimeOptions,
  defaultRefreshInterval = defaultRefreshTimeOption,
  isLoading,
  onStateChange,
  onRefresh,
  onCancel,
  disabled = false,
}): JSX.Element => {
  const { t } = useTranslation([NAMESPACES.TIME_CONTROLS, COMMON_NAMESPACES.ACTIONS]);

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
        disabled={disabled}
      >
        {isLoading ? (
          <Spinner className="ps-2" size={SPINNER_SIZE.xs} />
        ) : (
          <Icon name={ICON_NAME.refresh} />
        )}
        <span>{t(`${COMMON_NAMESPACES.ACTIONS}:${isLoading ? 'cancel' : 'update'}`)}</span>
      </Button>

      <Select
        items={refreshTimeOptions}
        fitControlWidth={false}
        onValueChange={onValueChange}
        defaultValue={defaultRefreshInterval.toString()}
        disabled={disabled}
        positionerStyle={{
          zIndex: 102
        }}
      >
        <SelectControl
          className={`group
                      h-10
                      border
                      border-l-0
                      border-[var(--ods-color-primary-500)]
                      rounded-l-none
                      outline-none
                      shadow-none
                      text-[var(--ods-color-primary-500)]
                      hover:bg-[var(--ods-color-primary-100)]                      
                      hover:border-[var(--ods-color-primary-700)]
                      focus:outline-none
                      focus:shadow-none
                      focus-visible:outline-none
                      focus-visible:shadow-none
                      disabled:border-[var(--ods-theme-border-color-disabled)]
                      disabled:text-[var(--ods-theme-text-color-disabled)]
                      disabled:hover:bg-[var(--ods-theme-background-color-disabled)]
                      disabled:hover:border-[var(--ods-theme-border-color-disabled)]
                      disabled:cursor-not-allowed
                      `
                    }

          customItemRenderer={({ selectedItems }) => {
            const itemsWithExtraData = selectedItems as SelectOptionItem<SelectItemExtraData>[];

            return (
              <div>
                {itemsWithExtraData.map((item, index) => (
                  <Text
                    key={`${item.value}_${index}`}
                    className="font-semibold text-[var(--ods-color-primary-500)] group-hover:text-[var(--ods-color-primary-700)] group-disabled:text-[var(--ods-theme-text-color-disabled)] group-disabled:group-hover:text-[var(--ods-theme-text-color-disabled)]"
                    preset={TEXT_PRESET.span}
                  >
                    {item.customRendererData?.selectLabel ?? item.label}
                  </Text>
                ))}
              </div>
            );
          }}
        />
        <SelectContent>{t(`${COMMON_NAMESPACES.ACTIONS}:update`)}</SelectContent>
      </Select>
    </div>
  );
};

export default RefreshTimeControl;
