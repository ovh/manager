import { FC } from 'react';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectContent,
  SelectValueChangeDetail,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TSshKeyData } from '../../view-models/sshKeysViewModel';

export type TCustomSelectSshKeyData = TSshKeyData & {
  newSshPublicKey: string | null;
};

type TSshKeySelectorProps = {
  items: TCustomSelectSshKeyData[];
  value: string[];
  onValueChange: (sshKey: TCustomSelectSshKeyData) => void;
};

const SshKeySelector: FC<TSshKeySelectorProps> = ({
  items,
  value,
  onValueChange,
}) => {
  const { t } = useTranslation('creation');

  const handleSelectSshKey = ({ items }: SelectValueChangeDetail) => {
    const selectedSshKey = (items as TCustomSelectSshKeyData[])[0];
    if (selectedSshKey) onValueChange(selectedSshKey);
  };

  return (
    <FormField className="max-w-[32%] my-4">
      <FormFieldLabel>
        {t('creation:pci_instance_creation_select_sshKey_dropdown_label')}
      </FormFieldLabel>
      <Select items={items} value={value} onValueChange={handleSelectSshKey}>
        <SelectControl />
        <SelectContent />
      </Select>
    </FormField>
  );
};

export default SshKeySelector;
