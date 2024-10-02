import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsMessage,
  OsdsModal,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useAllFloatingIP, useUpdateInstance } from '@/api/hooks/useFloatingIP';
import { useFilteredInstance } from '@/api/hooks/useInstance';
import { FloatingIP, IPAddress, ResponseAPIError } from '@/interface';

export default function EditInstancePage() {
  const { t: tEdit } = useTranslation('floating-ips-edit');
  const { addSuccess, addError } = useNotifications();
  const { projectId, ipId } = useParams();
  const { data: floatingIPs, isLoading: floatingIPsLoading } = useAllFloatingIP(
    projectId || '',
  );
  const [floatingIP, setFloatingIP] = useState<FloatingIP>(undefined);
  const [selectedInstanceId, setSelectedInstanceId] = useState('');
  const [selectedPrivateNetwork, setSelectedPrivateNetwork] = useState<
    IPAddress
  >(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (floatingIPs && floatingIPs.length !== 0) {
      const selectedFloating = floatingIPs.find(({ id }) => id === ipId);
      setFloatingIP(selectedFloating);
    }
  }, [floatingIPs]);

  const {
    filteredInstances,
    isLoading: isLoadingInstances,
  } = useFilteredInstance(projectId, floatingIP);

  useEffect(() => {
    if (filteredInstances?.length) {
      setSelectedInstanceId(filteredInstances[0].id);
    }
  }, [filteredInstances]);

  const filteredPrivateNetwork = useMemo(() => {
    if (filteredInstances?.length) {
      const selectedInstance = filteredInstances?.find(
        (instance) => instance.id === selectedInstanceId,
      );
      if (!floatingIP?.associatedEntity?.gatewayId) {
        return [selectedInstance?.ipAddresses[0]];
      }
      const ipAddresses = selectedInstance?.ipAddresses.filter(
        (ipAddress) => ipAddress.type === 'private',
      );
      return ipAddresses;
    }
    return [];
  }, [selectedInstanceId]);

  useEffect(() => {
    setSelectedPrivateNetwork(filteredPrivateNetwork[0]);
  }, [filteredPrivateNetwork]);

  const handleSelectInstanceChange = (event) => {
    setSelectedInstanceId(event?.detail?.value);
  };

  const handleSelectPrivateNetworkChange = (event) => {
    const ip = event?.detail?.value;
    setSelectedPrivateNetwork(
      filteredPrivateNetwork.find((network) => network.ip === ip),
    );
  };

  const [searchParams] = useSearchParams();
  const search = useMemo(() => {
    const page = searchParams.get('page');
    return page ? `?page=${page}` : '';
  }, [searchParams]);

  const onClose = () => {
    navigate({
      pathname: '..',
      search,
    });
  };

  const { attach, isPending: isPendingUpdateInstance } = useUpdateInstance({
    projectId,
    floatingIP,
    instanceId: selectedInstanceId,
    ipAddresses: selectedPrivateNetwork?.ip,
    onSuccess: () => {
      addSuccess(
        <Translation ns={'floating-ips-edit'}>
          {(t) =>
            t('pci_additional_ips_floatingips_edit_success', {
              ip: floatingIP.ip,
            })
          }
        </Translation>,
      );
      onClose();
    },
    onError: (error) => {
      addError(
        <Translation ns={'floating-ips-edit'}>
          {(t) =>
            t('pci_additional_ips_floatingips_edit_error', {
              error: (error as ResponseAPIError)?.response?.data?.message,
              interpolation: {
                escapeValue: false,
              },
            })
          }
        </Translation>,
      );
      onClose();
    },
  });

  const isPending =
    floatingIPsLoading || isLoadingInstances || isPendingUpdateInstance;

  return (
    <OsdsModal
      headline={tEdit('pci_additional_ips_floatingips_edit')}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="editInstancePage_spinner-loading"
          />
        ) : (
          <div className="mt-5">
            {selectedInstanceId ? (
              <>
                <OsdsText
                  level={ODS_THEME_TYPOGRAPHY_LEVEL.subheading}
                  size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tEdit('pci_additional_ips_floatingips_edit_description', {
                    serviceName: floatingIP?.ip,
                  })}
                </OsdsText>
                <OsdsFormField className="mt-5">
                  <OsdsText
                    slot="label"
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                  >
                    {tEdit(
                      'pci_additional_ips_floatingips_edit_select_instance',
                    )}
                  </OsdsText>
                  <OsdsSelect
                    value={selectedInstanceId}
                    onOdsValueChange={handleSelectInstanceChange}
                    data-testid="editInstancePage_select_instance"
                  >
                    <span slot="placeholder">
                      {tEdit(
                        'pci_additional_ips_floatingips_edit_select_instance',
                      )}
                    </span>

                    {filteredInstances?.map((instance) => (
                      <OsdsSelectOption key={instance.id} value={instance.id}>
                        {instance.name}
                      </OsdsSelectOption>
                    ))}
                  </OsdsSelect>
                </OsdsFormField>
                <OsdsFormField className="mt-8">
                  <OsdsText
                    slot="label"
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                  >
                    {tEdit('pci_additional_ips_floatingips_edit_select_ip')}
                  </OsdsText>
                  <OsdsSelect
                    value={selectedPrivateNetwork?.ip}
                    onOdsValueChange={handleSelectPrivateNetworkChange}
                    data-testid="editInstancePage_select_IPAddresses"
                  >
                    {filteredPrivateNetwork?.map((network, idx) => (
                      <OsdsSelectOption key={idx} value={network.ip}>
                        {network.ip}
                      </OsdsSelectOption>
                    ))}
                  </OsdsSelect>
                </OsdsFormField>
                {!selectedPrivateNetwork?.gatewayIp && (
                  <OsdsMessage
                    type={ODS_MESSAGE_TYPE.warning}
                    color={ODS_THEME_COLOR_INTENT.warning}
                    className="mt-8"
                    data-testid="editInstancePage_message_noGatewayIPFound"
                  >
                    {tEdit('pci_additional_ips_floatingips_edit_gateway_error')}
                  </OsdsMessage>
                )}
              </>
            ) : (
              <OsdsMessage
                type={ODS_MESSAGE_TYPE.info}
                color={ODS_THEME_COLOR_INTENT.info}
                className="mt-8"
                data-testid="editInstancePage_message_noInstance"
              >
                {tEdit(
                  'pci_additional_ips_floatingips_edit_gateway_no_instance_error',
                )}
              </OsdsMessage>
            )}
          </div>
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={onClose}
        data-testid="editInstancePage_button-cancel"
      >
        {tEdit('pci_additional_ips_floatingips_edit_cancel_label')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={attach}
        {...(isPending || !selectedInstanceId ? { disabled: true } : {})}
        data-testid="editInstancePage_button-submit"
      >
        {tEdit('pci_additional_ips_floatingips_edit_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
