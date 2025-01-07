import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { FormProvider, useFormContext } from 'react-hook-form';
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

function showCheckboxes(draft: boolean, dataLength: number): boolean {
  const minDataLength = draft ? 3 : 2;
  return dataLength >= minDataLength;
}

export const useDatagridColumn = () => {
  const { control, handleSubmit, formState, ...other } = useFormContext();

  const { t } = useTranslation(['ip-restrictions']);
  const {
    updateCheckedStateRow,
    isAllDataSelected,
    isDraft,
    rows: data,
  } = useDataGridContext();

  const columns: DatagridColumn<TIPRestrictionsData>[] = [
    {
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
          <FormProvider {...{ control, handleSubmit, formState, ...other }}>
            <IpBlock />
          </FormProvider>
        ) : (
          <DataGridTextCell>{props.ipBlock}</DataGridTextCell>
        ),
      label: t('private_registry_bloc_cidr'),
    },
    {
      id: 'description',
      cell: (props) =>
        props.draft ? (
          <FormProvider {...{ control, handleSubmit, formState, ...other }}>
            <Description />
          </FormProvider>
        ) : (
          <DataGridTextCell>{props.description}</DataGridTextCell>
        ),
      label: t('private_registry_cidr_description'),
    },
    {
      id: 'authorized',
      cell: (props) =>
        props.draft ? (
          <FormProvider {...{ control, handleSubmit, formState, ...other }}>
            <Authorization />
          </FormProvider>
        ) : (
          <div>{capitalizeAndJoin(props.authorization)}</div>
        ),
      label: t('private_registry_cidr_authorization'),
    },
    {
      id: 'add',
      cell: (props) =>
        props.draft ? (
          <FormProvider {...{ control, handleSubmit, formState, ...other }}>
            <ButtonsCIDR />
          </FormProvider>
        ) : (
          <div className="flex flex-row justify-center">
            <ActionComponent cidr={props} />
          </div>
        ),
      label: '',
    },
  ];

  return columns;
};
