import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';
import { OsdsModal, OsdsButton } from '@ovhcloud/ods-components/react';
import {
  Description,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import {
  useIpRestrictions,
  useUpdateIpRestriction,
} from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';
import { categorizeByKey } from '@/helpers';

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
  const { data } = useIpRestrictions(projectId, registryId);
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

  const deleteAllSelectedRows = useCallback(() => {
    const rowToDelete = data
      .filter((item) => item.checked)
      .map((item) => ({
        ipBlock: item.ipBlock,
        authorization: item.authorization,
        description: item.description,
      }));

    const categorizeByKeyResultAll = categorizeByKey(
      rowToDelete,
      'authorization',
      ['management', 'registry'],
    );
    updateIpRestrictions({
      cidrToUpdate: categorizeByKeyResultAll as Record<
        FilterRestrictionsServer,
        TIPRestrictionsDefault[]
      >,
      action: TIPRestrictionsMethodEnum.DELETE,
    });
  }, [data, updateIpRestrictions]);

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={() => onClose()}
      dismissible
      headline={t('ip_restrictions_delete_block')}
    >
      <Description className="mt-6">
        {t(
          all
            ? 'private_registry_cidr_delete_modal_all_subtitle'
            : 'private_registry_cidr_delete_modal_subtitle',
        )}
      </Description>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={() => onClose()}
      >
        {t('common:private_registry_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={() => {
          if (all) {
            return deleteAllSelectedRows();
          }
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
          return updateIpRestrictions({
            cidrToUpdate: categorizeByKeyResult as Record<
              FilterRestrictionsServer,
              TIPRestrictionsDefault[]
            >,
            action: TIPRestrictionsMethodEnum.DELETE,
          });
        }}
      >
        {t('common:private_registry_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
