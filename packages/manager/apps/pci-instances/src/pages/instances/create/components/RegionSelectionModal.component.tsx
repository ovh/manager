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

type TRegionSelectionModalProps = PropsWithChildren<{
  open: boolean;
  regions: SelectGroupItem<TCustomRegionItemData>[];
  onClose: () => void;
  onValidateSelect: (region: TCustomRegionSelected) => void;
}>;

type TSelectRegionChageDetail = {
  items: SelectItem<TCustomRegionItemData>[];
  value: string[];
};

const continentDividerClassname =
  '[&>div>div>span]:w-full [&>div:not(:last-child)]:border-solid [&>div]:border-x-0 [&>div]:border-t-0 [&>div]:border-b [&>div]:border-[var(--ods-color-gray-200)] [&>div:not(:last-child)]:pb-4 [&>div:not(:last-child)]:mb-3';

const RegionSelectionModal: FC<TRegionSelectionModalProps> = ({
  open,
  regions,
  children,
  onClose,
  onValidateSelect,
}) => {
  const { t } = useTranslation('creation');
  const [region, setRegion] = useState<TCustomRegionSelected | null>(null);
  const [selectRegionValue, setSelectRegionValue] = useState<string[]>([]);

  const handleSelect = ({ items, value }: TSelectRegionChageDetail) => {
    const newRegion = items[0];

    if (newRegion && newRegion.customRendererData && 'value' in newRegion)
      setRegion({
        macroRegion: newRegion.customRendererData.macroRegion,
        microRegion: newRegion.value,
      });

    setSelectRegionValue(value);
  };

  const handleClose = () => {
    setSelectRegionValue([]);
    onClose();
  };

  const handleValidate = () => {
    if (region) onValidateSelect(region);

    handleClose();
  };

  return (
    <Modal
      open={open}
      title={t('pci_instance_creation_select_new_region_title')}
      isPending={false}
      disabled={!region}
      handleInstanceAction={handleValidate}
      onModalClose={handleClose}
      variant="primary"
    >
      <div className="mt-4">
        {children}
        <FormField className="mt-4">
          <FormFieldLabel>
            {t('pci_instance_creation_select_new_region_label')}
          </FormFieldLabel>
          <Select
            items={regions}
            onValueChange={handleSelect}
            value={selectRegionValue}
          >
            <SelectControl
              className="h-[2.5em]"
              placeholder={t('pci_instance_creation_select_new_region')}
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
              className={continentDividerClassname}
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
