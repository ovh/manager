import { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
  OdsInputChangeEventDetail,
  OdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsInput,
  OdsLink,
  OdsModal,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { VirtualMac, getIcebergDedicatedServerTasksQueryKey } from '@/data/api';
import {
  useAddIpToVirtualMac,
  useAddVirtualMacToIp,
  useGetServerModels,
} from '@/data/hooks';
import { useGetIpVmac } from '@/data/hooks/ip';
import Loading from '@/pages/listing/manageOrganisations/components/Loading/Loading';
import { fromIdToIp, ipFormatter, useGuideUtils } from '@/utils';

const MAX_CHARACTERS = 250;

export default function AddVirtualMacModal() {
  const { t } = useTranslation(['virtual-mac', NAMESPACES.ACTIONS, 'error']);
  const [createNewVirtualMac, setCreateNewVirtualMac] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [virtualMachineName, setVirtualMachineName] = useState('');
  const { links } = useGuideUtils();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { id, service: serviceName } = useParams();
  const { ip } = ipFormatter(fromIdToIp(id));
  const { models, isLoading: isServerModelsLoading } = useGetServerModels({
    enabled: true,
  });
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccess, addError } = useNotifications();

  const queryClient = useQueryClient();
  const invalidateGetTasksQueryKey = async (service?: string) => {
    if (service) {
      await queryClient.invalidateQueries({
        queryKey: getIcebergDedicatedServerTasksQueryKey(service),
      });
    }
  };

  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_virtual-mac', 'cancel'],
    });
    navigate(`..?${search.toString()}`);
  };

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<VirtualMac>({});

  // Mutation function for Adding virtual Mac to Ip on new vmac creation selection
  const { mutate: addVirtualMacToIp, isPending: addVirtualMacToIpPending } =
    useAddVirtualMacToIp({
      serviceName,
      ip,
      type: selectedType,
      virtualMachineName,
      onSuccess: () => {
        closeModal();
        addSuccess(t('addVirtualMacAddNewSuccess', { t0: ip }));
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: 'add_virtual-mac_success',
        });
        invalidateGetTasksQueryKey(serviceName);
      },
      onError: (err) => {
        closeModal();
        addError(
          t('addVirtualMacAddNewFailure', {
            t0: ip,
            error: err?.response?.data?.message,
            ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
          }),
          true,
        );
        trackPage({
          pageType: PageType.bannerError,
          pageName: 'add_virtual-mac_error',
        });
      },
    });

  // Mutation function for Adding Ip to Virtual mac on existing vmac creation selection
  const { mutate: addIpToVirtualMac, isPending: addIpToVirtualMacPending } =
    useAddIpToVirtualMac({
      serviceName,
      macAddress,
      ip,
      virtualMachineName,
      onSuccess: () => {
        closeModal();
        addSuccess(t('addVirtualMacAddExistingSuccess', { t0: ip }));
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: 'add_virtual-mac_success',
        });
        invalidateGetTasksQueryKey(serviceName);
      },
      onError: (err) => {
        closeModal();
        addError(
          t('addVirtualMacAddExistingFailure', {
            t0: ip,
            error: err?.response?.data?.message,
            ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
          }),
          true,
        );
        trackPage({
          pageType: PageType.bannerError,
          pageName: 'add_virtual-mac_error',
        });
      },
    });

  // Api call to retrive all existing vmacs for a server
  const { vmacs, isLoading: isVmacLoading } = useGetIpVmac({
    serviceName,
    enabled: true,
  });

  useEffect(() => {
    if (!isServerModelsLoading)
      setTypes(models?.['dedicated.server.VmacTypeEnum']?.enum || []);
  }, [models]);

  const handleVirtualMachineNameChange = (
    event: OdsInputCustomEvent<OdsInputChangeEventDetail>,
  ) => {
    const newValue = (event.detail.value as string) || '';
    setVirtualMachineName(newValue);
  };

  // If its new vmac creation selection call addVirtualMacToIp function or else addIpToVirtualMac
  const onSubmit = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_virtual-mac', 'confirm'],
    });
    return createNewVirtualMac ? addVirtualMacToIp() : addIpToVirtualMac();
  };

  return (
    <OdsModal isOpen isDismissible onOdsClose={closeModal}>
      {isVmacLoading || addVirtualMacToIpPending || addIpToVirtualMacPending ? (
        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.md} />
      ) : (
        <>
          <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.heading4}>
            {t('addVirtualMacTitle')}
          </OdsText>
          {vmacs &&
            (vmacs.length === 0 ? (
              <div>
                <OdsText preset="span">
                  {t('addVirtualMacNewInfo')}
                  <OdsLink
                    className="inline"
                    href={links?.virtualMacLink?.link || '#'}
                    target="_blank"
                    label={t('addVirtualMacNewInfoGuide')}
                    onClick={() => {
                      trackClick({
                        location: PageLocation.popup,
                        buttonType: ButtonType.link,
                        actionType: 'action',
                        actions: [
                          `go-to_${links?.virtualMacLink?.trackingLabel}`,
                        ],
                      });
                    }}
                  />
                </OdsText>
              </div>
            ) : (
              /* Radio Option 1:  For creating new vmac */
              /* Radio Option 2: For using existing vmac */
              <OdsFormField>
                <div className="mb-2 flex gap-4">
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
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              handleSubmit(onSubmit)(e);
            }}
          >
            {/* New vmac type selection for Option 1 */}
            {createNewVirtualMac && (
              <div className="mt-6">
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { name } }) => (
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
                  render={({ field: { name } }) => (
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
                render={({ field: { name } }) => (
                  <OdsFormField className="my-4 block">
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
                variant={ODS_BUTTON_VARIANT.outline}
                label={t('cancel', { ns: NAMESPACES.ACTIONS })}
                onClick={closeModal}
                data-testid="cancel-button"
              />
            </div>
          </form>
        </>
      )}
    </OdsModal>
  );
}
