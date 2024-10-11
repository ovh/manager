import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { DeepReadonly } from '@/types/utils.type';
import { RegionTile } from '../../../../../components/tile/RegionTile.component';
import { TRegion } from '@/types/catalog/entity.types';
import { useAppStore } from '@/store/hooks/useAppStore';

type TUnavailableRegionsCheckBoxProps = DeepReadonly<{
  label: string;
  className: string;
  checked: boolean;
  onCheckChange: (event: CustomEvent) => void;
}>;

const UnavailableRegionsCheckBox: FC<TUnavailableRegionsCheckBoxProps> = ({
  label,
  className,
  checked,
  onCheckChange,
}) => {
  return (
    <div className={className}>
      <OsdsCheckbox
        name="show-unavailable-regions"
        checked={checked}
        onOdsCheckedChange={onCheckChange}
      >
        <OsdsCheckboxButton
          interactive
          size={ODS_CHECKBOX_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
            slot="end"
          >
            {label}
          </OsdsText>
        </OsdsCheckboxButton>
      </OsdsCheckbox>
    </div>
  );
};

export type TUnavailableRegionsProps = DeepReadonly<{
  unavailableRegions: TRegion[];
  availableRegions: TRegion[];
  getRegionLabel: (name: string, datacenter: string) => string;
}>;

export const UnavailableRegions: FC<TUnavailableRegionsProps> = ({
  unavailableRegions,
  availableRegions,
  getRegionLabel,
}) => {
  const [checked, setChecked] = useState(false);
  const { t } = useTranslation('regions');

  const { updateStep } = useAppStore(
    useShallow((state) => ({
      updateStep: state.updateStep,
    })),
  );

  const handleCheckChange = useCallback(
    (event: CustomEvent) => setChecked(event.detail.checked),
    [],
  );

  const handleChangeModelClick = useCallback(() => {
    updateStep('region', {
      isOpen: false,
      isLocked: true,
    });
    updateStep('model', { isOpen: true, isLocked: false, isChecked: false });
  }, [updateStep]);

  return (
    <>
      <UnavailableRegionsCheckBox
        label={t('pci_instances_regions_show_unavailable_regions_message')}
        className={!availableRegions.length ? '' : 'mt-6'}
        checked={checked}
        onCheckChange={handleCheckChange}
      />
      {checked && (
        <>
          <div className="grid gap-6 pt-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 my-6">
            {unavailableRegions.map((unavailableRegion) => (
              <div key={unavailableRegion.name}>
                <RegionTile
                  label={getRegionLabel(
                    unavailableRegion.name,
                    unavailableRegion.datacenter,
                  )}
                  isLocalzone={unavailableRegion.isLocalzone}
                  isDisabled
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._400}
            >
              {t(
                `pci_instances_regions_other_models_${
                  unavailableRegions.length === 1 ? 'region' : 'regions'
                }_availability_message`,
              )}
            </OsdsText>
            <OsdsLink
              data-testid="change-model-cta"
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={handleChangeModelClick}
            >
              {t('pci_instances_regions_change_model_message')}
              <OsdsIcon
                className="ml-3"
                name={ODS_ICON_NAME.ARROW_RIGHT}
                size={ODS_ICON_SIZE.xs}
                color={ODS_THEME_COLOR_INTENT.primary}
                slot="end"
              />
            </OsdsLink>
          </div>
        </>
      )}
    </>
  );
};
