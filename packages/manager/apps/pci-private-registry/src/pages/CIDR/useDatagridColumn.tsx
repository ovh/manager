import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';

import ButtonsCIDR from '@/components/CIDR/ButtonsCIDR.component';
import { TIPRestrictionsData } from '@/types';
import ActionComponent from '@/components/CIDR/Actions.component';
import Authorization from '@/components/CIDR/Authorization.component';
import Description from '@/components/CIDR/Description.component';
import IpBlock from '@/components/CIDR/IpBlock.component';
import { capitalizeAndJoin } from '@/helpers';
import Checkboxes from '@/components/CIDR/Checkboxes.component';
import AllCheckboxComponent from '@/components/CIDR/AllCheckbox.component';
import useDataGridContext from './useDatagridContext';
import AuthorizationLabel from '@/components/CIDR/AuthorizationLabel.component';

function showCheckboxes(draft: boolean, dataLength: number): boolean {
  const minDataLength = draft ? 3 : 2;
  return dataLength >= minDataLength;
}

export const useDatagridColumn = () => {
  const { t } = useTranslation(['ip-restrictions']);
  const {
    updateCheckedStateRow,
    isAllDataSelected,
    isDraft,
    rows: data,
  } = useDataGridContext();

  const columns: DatagridColumn<TIPRestrictionsData>[] = [
    {
      isSortable: false,
      id: 'check',
      cell: (props) =>
        props.checked !== null && showCheckboxes(isDraft, data.length) ? (
          <Checkboxes
            checked={props.checked}
            ipBlock={props.ipBlock}
            updateChecked={updateCheckedStateRow}
          />
        ) : (
          <></>
        ),
      label: showCheckboxes(isDraft, data.length)
        ? (((
            <AllCheckboxComponent
              updateChecked={updateCheckedStateRow}
              isAllDataSelected={isAllDataSelected}
            />
          ) as unknown) as string)
        : '',
    },
    {
      id: 'cidr',
      cell: (props) =>
        props.draft ? (
          <IpBlock />
        ) : (
          <DataGridTextCell>{props.ipBlock}</DataGridTextCell>
        ),
      label: t('private_registry_bloc_cidr'),
    },
    {
      id: 'description',
      cell: (props) =>
        props.draft ? (
          <Description />
        ) : (
          <DataGridTextCell>{props.description}</DataGridTextCell>
        ),
      label: t('private_registry_cidr_description'),
    },
    {
      isSortable: false,
      id: 'authorized',
      cell: (props) =>
        props.draft ? (
          <Authorization />
        ) : (
          <div>{capitalizeAndJoin(props.authorization)}</div>
        ),
      // need to had a Popover next to the label
      label: ((<AuthorizationLabel />) as unknown) as string,
    },
    {
      id: 'add',
      cell: (props) =>
        props.draft ? (
          <ButtonsCIDR />
        ) : (
          <div className="flex flex-row justify-center">
            <ActionComponent cidr={props} />
          </div>
        ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
