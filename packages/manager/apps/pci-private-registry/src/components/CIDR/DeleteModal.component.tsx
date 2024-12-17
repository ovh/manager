import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useCallback, useContext } from 'react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PciModal } from '@ovh-ux/manager-pci-common';
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
import { Context } from '../../pages/CIDR/FilterContext.provider';

type DeleteModalProps =
  | { all: true; cidr?: never; onClose: () => void }
  | { all?: false; cidr: TIPRestrictionsData; onClose: () => void };

export default function DeleteModal({
  cidr,
  all = false,
  onClose,
}: DeleteModalProps) {
  const { t } = useTranslation(['ip-restrictions']);

  const { projectId, registryId } = useParams();
  const { filters, pagination } = useContext(Context);
  const { data } = useIpRestrictionsWithFilter(
    projectId,
    registryId,
    ['management', 'registry'],
    pagination,
    filters,
  );
  const { reset } = useFormContext();
  const { addError, addSuccess } = useNotifications();

  const { updateIpRestrictions } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError: () => {
      addError(t('common:private_registry_crud_cidr_error'));
    },
    onSuccess: () => {
      reset();
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
      {t(
        all
          ? 'private_registry_cidr_delete_modal_all_subtitle'
          : 'private_registry_cidr_delete_modal_subtitle',
      )}
    </PciModal>
  );
}
