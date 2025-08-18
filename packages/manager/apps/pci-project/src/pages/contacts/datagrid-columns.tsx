import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { AccountAcl } from '@/data/api/acl';
import Actions from './components/Actions.component';

export const getDatagridColumns = (
  t: (key: string) => string,
): DatagridColumn<AccountAcl>[] => [
  {
    id: 'accountId',
    label: t('cpb_rights_table_nichandle'),
    cell: (props: AccountAcl) => (
      <DataGridTextCell>{props.accountId}</DataGridTextCell>
    ),
  },
  {
    id: 'type',
    label: t('cpb_rights_table_rights'),
    cell: (props: AccountAcl) => (
      <DataGridTextCell>
        {t(`cpb_rights_table_rights_value_${props.type}`)}
      </DataGridTextCell>
    ),
  },
  {
    id: 'actions',
    label: '',
    cell: (props: AccountAcl) => <Actions accountAcl={props} />,
  },
];
