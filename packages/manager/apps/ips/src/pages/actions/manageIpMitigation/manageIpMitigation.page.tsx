import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { useGetIpMitigation, useUpdateIpMitigation } from '@/data/hooks/ip';
import { fromIdToIp, ipFormatter } from '@/utils';
import Loading from '../../listing/manageOrganisations/components/Loading/Loading';

export default function ManageIpMitigationModal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { ip, ipGroup } = ipFormatter(fromIdToIp(id));
  const { ipMitigation, isLoading: isMitigationLoading } = useGetIpMitigation({
    ip,
  });
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation(['listing', NAMESPACES.ACTIONS, 'error']);

  // If there is no mitigation on IP then its a default mitigation.
  const isDefaultMitigation = (ipMitigation?.length ?? 0) === 0;
  const title = isDefaultMitigation
    ? t('listingManageMitigation_permanent_title')
    : t('listingManageMitigation_auto_title');
  const question = isDefaultMitigation
    ? t('listingManageMitigation_permanent_question', { t0: ip })
    : t('listingManageMitigation_auto_question', { t0: ip });

  // Determine the new mitigation type to set for ip upon confirmation
  // If isDefaultMitigation the new mitigation will be permanent and vice versa
  const mitigation = isDefaultMitigation ? 'PERMANENT' : 'DEFAULT';

  const ipBlock = ipGroup;

  const {
    mutate: updateIpMitigation,
    isPending: updateIpMitigationPending,
  } = useUpdateIpMitigation({
    ipBlock,
    ip,
    mitigation,
    onSuccess: () => {
      navigate('..');
      addSuccess(
        isDefaultMitigation
          ? t('listingManageMitigation_permanent_success', { t0: ip })
          : t('listingManageMitigation_auto_success', { t0: ip }),
      );
    },
    onError: () => {
      navigate('..');
      addError(
        isDefaultMitigation
          ? t('listingManageMitigation_permanent_failed', { t0: ip })
          : t('listingManageMitigation_auto_failed', { t0: ip }) ||
              t('error:default'),
      );
    },
  });

  const cancel = () => navigate('..');
  const confirm = () => updateIpMitigation();

  return (
    <OdsModal isOpen isDismissible onOdsClose={cancel}>
      {isMitigationLoading ? (
        <Loading className="flex justify-center" size={ODS_SPINNER_SIZE.sm} />
      ) : (
        <>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading4}>
            {title}
          </OdsText>
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
            {question}
          </OdsText>
          <OdsButton
            slot="actions"
            type="button"
            variant={ODS_BUTTON_VARIANT.ghost}
            label={t('cancel', { ns: NAMESPACES.ACTIONS })}
            onClick={cancel}
            data-testid="cancel-button"
          />
          <OdsButton
            slot="actions"
            type="button"
            isDisabled={updateIpMitigationPending}
            label={t('validate', { ns: NAMESPACES.ACTIONS })}
            onClick={confirm}
            data-testid="confirm-button"
          />
          {updateIpMitigationPending && (
            <Loading
              className="flex justify-center"
              size={ODS_SPINNER_SIZE.sm}
            />
          )}
        </>
      )}
    </OdsModal>
  );
}
