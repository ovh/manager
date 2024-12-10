import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { categorizeByKey } from '@/helpers';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
  TIPRestrictionsMethodEnum,
} from '@/types';

export default function ActionComponent({
  cidr,
}: {
  cidr: TIPRestrictionsData;
}) {
  const { t } = useTranslation(['ip-restrictions']);
  const { projectId, registryId } = useParams();
  const { reset } = useFormContext();
  const { addSuccess, addError } = useNotifications();
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

  const items = [
    {
      id: 0,
      label: t('ip_restrictions_delete_block'),
      disabled: false,
      onClick: () => {
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
        updateIpRestrictions({
          cidrToUpdate: categorizeByKeyResult as Record<
            FilterRestrictionsServer,
            TIPRestrictionsDefault[]
          >,
          action: TIPRestrictionsMethodEnum.DELETE,
        });
      },
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
