import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  useGetIpMitigationWithoutIceberg,
  useUpdateIpMitigation,
} from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';

export default function ManageIpMitigationModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { ip, ipGroup } = ipFormatter(fromIdToIp(id));
  const [search] = useSearchParams();
  const {
    ipMitigation,
    isLoading: isMitigationLoading,
  } = useGetIpMitigationWithoutIceberg({
    ip,
  });
  const { addWarning, addError } = useNotifications();
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS, 'error']);

  // If there is no mitigation on IP then its a default mitigation.
  const isDefaultMitigation = Object.keys(ipMitigation).length === 0;
  const title = isDefaultMitigation
    ? t('listingManageMitigation_permanent_title')
    : t('listingManageMitigation_auto_title');
  const question = isDefaultMitigation
    ? t('listingManageMitigation_permanent_question', { t0: ip })
    : t('listingManageMitigation_auto_question', { t0: ip });

  const disableConfirm =
    ipMitigation?.state === 'creationPending' ||
    ipMitigation?.state === 'removalPending';

  // Determine the new mitigation type to set for ip upon confirmation
  // If isDefaultMitigation the new mitigation will be permanent and vice versa
  const mitigation = isDefaultMitigation ? 'PERMANENT' : 'DEFAULT';

  const ipBlock = ipGroup;

  const closeModal = () => {
    navigate(`..?${search.toString()}`);
  };

  const {
    mutate: updateIpMitigation,
    isPending: updateIpMitigationPending,
  } = useUpdateIpMitigation({
    ipBlock,
    ip,
    mitigation,
    onSuccess: () => {
      closeModal();
      addWarning(
        isDefaultMitigation
          ? t('listingManageMitigation_permanent_success', { t0: ip })
          : t('listingManageMitigation_auto_success', { t0: ip }),
      );
    },
    onError: () => {
      closeModal();
      addError(
        isDefaultMitigation
          ? t('listingManageMitigation_permanent_failed', { t0: ip })
          : t('listingManageMitigation_auto_failed', { t0: ip }) ||
              t('error:default'),
      );
    },
  });

  const confirm = () => updateIpMitigation();

  return (
    <Modal
      isOpen
      isLoading={isMitigationLoading}
      heading={title}
      onDismiss={closeModal}
      onSecondaryButtonClick={closeModal}
      onPrimaryButtonClick={confirm}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      primaryButtonTestId="confirm-button"
      isPrimaryButtonLoading={updateIpMitigationPending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      secondaryButtonTestId="cancel-button"
      isPrimaryButtonDisabled={updateIpMitigationPending || disableConfirm}
    >
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        {question}
      </OdsText>
    </Modal>
  );
}
