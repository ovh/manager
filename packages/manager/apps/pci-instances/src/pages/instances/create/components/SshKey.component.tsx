import { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, Divider, Icon, Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { SshKeyHelper } from './sshKey/SshKeyHelper.component';
import AddSshKey from './sshKey/AddSshKey.component';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import {
  TAddSshKeyForm,
  TInstanceCreationForm,
} from '../CreateInstance.schema';
import Banner from '@/components/banner/Banner.component';
import SshKeySelector, {
  TCustomSelectSshKeyData,
} from './sshKey/SshKeySelector.component';
import { useRegionalisedSshKeys } from '../hooks/useRegionalisedSshKeys';

const SshKey = () => {
  const { t } = useTranslation('creation');

  const [openSshKeyform, setOpenSshKeyForm] = useState<boolean>(false);
  const [newSshKeys, setNewSshKeys] = useState<TCustomSelectSshKeyData[]>([]);
  const [openSshKeyAddedMessage, setOpenSshKeyAddedMessage] = useState<boolean>(
    false,
  );

  const { isLoading, data: sshKeys = [] } = useRegionalisedSshKeys();

  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<TInstanceCreationForm>();
  const selectedSshKeyId = useWatch({
    control,
    name: 'sshKeyId',
  });

  const unavailableSshKeyIds = useMemo(
    () => [...newSshKeys, ...sshKeys].map(({ value }) => value),
    [newSshKeys, sshKeys],
  );

  const sshKeyItems = useMemo(() => {
    const existingSshKeys = sshKeys.map((item) => ({
      ...item,
      newSshPublicKey: null,
    }));

    return [...newSshKeys, ...existingSshKeys];
  }, [newSshKeys, sshKeys]);

  const handleOpenSshKeyForm = () => setOpenSshKeyForm(true);

  const handleCloseSshKeyForm = () => setOpenSshKeyForm(false);

  const handleCloseSshKeyAddedMessage = () => setOpenSshKeyAddedMessage(false);

  const handleAddSshKey: SubmitHandler<TAddSshKeyForm> = ({
    sshKeyId,
    sshPublicKey,
  }) => {
    setNewSshKeys((prevSshKeys) => [
      {
        label: sshKeyId,
        value: sshKeyId,
        newSshPublicKey: sshPublicKey,
      },
      ...prevSshKeys,
    ]);

    handleCloseSshKeyForm();
    setOpenSshKeyAddedMessage(true);
  };

  const handleCancelAddSshKey = () => {
    if (sshKeys.length === 0 && newSshKeys.length === 0) return;
    handleCloseSshKeyForm();
  };

  const updateSshKeyFields = useCallback(
    (sshKey: TCustomSelectSshKeyData) => {
      setValue('sshKeyId', sshKey.value);
      setValue('newSshPublicKey', sshKey.newSshPublicKey);
      clearErrors('sshKeyId');
    },
    [setValue, clearErrors],
  );

  const handleSelectSshKey = (sshKey: TCustomSelectSshKeyData) => {
    updateSshKeyFields(sshKey);
    handleCloseSshKeyAddedMessage();
  };

  useEffect(() => {
    if (!isLoading && sshKeys.length === 0) setOpenSshKeyForm(true);
  }, [isLoading, sshKeys]);

  useEffect(() => {
    const selectedSshKey = sshKeyItems[0];

    if (selectedSshKey) updateSshKeyFields(selectedSshKey);
  }, [sshKeyItems, updateSshKeyFields]);

  if (isLoading) return null;

  return (
    <section id="ssh-key-section">
      <Divider spacing="48" />
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_select_sshKey_title')}
        </Text>
        <SshKeyHelper />
      </div>
      <Text className="mt-4" preset="paragraph">
        {t('creation:pci_instance_creation_select_sshKey_description')}
      </Text>
      {openSshKeyAddedMessage && (
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
      {sshKeys.length === 0 && newSshKeys.length === 0 && (
        <div className="mt-4">
          <Banner color="warning">
            {t('creation:pci_instance_creation_select_sshKey_missing_warning')}
          </Banner>
        </div>
      )}
      {openSshKeyform ? (
        <AddSshKey
          unavailableSshKeyIds={unavailableSshKeyIds}
          onSubmit={handleAddSshKey}
          onCancel={handleCancelAddSshKey}
          shouldValidate={!!errors.sshKeyId}
        />
      ) : (
        <>
          <SshKeySelector
            items={sshKeyItems}
            value={selectedSshKeyId ? [selectedSshKeyId] : []}
            onValueChange={handleSelectSshKey}
          />
          <Button variant="outline" onClick={handleOpenSshKeyForm}>
            <Icon name="plus" />
            {t('creation:pci_instance_creation_select_sshKey_add_new')}
          </Button>
        </>
      )}
    </section>
  );
};

export default SshKey;
