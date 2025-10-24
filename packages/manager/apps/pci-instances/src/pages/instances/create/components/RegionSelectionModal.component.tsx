import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import Localization from '@/components/localizationCard/Localization.component';
import Modal from '@/components/modal/Modal.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectCustomItemRendererArg,
  SelectCustomOptionRendererArg,
  SelectGroupItem,
  SelectItem,
} from '@ovhcloud/ods-react';
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TCustomRegionItemData = {
  countryCode: TCountryIsoCode;
  deploymentMode: TDeploymentMode;
  macroRegion: string;
};

export type TCustomRegionSelected = {
  macroRegion: string;
  microRegion: string;
};

type RegionSelectionModalProps = PropsWithChildren<{
  open: boolean;
  unavailableRegion: string | null;
  regions: SelectGroupItem<TCustomRegionItemData>[];
  onClose: () => void;
  onValidateSelect: (region: TCustomRegionSelected) => void;
}>;

const RegionSelectionModal: FC<RegionSelectionModalProps> = ({
  open,
  unavailableRegion,
  regions,
  children,
  onClose,
  onValidateSelect,
}) => {
  const { t } = useTranslation('creation');
  const [region, setRegion] = useState<TCustomRegionSelected | null>(null);

  const handleSelect = ({
    items,
  }: {
    items: SelectItem<TCustomRegionItemData>[];
  }) => {
    const newRegion = items[0];

    if (newRegion && newRegion.customRendererData && 'value' in newRegion)
      setRegion({
        macroRegion: newRegion.customRendererData.macroRegion,
        microRegion: newRegion.value,
      });
  };

  const handleValidate = () => {
    if (region) onValidateSelect(region);

    onClose();
  };

  return (
    <Modal
      open={open}
      title={t('pci_instance_creation_select_new_region_title')}
      isPending={false}
      disabled={!region}
      handleInstanceAction={handleValidate}
      onModalClose={onClose}
      variant="primary"
    >
      <div className="mt-4">
        {children}
        <FormField className="mt-4">
          <FormFieldLabel>
            {t('pci_instance_creation_select_new_region_label')}
          </FormFieldLabel>
          <Select items={regions} onValueChange={handleSelect}>
            <SelectControl
              className="h-[2.5em]"
              {...(unavailableRegion && {
                placeholder: unavailableRegion,
              })}
              customItemRenderer={({
                selectedItems,
              }: SelectCustomItemRendererArg<TCustomRegionItemData>) => (
                <>
                  {selectedItems[0] && (
                    <Localization
                      name={selectedItems[0].label}
                      countryCode={
                        selectedItems[0].customRendererData?.countryCode
                      }
                      deploymentMode={
                        selectedItems[0].customRendererData?.deploymentMode
                      }
                    />
                  )}
                </>
              )}
            />
            <SelectContent
              className="[&>div>div>span]:w-full [&>div:not(:last-child)]:border-solid [&>div]:border-x-0 [&>div]:border-t-0 [&>div]:border-b [&>div]:border-[var(--ods-color-gray-200)] [&>div:not(:last-child)]:pb-4 [&>div:not(:last-child)]:mb-3"
              customOptionRenderer={({
                label,
                customData,
              }: SelectCustomOptionRendererArg<TCustomRegionItemData>) => (
                <Localization
                  name={label}
                  countryCode={customData?.countryCode}
                  deploymentMode={customData?.deploymentMode}
                />
              )}
            />
          </Select>
        </FormField>
      </div>
    </Modal>
  );
};

export default RegionSelectionModal;
