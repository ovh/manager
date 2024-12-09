import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categorizeByKey } from '@/helpers';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsDefault,
} from '@/types';

export default function ActionComponent({
  cidr,
}: {
  cidr: TIPRestrictionsData;
}) {
  const { t } = useTranslation(['common']);
  const { projectId, registryId } = useParams();
  const { updateIpRestrictions } = useUpdateIpRestriction({
    projectId,
    registryId,
  });

  const items = [
    {
      id: 0,
      label: t('private_registry_common_delete'),
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
          action: 'DELETE',
        });
      },
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
