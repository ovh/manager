import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TIPRestrictionsData } from '@/types';
import { categorizeByKey } from '@/helpers';
import useDataGridContext from '@/pages/CIDR/useDatagridContext';

export default function ActionComponent({
  cidr,
}: {
  cidr: TIPRestrictionsData;
}) {
  const { t } = useTranslation(['ip-restrictions']);
  const { reset } = useFormContext();
  const { editActualRow, isDraft } = useDataGridContext();
  const navigate = useNavigate();

  const items = [
    {
      id: 0,
      label: t('ip_restrictions_edit_block'),
      disabled: isDraft,
      onClick: () => {
        const actualRow = editActualRow(cidr.ipBlock);
        reset(actualRow);
      },
    },
    {
      id: 1,
      label: t('ip_restrictions_delete_block'),
      disabled: false,
      onClick: () => {
        navigate('./delete', {
          state: {
            cidr: categorizeByKey(
              [
                {
                  ipBlock: cidr.ipBlock,
                  authorization: cidr.authorization,
                  description: cidr.description,
                },
              ],
              'authorization',
              ['management', 'registry'],
            ),
          },
        });
      },
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
