import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { OsdsModal, OsdsButton } from '@ovhcloud/ods-components/react';
import {
  Description,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';
import { categorizeByKey } from '@/helpers';

export default function DeleteModal({ cidr }: { cidr: TIPRestrictionsData }) {
  const { t } = useTranslation(['ip-restrictions']);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { projectId, registryId } = useParams();
  const { reset } = useFormContext();
  const { addError, addSuccess } = useNotifications();

  const { updateIpRestrictions } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError() {
      addError(t('common:private_registry_crud_cidr_error'));
    },
    onSuccess: () => {
      reset();
      addSuccess(t('private_registry_cidr_delete_success'), true);
    },
  });
  const categorizeByKeyResult = categorizeByKey(
    [
      {
        ipBlock: cidr.ipBlock,
        authorization: cidr.authorization,
        description: cidr.description,
      },
    ],
    'authorization',
    cidr.authorization,
  );

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={closeModal}
      dismissible
      headline={t('ip_restrictions_delete_block')}
    >
      <Description className="mt-6">
        {t('private_registry_cidr_delete_modal_subtitle')}
      </Description>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={closeModal}
      >
        {t('common:private_registry_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={() =>
          updateIpRestrictions({
            cidrToUpdate: categorizeByKeyResult as Record<
              FilterRestrictionsServer,
              TIPRestrictionsDefault[]
            >,
            action: TIPRestrictionsMethodEnum.DELETE,
          })
        }
      >
        {t('common:private_registry_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
