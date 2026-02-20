import Modal from '@/components/modal/Modal.component';
import { SelectGroupItem, SelectItem } from '@ovhcloud/ods-react';
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TCustomRegionItemData } from '../view-models/flavorsViewModel';
import { useFormContext } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import LocalizationSelect from '@/components/localizationCard/LocalizationSelect.component';

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
        <LocalizationSelect<TCustomRegionItemData>
          className="mt-4"
          createPortal={false}
          regions={regions}
          onValueChange={handleSelect}
          value={selectRegionValue}
        />
      </div>
    </Modal>
  );
};

export default RegionSelectionModal;
