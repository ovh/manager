import Localization from '@/components/localizationCard/Localization.component';
import Modal from '@/components/modal/Modal.component';
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
import { TCustomRegionItemData } from '../view-models/flavorsViewModel';
import { useFormContext } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.schema';

export type TCustomRegionSelected = {
  macroRegionId: string;
  microRegionId: string;
  regionalizedFlavorId: string;
};

type TRegionSelectionModalProps = PropsWithChildren<{
  open: boolean;
  regions: SelectGroupItem<TCustomRegionItemData>[];
  onClose: () => void;
  onValidateSelect: (region: TCustomRegionSelected) => void;
}>;

type TSelectRegionChangeDetail = {
  items: SelectItem[];
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
  const { t } = useTranslation(['creation', 'regions', 'common']);
  const [region, setRegion] = useState<TCustomRegionSelected | null>(null);
  const [selectRegionValue, setSelectRegionValue] = useState<string[]>([]);
  const { setValue } = useFormContext<TInstanceCreationForm>();

  const handleSelect = ({ items, value }: TSelectRegionChangeDetail) => {
    const newRegion = items[0];

    if (newRegion && newRegion.customRendererData && 'value' in newRegion)
      setRegion({
        macroRegionId: (newRegion.customRendererData as TCustomRegionSelected)
          .macroRegionId,
        microRegionId: newRegion.value,
        regionalizedFlavorId: (newRegion.customRendererData as TCustomRegionSelected)
          .regionalizedFlavorId,
      });

    setSelectRegionValue(value);
  };

  const handleClose = () => {
    setSelectRegionValue([]);
    onClose();
  };

  const handleCancel = () => {
    setValue('flavorId', null);
    handleClose();
  };

  const handleValidate = () => {
    if (region) onValidateSelect(region);

    handleClose();
  };

  return (
    <Modal
      open={open}
      title={t('creation:pci_instance_creation_select_new_region_title')}
      isPending={false}
      disabled={!region}
      handleInstanceAction={handleValidate}
      onModalClose={handleCancel}
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
              placeholder={t(
                'creation:pci_instance_creation_select_new_region',
              )}
              customItemRenderer={({
                selectedItems,
              }: SelectCustomItemRendererArg) => (
                <>
                  {selectedItems[0] && (
                    <Localization
                      name={t(selectedItems[0].label)}
                      countryCode={
                        (selectedItems[0]
                          .customRendererData as TCustomRegionItemData)
                          .countryCode
                      }
                      deploymentMode={
                        (selectedItems[0]
                          .customRendererData as TCustomRegionItemData)
                          .deploymentMode
                      }
                    />
                  )}
                </>
              )}
            />
            <SelectContent
              className={continentDividerClassname}
              customGroupRenderer={({ label }) => (
                <span>
                  {t(`common:pci_instances_common_instance_continent_${label}`)}
                </span>
              )}
              customOptionRenderer={({
                label,
                customData,
              }: SelectCustomOptionRendererArg) => (
                <Localization
                  name={t(label)}
                  countryCode={
                    (customData as TCustomRegionItemData).countryCode
                  }
                  deploymentMode={
                    (customData as TCustomRegionItemData).deploymentMode
                  }
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
