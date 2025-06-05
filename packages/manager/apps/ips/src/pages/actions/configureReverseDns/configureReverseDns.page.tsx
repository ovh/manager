import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ipaddr from 'ipaddr.js';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsText,
  OdsLink,
  OdsFormField,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { fromIdToIp, ipFormatter, useGuideUtils } from '@/utils';
import { isIpInsideBlock, isValidReverseDomain } from '@/utils/validators';
import { useGetIpReverse } from '@/data/hooks/ip';
import { useUpdateIpReverse } from '@/data/hooks/ip/useUpdateIpReverse';
import { useDeleteIpReverse } from '@/data/hooks/ip/useDeleteIpReverse';

export default function ConfigureReverseDns() {
  const { id } = useParams();
  const { addSuccess } = useNotifications();
  const { ip, isGroup } = ipFormatter(fromIdToIp(id));
  const navigate = useNavigate();
  const { t } = useTranslation([
    'configure-reverse-dns',
    NAMESPACES.ACTIONS,
    'error',
  ]);
  const { links } = useGuideUtils();
  const [currentIp, setCurrentIp] = React.useState('');
  const [currentIpError, setCurrentIpError] = React.useState('');
  const [reverseDnsError, setReverseDnsError] = React.useState('');
  const {
    ipsReverse,
    error: ipReverseError,
    isLoading: ipReverseLoading,
  } = useGetIpReverse({
    ip: !isGroup ? ip : currentIp,
    enabled: !isGroup || !!currentIp,
  });
  const [reverseDns, setReverseDns] = React.useState(
    ipsReverse?.[0]?.reverse || '',
  );
  const {
    mutateAsync: updateReverseDns,
    isPending: updateIpReversePending,
    error: updateIpReverseError,
  } = useUpdateIpReverse({
    ip,
    onSuccess: () => {
      navigate('..');
      addSuccess('La mise à jour du reverse est effectuée.');
    },
  });
  const {
    mutateAsync: deleteReverseDns,
    isPending: deleteIpReversePending,
    error: deleteIpReverseError,
  } = useDeleteIpReverse({
    ip,
    onSuccess: () => {
      navigate('..');
      addSuccess('La mise à jour du reverse est effectuée.');
    },
  });

  const cancel = React.useCallback(() => {
    setReverseDns(ipsReverse?.[0]?.reverse);
    navigate('..');
  }, [ipsReverse?.[0]?.reverse]);

  const confirm = React.useCallback(
    () =>
      reverseDns
        ? updateReverseDns({ reverse: reverseDns })
        : deleteReverseDns(),
    [updateReverseDns, deleteReverseDns, reverseDns],
  );

  if (!ip) {
    return cancel();
  }

  React.useEffect(() => {
    setReverseDns(ipsReverse?.[0]?.reverse);
  }, [ipsReverse]);

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
        {'Configurer le reverse DNS'}
      </OdsText>
      <OdsMessage
        isDismissible={false}
        className="block mb-4"
        color={ODS_MESSAGE_COLOR.information}
      >
        <div>
          {
            "Veuillez entrer un nom de domaine en tant que reverse DNS pour une adresse IP donnée (enregistrement PTR). Pour plus d'informations vous pouvez consulter notre "
          }
          <OdsLink
            className="inline"
            href={links.configureReverseDnsGuide}
            target="_blank"
            label="guide"
          />
        </div>
      </OdsMessage>
      {isGroup && (
        <OdsFormField className="block mb-4">
          <label slot="label">{'Parent IP block'}</label>
          <OdsInput className="block" name="parent-ip" isReadonly value={ip} />
        </OdsFormField>
      )}
      <OdsFormField className="block mb-4" error={currentIpError}>
        <label slot="label">{'Adresse IP'}</label>
        <OdsInput
          className="block"
          name="ip"
          isReadonly={
            !isGroup || updateIpReversePending || deleteIpReversePending
          }
          value={isGroup ? currentIp : ip}
          onOdsChange={(event) => {
            if (isGroup) {
              return;
            }
            const newIp = event.detail.value as string;
            if (!ipaddr.isValid(newIp)) {
              setCurrentIpError('Veuillez entrer une adresse IP valide');
            } else if (isGroup && isIpInsideBlock(ip, newIp)) {
              setCurrentIpError(
                'Veuillez entrer une adresse IP contenue dans le block',
              );
            } else {
              setCurrentIpError('');
            }
            setCurrentIp(newIp);
          }}
        />
      </OdsFormField>
      <OdsFormField className="block mb-4" error={reverseDnsError}>
        <label slot="label">{'Reverse DNS'}</label>
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
                : 'Veuillez entrer un nom de domaine valide',
            );
            setReverseDns(newDomain);
          }}
        />
      </OdsFormField>
      {(ipReverseError || updateIpReverseError || deleteIpReverseError) && (
        <OdsMessage
          isDismissible={false}
          className="block mb-4"
          color={ODS_MESSAGE_COLOR.critical}
        >
          <span
            className="text-sm"
            dangerouslySetInnerHTML={{
              __html: t('managerApiError', {
                error: (
                  ipReverseError ||
                  updateIpReverseError ||
                  deleteIpReverseError
                )?.response?.data?.message,
                ovhQueryId: (
                  ipReverseError ||
                  updateIpReverseError ||
                  deleteIpReverseError
                )?.response.headers?.['x-ovh-queryid'],
                ns: 'error',
              }),
            }}
          />
        </OdsMessage>
      )}
      <OdsButton
        slot="actions"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t('cancel', { ns: NAMESPACES.ACTIONS })}
        onClick={cancel}
      />
      <OdsButton
        slot="actions"
        type="button"
        isDisabled={
          (!currentIp && isGroup) ||
          ipReverseLoading ||
          !!ipReverseError ||
          reverseDns === ipsReverse?.[0]?.reverse
        }
        isLoading={updateIpReversePending || deleteIpReversePending}
        label={t('confirm', { ns: NAMESPACES.ACTIONS })}
        onClick={confirm}
      />
    </OdsModal>
  );
}
