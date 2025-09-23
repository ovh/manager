import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ipaddr from 'ipaddr.js';
import {
  OdsText,
  OdsLink,
  OdsFormField,
  OdsInput,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { fromIdToIp, ipFormatter, useGuideUtils } from '@/utils';
import { isIpInsideBlock, isValidReverseDomain } from '@/utils/validators';
import {
  useDeleteIpReverse,
  useUpdateIpReverse,
  useGetIpReverse,
} from '@/data/hooks/ip';
import { IpReverseError } from '@/components/IpReverseError/IpReverseError';

export default function ConfigureReverseDns() {
  const { id, parentId } = useParams();
  const { ipAddress: ip } = id
    ? ipFormatter(fromIdToIp(id))
    : { ipAddress: undefined };
  const { ipGroup, isGroup } = ipFormatter(fromIdToIp(parentId));

  const { addSuccess } = useNotifications();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const { t } = useTranslation([
    'configure-reverse-dns',
    NAMESPACES.ACTIONS,
    'error',
  ]);
  const { links } = useGuideUtils();
  const [currentIp, setCurrentIp] = React.useState(isGroup ? ip : '');
  const [currentIpError, setCurrentIpError] = React.useState('');
  const [reverseDnsError, setReverseDnsError] = React.useState('');
  const {
    data,
    error: ipReverseError,
    isLoading: ipReverseLoading,
  } = useGetIpReverse({
    ip: ipGroup,
    ipReverse: ip,
    enabled: !isGroup || !!id,
  });
  const [reverseDns, setReverseDns] = React.useState(data?.data?.reverse || '');

  const {
    mutateAsync: updateReverseDns,
    isPending: updateIpReversePending,
    error: updateIpReverseError,
  } = useUpdateIpReverse({
    ip: ipGroup,
    ipReverse: ip,
    onSuccess: () => {
      closeModal();
      addSuccess(t('listingReverseDnsUpdateSuccess'));
    },
  });

  const {
    mutateAsync: deleteReverseDns,
    isPending: deleteIpReversePending,
    error: deleteIpReverseError,
  } = useDeleteIpReverse({
    ip: ipGroup,
    ipReverse: ip,
    onSuccess: () => {
      closeModal();
      addSuccess(t('listingReverseDnsUpdateSuccess'));
    },
  });

  const cancel = React.useCallback(() => {
    setReverseDns(data?.data?.reverse);
    setCurrentIp('');
    closeModal();
  }, [data?.data?.reverse]);

  const confirm = React.useCallback(
    () =>
      reverseDns
        ? updateReverseDns({ reverse: reverseDns })
        : deleteReverseDns(),
    [updateReverseDns, deleteReverseDns, reverseDns],
  );

  if (!ipGroup) {
    return cancel();
  }

  React.useEffect(() => {
    setReverseDns(data?.data?.reverse);
  }, [data]);

  const apiError =
    ipReverseError || updateIpReverseError || deleteIpReverseError;

  return (
    <Modal
      isOpen
      heading={t('reverseDnsModalTitle')}
      onDismiss={cancel}
      onSecondaryButtonClick={cancel}
      onPrimaryButtonClick={confirm}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      primaryButtonTestId="confirm-button"
      isPrimaryButtonLoading={updateIpReversePending || deleteIpReversePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      secondaryButtonTestId="cancel-button"
      isPrimaryButtonDisabled={
        (!currentIp && isGroup) ||
        ipReverseLoading ||
        !!ipReverseError ||
        reverseDns === data?.data?.reverse
      }
    >
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {t('reverseDnsModalDescription')}
        <OdsLink
          className="inline"
          href={links.configureReverseDnsGuide}
          target="_blank"
          label="guide"
        />
      </OdsText>
      {!id && (
        <OdsFormField className="block mb-4">
          <label slot="label">{t('reverseDnsParentIpBlockFieldLabel')}</label>
          <OdsInput
            className="block"
            name="parent-ip"
            isReadonly
            value={ipGroup}
          />
        </OdsFormField>
      )}
      <OdsFormField className="block mb-4" error={currentIpError}>
        <label slot="label">{t('reverseDnsIpFieldLabel')}</label>
        <OdsInput
          className="block"
          name="current-ip"
          isReadonly={
            !isGroup || !!id || updateIpReversePending || deleteIpReversePending
          }
          value={isGroup ? currentIp : ip}
          hasError={!!currentIpError}
          onOdsChange={(event) => {
            if (!isGroup) {
              return;
            }
            const newIp = event.detail.value as string;
            if (!ipaddr.isValid(newIp)) {
              setCurrentIpError(t('reverseDnsIpError'));
            } else if (!isIpInsideBlock(ipGroup, newIp)) {
              setCurrentIpError(t('reverseDnsIpNotInsideBlockError'));
            } else {
              setCurrentIpError('');
            }
            setCurrentIp(newIp);
          }}
        />
      </OdsFormField>
      <OdsFormField className="block mb-4" error={reverseDnsError}>
        <label slot="label">{t('reverseDnsDnsFieldLabel')}</label>
        <OdsInput
          className="block"
          name="reverse-dns"
          value={reverseDns}
          isClearable
          isReadonly={updateIpReversePending || deleteIpReversePending}
          onOdsChange={(event) => {
            const newDomain = event.detail.value as string;
            setReverseDnsError(
              !newDomain || isValidReverseDomain(newDomain)
                ? ''
                : t('reverseDnsDnsError'),
            );
            setReverseDns(newDomain);
          }}
        />
      </OdsFormField>
      {apiError && (
        <OdsMessage
          isDismissible={false}
          className={`block mb-4`}
          color={ODS_MESSAGE_COLOR.critical}
        >
          <IpReverseError apiError={apiError} />
        </OdsMessage>
      )}
    </Modal>
  );
}
