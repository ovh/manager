import React from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsLink,
  OdsMessage,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpReverseError } from '@/components/IpReverseError/IpReverseError';
import {
  useDeleteIpReverse,
  useGetIpReverse,
  useUpdateIpReverse,
} from '@/data/hooks/ip';
import {
  TRANSLATION_NAMESPACES,
  fromIdToIp,
  ipFormatter,
  useGuideUtils,
} from '@/utils';
import { isIpInsideBlock, isValidReverseDomain } from '@/utils/validators';

export default function ConfigureReverseDns() {
  const { id, parentId } = useParams();
  const { ipAddress: ip } = id
    ? ipFormatter(fromIdToIp(id))
    : { ipAddress: undefined };
  const { ipGroup, isGroup } = ipFormatter(fromIdToIp(parentId));

  const { addSuccess } = useNotifications();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { trackClick, trackPage } = useOvhTracking();

  const closeModal = ({ isSuccess }: { isSuccess?: boolean } = {}) => {
    if (!isSuccess) {
      trackClick({
        location: PageLocation.popup,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['configure_reverse-dns', 'cancel'],
      });
    }
    navigate(`..?${search.toString()}`);
  };

  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.configureReverseDns,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
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
    mutate: updateReverseDns,
    isPending: updateIpReversePending,
    error: updateIpReverseError,
  } = useUpdateIpReverse({
    ip: ipGroup,
    ipReverse: isGroup ? currentIp : ip,
    onSuccess: () => {
      closeModal({ isSuccess: true });
      addSuccess(t('listingReverseDnsUpdateSuccess'));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'update_reverse-dns_success',
      });
    },
  });

  const {
    mutate: deleteReverseDns,
    isPending: deleteIpReversePending,
    error: deleteIpReverseError,
  } = useDeleteIpReverse({
    ip: ipGroup,
    ipReverse: isGroup ? currentIp : ip,
    onSuccess: () => {
      closeModal();
      addSuccess(t('listingReverseDnsUpdateSuccess'));
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'delete_reverse-dns_success',
      });
    },
  });

  const cancel = React.useCallback(() => {
    setReverseDns(data?.data?.reverse);
    setCurrentIp('');
    closeModal();
  }, [data?.data?.reverse, closeModal]);

  const confirm = React.useCallback(() => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['configure_reverse-dns', 'confirm'],
    });
    return reverseDns
      ? updateReverseDns({ reverse: reverseDns })
      : deleteReverseDns();
  }, [updateReverseDns, deleteReverseDns, reverseDns, trackClick]);

  React.useEffect(() => {
    setReverseDns(data?.data?.reverse);
  }, [data]);

  const apiError =
    ipReverseError || updateIpReverseError || deleteIpReverseError;

  if (!ipGroup) {
    return cancel();
  }

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
      <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
        {t('reverseDnsModalDescription')}
        <OdsLink
          className="inline"
          href={links.configureReverseDnsGuide?.link}
          target="_blank"
          label="guide"
          onClick={() => {
            trackClick({
              location: PageLocation.popup,
              buttonType: ButtonType.link,
              actionType: 'action',
              actions: [
                `go-to_${links.configureReverseDnsGuide?.trackingLabel}`,
              ],
            });
          }}
        />
      </OdsText>
      {!id && (
        <OdsFormField className="mb-4 block">
          <label slot="label">{t('reverseDnsParentIpBlockFieldLabel')}</label>
          <OdsInput
            className="block"
            name="parent-ip"
            isReadonly
            value={ipGroup}
          />
        </OdsFormField>
      )}
      <OdsFormField className="mb-4 block" error={currentIpError}>
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
      <OdsFormField className="mb-4 block" error={reverseDnsError}>
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
          className={`mb-4 block`}
          color={ODS_MESSAGE_COLOR.critical}
        >
          <React.Suspense fallback={<OdsSpinner />}>
            <IpReverseError apiError={apiError} />
          </React.Suspense>
        </OdsMessage>
      )}
    </Modal>
  );
}
