import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TCountryIsoCode } from '@/components/flag/country-iso-code';
import { Flag } from '@/components/flag/Flag';
import Modal from '@/components/modal/Modal.component';
import { TDeploymentMode } from '@/types/instance/common.type';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectContent,
  SelectControl,
  SelectCustomOptionRendererArg,
  SelectGroupItem,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type TCustomRegionItemData = {
  countryCode: TCountryIsoCode | null;
  deploymentMode: TDeploymentMode;
  microRegion: string | null;
};

const RegionSelectionModal: FC<PropsWithChildren<{
  regions: SelectGroupItem<TCustomRegionItemData>[];
  onClose: () => void;
  onValidateSelect: (region: string) => void;
}>> = ({ regions, children, onClose, onValidateSelect }) => {
  const { t } = useTranslation('creation');
  const [region, setRegion] = useState<string | null>(null);

  const handleSelect = ({ value }: SelectValueChangeDetail) => {
    const newRegion = value[0];
    if (newRegion) setRegion(newRegion);
  };

  const handleValidate = () => {
    if (region) onValidateSelect(region);

    onClose();
  };

  return (
    <Modal
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
            <SelectControl />
            <SelectContent
              className="[&>div>div>span]:w-full"
              customOptionRenderer={({
                label,
                customData,
              }: SelectCustomOptionRendererArg<TCustomRegionItemData>) => (
                <div className="flex gap-x-6 justify-between items-center">
                  <Text className="flex items-center gap-x-4">
                    {customData?.countryCode && (
                      <Flag isoCode={customData.countryCode} />
                    )}
                    {label}
                  </Text>
                  {customData?.countryCode && (
                    <DeploymentModeBadge mode={customData.deploymentMode} />
                  )}
                </div>
              )}
            />
          </Select>
        </FormField>
      </div>
    </Modal>
  );
};

export default RegionSelectionModal;
