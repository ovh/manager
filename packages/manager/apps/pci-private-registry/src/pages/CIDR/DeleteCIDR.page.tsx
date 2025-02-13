import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  PaginationState,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import {
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Filter } from '@ovh-ux/manager-core-api';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';

type DeleteModalState = {
  cidr: Record<FilterRestrictionsServer, TIPRestrictionsDefault[]>;
  totalRows: number;
};

export default function DeleteModal() {
  const { t } = useTranslation(['ip-restrictions']);
  const {
    state: { cidr, totalRows },
  } = useLocation() as {
    state: DeleteModalState & { filters?: Filter[] } & {
      pagination?: PaginationState;
    };
  };
  const navigate = useNavigate();
  const onClose = () => navigate('./..');
  const { projectId, registryId } = useParams();

  const { addError, addSuccess } = useNotifications();

  const { updateIpRestrictions } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError: () => {
      addError(t('common:private_registry_crud_cidr_error'));
    },
    onSuccess: () => {
      addSuccess(
        t(
          totalRows > 1
            ? 'private_registry_cidr_delete_all_success'
            : 'private_registry_cidr_delete_success',
        ),
        true,
      );
    },
  });

  const handleDelete = useCallback(() => {
    onClose();

    updateIpRestrictions({
      cidrToUpdate: cidr as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      action: TIPRestrictionsMethodEnum.DELETE,
    });
  }, [cidr, updateIpRestrictions]);

  return (
    <PciModal
      type="warning"
      title={t(
        totalRows > 1
          ? 'ip_restrictions_delete_multiple_block'
          : 'ip_restrictions_delete_block',
      )}
      isPending={false}
      isDisabled={false}
      cancelText={t('common:private_registry_common_cancel')}
      submitText={t('common:private_registry_common_confirm')}
      onConfirm={handleDelete}
      onClose={onClose}
      onCancel={onClose}
    >
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t(
          totalRows > 1
            ? 'private_registry_cidr_delete_modal_all_subtitle'
            : 'private_registry_cidr_delete_modal_subtitle',
        )}
      </OsdsText>
    </PciModal>
  );
}
