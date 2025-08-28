import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  OdsButton,
  OdsFormField,
  OdsModal,
  OdsText,
  OdsSelect,
  OdsRadio,
  OdsInput,
  OdsLink,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  useAddVirtualMacToIp,
  useAddIpToVirtualMac,
  useGetServerModels,
} from '@/data/hooks';
import { useGetIpdetails, useGetIpVmac } from '@/data/hooks/ip';
import { VirtualMac } from '@/data/api';
import { fromIdToIp, ipFormatter, useGuideUtils } from '@/utils';
import Loading from '@/pages/listing/manageOrganisations/components/Loading/Loading';

export default function AddVirtualMacModal() {
  const { t } = useTranslation(['virtual-mac', NAMESPACES.ACTIONS, 'error']);
  const [createNewVirtualMac, setCreateNewVirtualMac] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [virtualMachineName, setVirtualMachineName] = useState('');
  const { links } = useGuideUtils();
  const navigate = useNavigate();
  const { id, service } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { models, isLoading: isServerModelsLoading } = useGetServerModels({
    enabled: true,
  });
  const { addSuccess, addError } = useNotifications();
  const MAX_CHARACTERS = 250;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid, isSubmitted, errors },
    watch,
    setError,
    clearErrors,
  } = useForm<VirtualMac>({});

  // Mutation function for Adding virtual Mac to Ip on new vmac creation selection
  const {
    mutate: addVirtualMacToIp,
    isPending: addVirtualMacToIpPending,
  } = useAddVirtualMacToIp({
    serviceName: service,
    ip,
    type: selectedType,
    virtualMachineName,
    onSuccess: () => {
      navigate('..');
      addSuccess(t('addVirtualMacAddNewSuccess', { t0: ip }));
    },
    onError: (err) => {
      navigate('..');
      addError(
        t('addVirtualMacAddNewFailure', {
          t0: ip,
          error: err?.response?.data?.message,
          ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
        }),
        true,
      );
    },
  });

  // Mutation function for Adding Ip to Virtual mac on existing vmac creation selection
  const {
    mutate: addIpToVirtualMac,
    isPending: addIpToVirtualMacPending,
  } = useAddIpToVirtualMac({
    serviceName: service,
    macAddress,
    ip,
    virtualMachineName,
    onSuccess: () => {
      navigate('..');
      addSuccess(t('addVirtualMacAddExistingSuccess', { t0: ip }));
    },
    onError: (err) => {
      navigate('..');
      addError(
        t('addVirtualMacAddExistingFailure', {
          t0: ip,
          error: err?.response?.data?.message,
          ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
        }),
        true,
      );
    },
  });

  // Api call to retrive all existing vmacs for a server
  const { vmacs, isLoading: isVmacLoading, error } = useGetIpVmac({
    serviceName: service,
    enabled: true,
  });

  useEffect(() => {
    if (!isServerModelsLoading)
      setTypes(models['dedicated.server.VmacTypeEnum']?.enum);
  }, [models]);

  const handleVirtualMachineNameChange = (event: CustomEvent) => {
    const newValue = event.detail.value || '';
    setVirtualMachineName(newValue);
  };

  // If its new vmac creation selection call addVirtualMacToIp function or else addIpToVirtualMac
  const onSubmit = () =>
    createNewVirtualMac ? addVirtualMacToIp() : addIpToVirtualMac();

  const cancel = () => navigate('..');

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      {isVmacLoading || addVirtualMacToIpPending || addIpToVirtualMacPending ? (
        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {t('addVirtualMacTitle')}
          </OdsText>
          {vmacs &&
            (vmacs.length === 0 ? (
              <div>
                <OdsText preset="span">
                  {t('addVirtualMacNewInfo')}
                  <OdsLink
                    className="inline"
                    href={links.virtualMacLink}
                    target="_blank"
                    label={t('addVirtualMacNewInfoGuide')}
                  />
                </OdsText>
              </div>
            ) : (
              /* Radio Option 1:  For creating new vmac */
              /* Radio Option 2: For using existing vmac */
              <OdsFormField>
                <div className="flex gap-4 mb-2">
                  <OdsRadio
                    name="radio-vmac"
                    inputId="radio-vmac-new"
                    isChecked={createNewVirtualMac}
                    onOdsChange={() => setCreateNewVirtualMac(true)}
                  />
                  <label htmlFor="radio-vmac-new">
                    <OdsText preset="span">{t('addVirtualMacNew')}</OdsText>
                  </label>
                </div>
                <div className="flex gap-4">
                  {' '}
                  <OdsRadio
                    name="radio-vmac"
                    inputId="radio-vmac-existing"
                    isChecked={!createNewVirtualMac}
                    onOdsChange={() => setCreateNewVirtualMac(false)}
                  />
                  <label htmlFor="radio-vmac-existing">
                    <OdsText preset="span">
                      {t('addVirtualMacExisting')}
                    </OdsText>
                  </label>
                </div>
              </OdsFormField>
            ))}
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* New vmac type selection for Option 1 */}
            {createNewVirtualMac && (
              <div className="mt-6">
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <OdsFormField className="w-full">
                      <label htmlFor={name} slot="label">
                        {t('virtualMacType')}
                      </label>
                      <div className="flex">
                        <OdsSelect
                          className="mt-1 flex-1"
                          name="type-selection"
                          data-testid="input-type-selection"
                          value={selectedType}
                          isRequired
                          onOdsChange={(event) =>
                            setSelectedType(event.detail.value)
                          }
                        >
                          {types?.map((type) => (
                            <option value={type} key={type}>
                              {type}
                            </option>
                          ))}
                        </OdsSelect>
                        {isServerModelsLoading && (
                          <Loading
                            className="flex justify-center"
                            size={ODS_SPINNER_SIZE.sm}
                          />
                        )}
                      </div>
                    </OdsFormField>
                  )}
                />
              </div>
            )}
            {/* Existing vmac selection for Option 2 */}
            {!createNewVirtualMac && (
              <div className="mt-6">
                <Controller
                  control={control}
                  name="vmac"
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <OdsFormField className="w-full">
                      <label htmlFor={name} slot="label">
                        {t('virtualMacField')}
                      </label>
                      <div className="flex">
                        <OdsSelect
                          className="mt-1 flex-1"
                          name="vmac-selection"
                          data-testid="input-vmac-selection"
                          value={macAddress}
                          isRequired
                          onOdsChange={(event) =>
                            setMacAddress(event.detail.value)
                          }
                        >
                          {vmacs?.map((vmac) => (
                            <option
                              value={vmac.macAddress}
                              key={vmac.macAddress}
                            >
                              {vmac.macAddress}
                            </option>
                          ))}
                        </OdsSelect>
                        {isVmacLoading && (
                          <Loading
                            className="flex justify-center"
                            size={ODS_SPINNER_SIZE.sm}
                          />
                        )}
                      </div>
                    </OdsFormField>
                  )}
                />
              </div>
            )}
            {/* Input for adding VirtualMacMachinename For both Option 1 and Option 2 */}
            <div className="mt-2">
              <Controller
                control={control}
                name="vmacName"
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <OdsFormField className="block my-4">
                    <label htmlFor={name} slot="label">
                      {t('virtualMacMachinename')}
                    </label>
                    <OdsInput
                      id="form-field-vm-name"
                      className="block pt-1"
                      name="vmacName"
                      isRequired
                      maxlength={MAX_CHARACTERS}
                      value={virtualMachineName}
                      onOdsChange={handleVirtualMachineNameChange}
                      data-testid="input-form-field"
                    />
                  </OdsFormField>
                )}
              />
            </div>
            <div className="flex flex-row-reverse">
              <OdsButton
                className="m-1"
                type="submit"
                slot="actions"
                variant={ODS_BUTTON_VARIANT.default}
                isDisabled={!isValid}
                label={t('confirm', { ns: NAMESPACES.ACTIONS })}
                data-testid="confirm-button"
              />
              <OdsButton
                className="m-1"
                slot="actions"
                type="button"
                variant={ODS_BUTTON_VARIANT.ghost}
                label={t('cancel', { ns: NAMESPACES.ACTIONS })}
                onClick={cancel}
                data-testid="cancel-button"
              />
            </div>
          </form>
        </>
      )}
    </OdsModal>
  );
}
