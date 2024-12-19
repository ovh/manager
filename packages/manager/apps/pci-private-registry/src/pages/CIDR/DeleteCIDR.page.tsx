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
import {
  useIpRestrictionsWithFilter,
  useUpdateIpRestriction,
} from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';
import { categorizeByKey } from '@/helpers';

type DeleteModalState =
  | { all: true; cidr?: never }
  | { all?: false; cidr: TIPRestrictionsData };

export default function DeleteModal() {
  const { t } = useTranslation(['ip-restrictions']);
  const {
    state: { filters, pagination, cidr, all },
  } = useLocation() as {
    state: DeleteModalState & { filters?: Filter[] } & {
      pagination?: PaginationState;
    };
  };
  const navigate = useNavigate();
  const onClose = () => navigate('./..');
  const { projectId, registryId } = useParams();

  const { data } = useIpRestrictionsWithFilter(
    projectId,
    registryId,
    ['management', 'registry'],
    pagination,
    filters,
  );
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
          all
            ? 'private_registry_cidr_delete_all_success'
            : 'private_registry_cidr_delete_success',
        ),
        true,
      );
    },
  });

  const getCategorizedRestrictions = (
    rows: {
      ipBlock: string;
      description: string;
      authorization: FilterRestrictionsServer[];
    }[],
  ) => categorizeByKey(rows, 'authorization', ['management', 'registry']);

  const handleDelete = useCallback(() => {
    const rowsToDelete = all
      ? data.rows
          .filter((item) => item.checked)
          .map(({ ipBlock, authorization, description }) => ({
            ipBlock,
            authorization,
            description,
          }))
      : [
          {
            ipBlock: cidr?.ipBlock ?? '',
            authorization: cidr?.authorization ?? ['management'],
            description: cidr?.description ?? '',
          },
        ];
    onClose();
    const categorizedRestrictions = getCategorizedRestrictions(rowsToDelete);
    updateIpRestrictions({
      cidrToUpdate: categorizedRestrictions as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      action: TIPRestrictionsMethodEnum.DELETE,
    });
  }, [all, cidr, data, updateIpRestrictions]);

  return (
    <PciModal
      type="warning"
      title={t('ip_restrictions_delete_block')}
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
          all
            ? 'private_registry_cidr_delete_modal_all_subtitle'
            : 'private_registry_cidr_delete_modal_subtitle',
        )}
      </OsdsText>
    </PciModal>
  );
}
