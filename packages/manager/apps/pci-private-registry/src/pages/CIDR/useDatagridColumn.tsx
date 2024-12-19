import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFormContext } from 'react-hook-form';
import ButtonsCIDR from '@/components/CIDR/ButtonsCIDR.component';
import { TIPRestrictionsData } from '@/types';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictionsWithFilter,
} from '@/api/hooks/useIpRestrictions';
import ActionComponent from '@/components/CIDR/Actions.component';
import Authorization from '@/components/CIDR/Authorization.component';
import Description from '@/components/CIDR/Description.component';
import IpBlock from '@/components/CIDR/IpBlock.component';
import { capitalizeAndJoin } from '@/helpers';
import AuthorizationLabel from '@/components/CIDR/AuthorizationLabel.component';
import Checkboxes from '@/components/CIDR/Checkboxes.component';
import AllCheckboxComponent from '@/components/CIDR/AllCheckbox.component';
import useFilter from './useFilters';

function showCheckboxes(draft: boolean, dataLength: number): boolean {
  const minDataLength = draft ? 3 : 2;
  return dataLength >= minDataLength;
}

export const useDatagridColumn = () => {
  const { control, handleSubmit, formState, ...other } = useFormContext();

  const queryClient = useQueryClient();
  const { t } = useTranslation(['ip-restrictions']);
  const { projectId = '', registryId = '' } = useParams();
  const { filters, pagination } = useFilter();
  const { data } = useIpRestrictionsWithFilter(
    projectId,
    registryId,
    ['management', 'registry'],
    pagination,
    filters,
  );

  const isDraft = useMemo(
    () => data.rows.some((restriction) => restriction.draft),
    [data],
  );

  const isAllDataSelected = useMemo(
    () =>
      data.rows
        .filter((item) => item.checked !== null)
        .every((item) => item.checked),
    [data],
  );

  const updateChecked = useCallback(
    (ipBlock: string | null, allIsSelected?: boolean) => {
      const key = getRegistryQueyPrefixWithId(projectId, registryId, [
        'management',
        'registry',
      ]);

      queryClient.setQueryData<TIPRestrictionsData[]>(key, (oldData) =>
        oldData?.map((item) => {
          if (item.checked !== null) {
            if (
              allIsSelected &&
              data.rows.find((row) => row.ipBlock === item.ipBlock)
            ) {
              return { ...item, checked: !isAllDataSelected };
            }
            if (item.ipBlock === ipBlock) {
              return { ...item, checked: !item.checked };
            }
          }
          return item;
        }),
      );
    },
    [isAllDataSelected, data],
  );

  const columns: DatagridColumn<TIPRestrictionsData>[] = [
    {
      id: 'check',
      cell: (props) =>
        props.checked !== null && showCheckboxes(isDraft, data.rows.length) ? (
          <Checkboxes
            checked={props.checked}
            ipBlock={props.ipBlock}
            updateChecked={updateChecked}
          />
        ) : (
          <></>
        ),
      label: showCheckboxes(isDraft, data.rows.length)
        ? (((
            <AllCheckboxComponent
              updateChecked={updateChecked}
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
      label: ((<AuthorizationLabel />) as unknown) as string,
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
