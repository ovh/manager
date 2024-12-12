import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useCallback, useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';
import { FormProvider, useFormContext } from 'react-hook-form';
import ButtonsCIDR from '@/components/CIDR/ButtonsCIDR';
import { TIPRestrictionsData } from '@/types';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictions,
} from '@/api/hooks/useIpRestrictions';
import ActionComponent from '@/components/CIDR/Actions';
import Authorization from '@/components/CIDR/Authorization';
import Description from '@/components/CIDR/Description';
import IpBlock from '@/components/CIDR/IpBlock';
import { capitalizeAndJoin } from '@/helpers';
import AuthorizationLabel from '@/components/CIDR/AuthorizationLabel';
import Checkboxes from '@/components/CIDR/Checkboxes.component';
import AllCheckboxComponent from '@/components/CIDR/AllCheckbox.component';

function evaluateDraftAndData(draft, dataLength) {
  if (!draft) {
    if (dataLength < 2) {
      return false;
    }
  }
  if (draft) {
    if (dataLength < 3) {
      return false;
    }
  }
  return true;
}

export const useDatagridColumn = () => {
  const { control, handleSubmit, formState, ...other } = useFormContext();

  const queryClient = useQueryClient();
  const { t } = useTranslation(['ip-restrictions']);
  const { projectId, registryId } = useParams();

  const { data } = useIpRestrictions(projectId, registryId);

  const isDraft = useMemo(() => data.some((restriction) => restriction.draft), [
    data,
  ]);

  const dataAllSelected = useMemo(
    () =>
      data
        .filter((item) => item.checked !== null)
        .every((item) => item.checked),
    [data],
  );

  const updateChecked = useCallback(
    (ipBlock: string, allIsSelected?: boolean) => {
      const key = getRegistryQueyPrefixWithId(projectId, registryId, [
        'management',
        'registry',
      ]);

      queryClient.setQueryData(key, (oldData: TIPRestrictionsData[]) =>
        oldData.map((item) => {
          if (allIsSelected && item.checked !== null) {
            return { ...item, checked: !dataAllSelected };
          }
          if (item.ipBlock === ipBlock) {
            return { ...item, checked: !item.checked };
          }
          return item;
        }),
      );
    },
    [dataAllSelected],
  );

  const columns: DatagridColumn<TIPRestrictionsData>[] = [
    {
      id: 'check',
      cell: (props) =>
        props.checked !== null && evaluateDraftAndData(isDraft, data.length) ? (
          <Checkboxes
            checked={props.checked}
            ipBlock={props.ipBlock}
            updateChecked={updateChecked}
            dataAllSelected={dataAllSelected}
          />
        ) : (
          <></>
        ),
      label: evaluateDraftAndData(isDraft, data.length)
        ? (((
            <AllCheckboxComponent
              updateChecked={updateChecked}
              dataAllSelected={dataAllSelected}
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
