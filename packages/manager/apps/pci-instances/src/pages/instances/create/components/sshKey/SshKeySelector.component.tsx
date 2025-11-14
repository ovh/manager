import { FC, useCallback, useEffect, useMemo } from 'react';
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
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.page';

export type TCustomSelectSshKeyData = TSshKeyData & {
  sshPublicKey: string | null;
};

type TSshKeySelectorProps = {
  sshKeysItems: TSshKeyData[];
  newSshKeys: TCustomSelectSshKeyData[];
  onValueChange: () => void;
};

const SshKeySelector: FC<TSshKeySelectorProps> = ({
  sshKeysItems,
  newSshKeys,
  onValueChange,
}) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedSshKeyId = useWatch({
    control,
    name: 'sshKeyId',
  });

  const updateSshKeyFields = useCallback(
    (sshKey: TCustomSelectSshKeyData) => {
      setValue('sshKeyId', sshKey.value);
      setValue('sshPublicKey', sshKey.sshPublicKey);
    },
    [setValue],
  );

  const handleSelectSshKey = ({ items }: SelectValueChangeDetail) => {
    const selectedSshKey = (items as TCustomSelectSshKeyData[])[0];
    if (selectedSshKey) {
      updateSshKeyFields(selectedSshKey);
      onValueChange();
    }
  };

  const items = useMemo(() => {
    const existingSshKeys = sshKeysItems.map((item) => ({
      ...item,
      sshPublicKey: null,
    }));

    return [...newSshKeys, ...existingSshKeys];
  }, [newSshKeys, sshKeysItems]);

  useEffect(() => {
    const selectedSshKey = items[0];

    if (selectedSshKey) updateSshKeyFields(selectedSshKey);
  }, [items, updateSshKeyFields]);

  return (
    <FormField className="max-w-[32%] my-4">
      <FormFieldLabel>
        {t('creation:pci_instance_creation_select_sshKey_dropdown_label')}
      </FormFieldLabel>
      <Select
        items={items}
        value={selectedSshKeyId ? [selectedSshKeyId] : []}
        onValueChange={handleSelectSshKey}
      >
        <SelectControl />
        <SelectContent />
      </Select>
    </FormField>
  );
};

export default SshKeySelector;
