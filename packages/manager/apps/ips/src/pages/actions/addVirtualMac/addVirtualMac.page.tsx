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
import { fromIdToIp, ipFormatter } from '@/utils';
import Loading from '@/pages/listing/manageOrganisations/components/Loading/Loading';
import { isVmacEnabled } from '@/pages/listing/ipListing/components/DatagridCells/enableCellsUtils';

export default function AddVirtualMacModal() {
  const { t } = useTranslation(['virtual-mac', NAMESPACES.ACTIONS, 'error']);
  const [createNewVmac, setCreateNewVmac] = useState(true);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [virtualMachineName, setVirtualMachineName] = useState('');
  const [serviceName, setServiceName] = React.useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { ipDetails, isLoading: isIpDetailsLoading } = useGetIpdetails({ ip });
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
    serviceName,
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
    serviceName,
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

  // Enable it if additionnal / dedicated Ip linked to a dedicated server
  const enabled = !isIpDetailsLoading && isVmacEnabled(ipDetails);

  // Api call to retrive all existing vmacs for a server
  const { vmacs, isLoading: isVmacLoading, error } = useGetIpVmac({
    serviceName: ipDetails?.routedTo?.serviceName,
    enabled,
  });

  useEffect(() => {
    if (!isServerModelsLoading)
      setTypes(models['dedicated.server.VmacTypeEnum']?.enum);
  }, [models]);

  useEffect(() => {
    if (ipDetails?.routedTo?.serviceName)
      setServiceName(ipDetails?.routedTo?.serviceName);
  }, [ipDetails?.routedTo?.serviceName]);

  const handleVirtualMachineNameChange = (event: CustomEvent) => {
    const newValue = event.detail.value || '';
    setVirtualMachineName(newValue);
  };

  // If its new vmac creation selection call addVirtualMacToIp function or else addIpToVirtualMac
  const onSubmit = () =>
    createNewVmac ? addVirtualMacToIp() : addIpToVirtualMac();

  const cancel = () => navigate('..');

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      {isIpDetailsLoading ||
      isVmacLoading ||
      addVirtualMacToIpPending ||
      addIpToVirtualMacPending ? (
        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {t('addVirtualMacTitle')}
          </OdsText>
          {/* Radio Option 1:  For creating new vmac */
          vmacs && (
            <OdsFormField>
              <div className="flex gap-4">
                <OdsRadio
                  name="radio-vmac"
                  inputId="radio-vmac-true"
                  isChecked={createNewVmac}
                  onOdsChange={() => {
                    setCreateNewVmac(!createNewVmac);
                  }}
                />
                <label htmlFor="radio-vmac-true">
                  <OdsText preset="span">{t('addVirtualMacNew')}</OdsText>
                </label>
              </div>
            </OdsFormField>
          )}
          {/* Radio Option 2: For using existing vmac */
          vmacs && (
            <OdsFormField>
              <div className="flex gap-4">
                <OdsRadio
                  name="radio-vmac"
                  inputId="radio-vmac-true"
                  isChecked={!createNewVmac}
                  onOdsChange={() => {
                    setCreateNewVmac(!createNewVmac);
                  }}
                />
                <label htmlFor="radio-vmac-true">
                  <OdsText preset="span">{t('addVirtualMacExisting')}</OdsText>
                </label>
              </div>
            </OdsFormField>
          )}
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* New vmac type selection for Option 1 */}
            {createNewVmac && (
              <div className="mt-8">
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <OdsFormField className="w-full">
                      <label htmlFor={name} slot="label">
                        {t('addVirtualMacType')}
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
                          {types.map((type) => (
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
            {!createNewVmac && (
              <div className="mt-8">
                <Controller
                  control={control}
                  name="vmac"
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <OdsFormField className="w-full">
                      <label htmlFor={name} slot="label">
                        {t('addVirtualMacField')}
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
                          {vmacs.map((vmac) => (
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
                      {t('addVirtualMacMachinename')}
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
