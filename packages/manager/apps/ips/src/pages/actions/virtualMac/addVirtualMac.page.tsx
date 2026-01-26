import { useEffect, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  SPINNER_SIZE,
  TEXT_PRESET,
  FormFieldLabel,
  SelectContent,
  SelectControl,
  RadioGroup,
  RadioLabel,
  RadioControl,
  Button,
  FormField,
  Input,
  Link,
  Modal,
  Radio,
  Select,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/muk';
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
import Loading from './Loading';
import {
  fromIdToIp,
  ipFormatter,
  TRANSLATION_NAMESPACES,
  useGuideUtils,
} from '@/utils';

const MAX_CHARACTERS = 250;

export default function AddVirtualMacModal() {
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.virtualMac,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);
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
  const { models, loading: isServerModelsLoading } = useGetServerModels({
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
  const {
    mutate: addVirtualMacToIp,
    isPending: addVirtualMacToIpPending,
  } = useAddVirtualMacToIp({
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
  const {
    mutate: addIpToVirtualMac,
    isPending: addIpToVirtualMacPending,
  } = useAddIpToVirtualMac({
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
  const { vmacs, loading: isVmacLoading } = useGetIpVmac({
    serviceName,
    enabled: true,
  });

  useEffect(() => {
    if (!isServerModelsLoading)
      setTypes(models?.['dedicated.server.VmacTypeEnum']?.enum || []);
  }, [models]);

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
    <Modal open onOpenChange={closeModal}>
      {isVmacLoading || addVirtualMacToIpPending || addIpToVirtualMacPending ? (
        <Loading className="flex justify-center" size={SPINNER_SIZE.md} />
      ) : (
        <>
          <Text className="mb-4 block" preset={TEXT_PRESET.heading4}>
            {t('addVirtualMacTitle')}
          </Text>
          {vmacs &&
            (vmacs.length === 0 ? (
              <div>
                <Text preset="span">
                  {t('addVirtualMacNewInfo')}
                  <Link
                    className="inline"
                    href={links?.virtualMacLink?.link || '#'}
                    target="_blank"
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
                  >
                    {t('addVirtualMacNewInfoGuide')}
                  </Link>
                </Text>
              </div>
            ) : (
              /* Radio Option 1:  For creating new vmac */
              /* Radio Option 2: For using existing vmac */
              <RadioGroup
                className="mt-4"
                value={createNewVirtualMac ? 'new' : 'existing'}
                onValueChange={(e) => setCreateNewVirtualMac(e.value === 'new')}
              >
                <Radio value="new">
                  <RadioControl />
                  <RadioLabel>{t('addVirtualMacNew')}</RadioLabel>
                </Radio>
                <Radio value="existing">
                  <RadioControl />
                  <RadioLabel>{t('addVirtualMacExisting')}</RadioLabel>
                </Radio>
              </RadioGroup>
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
                    <FormField className="w-full">
                      <FormFieldLabel>{t('virtualMacType')}</FormFieldLabel>
                      <div className="flex">
                        <Select
                          className="mt-1 flex-1"
                          name={name}
                          data-testid="input-type-selection"
                          value={[selectedType]}
                          required
                          onValueChange={(event) =>
                            setSelectedType(event.value?.[0])
                          }
                          items={types?.map((type) => ({
                            label: type,
                            value: type,
                          }))}
                        >
                          <SelectContent />
                          <SelectControl />
                        </Select>
                        {isServerModelsLoading && (
                          <Loading
                            className="flex justify-center"
                            size={SPINNER_SIZE.sm}
                          />
                        )}
                      </div>
                    </FormField>
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
                    <FormField className="w-full">
                      <FormFieldLabel>{t('virtualMacField')}</FormFieldLabel>
                      <div className="flex">
                        <Select
                          className="mt-1 flex-1"
                          name={name}
                          data-testid="input-vmac-selection"
                          value={[macAddress]}
                          required
                          onValueChange={(event) =>
                            setMacAddress(event.value?.[0])
                          }
                          items={vmacs?.map((vmac) => ({
                            label: vmac.macAddress,
                            value: vmac.macAddress,
                          }))}
                        >
                          <SelectContent />
                          <SelectControl />
                        </Select>
                        {isVmacLoading && (
                          <Loading
                            className="flex justify-center"
                            size={SPINNER_SIZE.sm}
                          />
                        )}
                      </div>
                    </FormField>
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
                  <FormField className="my-4 block">
                    <FormFieldLabel>
                      {t('virtualMacMachinename')}
                    </FormFieldLabel>
                    <Input
                      id="form-field-vm-name"
                      className="block pt-1"
                      name={name}
                      required
                      maxLength={MAX_CHARACTERS}
                      value={virtualMachineName}
                      onChange={(event) => {
                        const newValue = event.target.value || '';
                        setVirtualMachineName(newValue);
                      }}
                      data-testid="input-form-field"
                    />
                  </FormField>
                )}
              />
            </div>
            <div className="flex flex-row-reverse">
              <Button
                className="m-1"
                type="submit"
                variant={BUTTON_VARIANT.default}
                disabled={!isValid}
                data-testid="confirm-button"
              >
                {t('confirm', { ns: NAMESPACES.ACTIONS })}
              </Button>

              <Button
                className="m-1"
                type="button"
                variant={BUTTON_VARIANT.outline}
                onClick={closeModal}
                data-testid="cancel-button"
              >
                {t('cancel', { ns: NAMESPACES.ACTIONS })}
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
