import React from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import ipaddr from 'ipaddr.js';
import { useTranslation } from 'react-i18next';

import {
  FormFieldError,
  FormFieldLabel,
  MESSAGE_COLOR,
  MessageBody,
  TEXT_PRESET,
  FormField,
  Input,
  Link,
  Message,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';
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
    cancel();
    return <></>;
  }

  return (
    <Modal
      heading={t('reverseDnsModalTitle')}
      onOpenChange={cancel}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: cancel,
        testId: 'cancel-button',
      }}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        onClick: confirm,
        testId: 'confirm-button',
        loading: updateIpReversePending || deleteIpReversePending,
        disabled:
          (!currentIp && isGroup) ||
          ipReverseLoading ||
          !!ipReverseError ||
          reverseDns === data?.data?.reverse,
      }}
    >
      <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
        {t('reverseDnsModalDescription')}
        <Link
          className="inline"
          href={links.configureReverseDnsGuide?.link}
          target="_blank"
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
        >
          guide
        </Link>
      </Text>
      {!id && (
        <FormField className="mb-4 block">
          <FormFieldLabel>
            {t('reverseDnsParentIpBlockFieldLabel')}
          </FormFieldLabel>
          <Input className="block" name="parent-ip" readOnly value={ipGroup} />
        </FormField>
      )}
      <FormField className="mb-4 block" invalid={!!currentIpError}>
        <FormFieldLabel>{t('reverseDnsIpFieldLabel')}</FormFieldLabel>
        <Input
          className="w-full"
          name="current-ip"
          readOnly={
            !isGroup || !!id || updateIpReversePending || deleteIpReversePending
          }
          value={isGroup ? currentIp : ip}
          invalid={!!currentIpError}
          onChange={(event) => {
            if (!isGroup) {
              return;
            }
            const newIp = event.target.value;
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
        <FormFieldError>{currentIpError}</FormFieldError>
      </FormField>
      <FormField className="mb-4 block" invalid={!!reverseDnsError}>
        <FormFieldLabel>{t('reverseDnsDnsFieldLabel')}</FormFieldLabel>
        <Input
          className="w-full"
          name="reverse-dns"
          value={reverseDns}
          clearable
          readOnly={updateIpReversePending || deleteIpReversePending}
          onChange={(event) => {
            const newDomain = event.target.value;
            setReverseDnsError(
              !newDomain || isValidReverseDomain(newDomain)
                ? ''
                : t('reverseDnsDnsError'),
            );
            setReverseDns(newDomain);
          }}
        />
        <FormFieldError>{reverseDnsError}</FormFieldError>
      </FormField>
      {apiError && (
        <Message
          dismissible={false}
          className="mb-4 block"
          color={MESSAGE_COLOR.critical}
        >
          <MessageBody>
            <React.Suspense fallback={<Spinner />}>
              <IpReverseError apiError={apiError} />
            </React.Suspense>
          </MessageBody>
        </Message>
      )}
    </Modal>
  );
}
