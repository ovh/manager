import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Divider,
  FormField,
  FormFieldLabel,
  Icon,
  Select,
  SelectContent,
  SelectControl,
  SelectOptionItem,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { SshKeyHelper } from './sshKey/SshKeyHelper.component';
import { useSshKeys } from '@/data/hooks/ssh/useSshKeys';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { selectSshKeys, TSshKeyData } from '../view-models/sshKeysViewModel';
import AddSshKey from './sshKey/AddSshKey.component';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.page';
import { TAddSshKeyForm } from '../CreateInstance.schema';
import Banner from '@/components/banner/Banner.component';

type TSshKeyProps = {
  microRegion: string;
};

const SshKey = ({ microRegion }: TSshKeyProps) => {
  const projectId = useProjectId();
  const { t } = useTranslation('creation');
  const [openSshKeyform, setOpenSshKeyForm] = useState<boolean>(false);
  const [sshKeyItems, setSshKeyItems] = useState<TSshKeyData[]>([]);
  const [isSshKeyAdded, setIsSshKeyAdded] = useState<boolean>(false);
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const selectedSshKeyId = useWatch({
    control,
    name: 'sshId',
  });

  const { isLoading } = useSshKeys(microRegion);

  const sshKeys = useMemo(
    () => (isLoading ? [] : selectSshKeys(deps)(projectId, microRegion)),
    [isLoading, microRegion, projectId],
  );

  const unavailableSshNames = useMemo(
    () => sshKeyItems.map(({ label }) => label),
    [sshKeyItems],
  );

  const handleOpenSshKeyForm = () => setOpenSshKeyForm(true);

  const handleCloseSshKeyForm = () => setOpenSshKeyForm(false);

  const handleCloseSshKeyAddedMessage = () => setIsSshKeyAdded(false);

  const handleAddSshKey: SubmitHandler<TAddSshKeyForm> = ({
    sshName,
    sshKey,
  }) => {
    setValue('sshName', sshName);
    setValue('sshKey', sshKey);

    setSshKeyItems((prevSshKeys) => [
      {
        label: sshName,
        value: prevSshKeys.length.toString(),
      },
      ...prevSshKeys,
    ]);

    handleCloseSshKeyForm();
    setIsSshKeyAdded(true);
  };

  const handleCancelAddSshKey = () => {
    if (sshKeyItems.length === 0) return;
    handleCloseSshKeyForm();
  };

  const updateSshKeyFields = useCallback(
    (sshKeys: TSshKeyData[]) => {
      const selectedSshKey = sshKeys[0];

      if (selectedSshKey) {
        setValue('sshId', selectedSshKey.value);
        setValue('sshName', selectedSshKey.label);
      }
    },
    [setValue],
  );

  const handleSelectSshKey = ({ items }: SelectValueChangeDetail) => {
    updateSshKeyFields(items as SelectOptionItem<TSshKeyData>[]);
    handleCloseSshKeyAddedMessage();
  };

  useEffect(() => {
    if (!isLoading) setSshKeyItems(sshKeys);
    if (!isLoading && sshKeys.length === 0) setOpenSshKeyForm(true);
  }, [isLoading, sshKeys]);

  useEffect(() => {
    updateSshKeyFields(sshKeyItems);
  }, [sshKeyItems, updateSshKeyFields]);

  return (
    <section>
      <Divider spacing="64" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_select_sshKey_title')}
        </Text>
        <SshKeyHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('creation:pci_instance_creation_select_sshKey_description')}
      </Text>
      {isSshKeyAdded && (
        <div className="mt-4">
          <Banner
            color="information"
            dismissible
            onRemove={handleCloseSshKeyAddedMessage}
          >
            {t('creation:pci_instance_creation_select_sshKey_add_key_done')}
          </Banner>
        </div>
      )}
      {!isLoading && (
        <>
          {sshKeyItems.length === 0 && (
            <div className="mt-4">
              <Banner color="warning">
                {t(
                  'creation:pci_instance_creation_select_sshKey_missing_warning',
                )}
              </Banner>
            </div>
          )}
          {openSshKeyform ? (
            <AddSshKey
              unavailableNames={unavailableSshNames}
              onSubmit={handleAddSshKey}
              onCancel={handleCancelAddSshKey}
            />
          ) : (
            <>
              <FormField className="max-w-[32%] my-4">
                <FormFieldLabel>
                  {t(
                    'creation:pci_instance_creation_select_sshKey_dropdown_label',
                  )}
                </FormFieldLabel>
                <Select
                  items={sshKeyItems}
                  value={selectedSshKeyId ? [selectedSshKeyId] : []}
                  onValueChange={handleSelectSshKey}
                >
                  <SelectControl />
                  <SelectContent />
                </Select>
              </FormField>
              <Button variant="ghost" onClick={handleOpenSshKeyForm}>
                <Icon name="plus" />
                {t('creation:pci_instance_creation_select_sshKey_add_new')}
              </Button>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default SshKey;
