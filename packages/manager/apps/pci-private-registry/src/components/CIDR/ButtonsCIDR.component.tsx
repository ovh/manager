import { useCallback } from 'react';
import {
  ODS_BUTTON_TYPE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { OsdsIcon, OsdsSpinner } from '@ovhcloud/ods-components/react';

import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useUpdateIpRestriction } from '@/api/hooks/useIpRestrictions';
import {
  FilterRestrictionsServer,
  TIPRestrictionsData,
  TIPRestrictionsMethodEnum,
} from '@/types';

import { categorizeByKey } from '@/helpers';
import useDataGridContext from '@/pages/CIDR/useDatagridContext';

const Buttons = () => {
  const { projectId = '', registryId = '' } = useParams();
  const {
    removeDraftRow,
    isUpdating,
    setPagination,
    pagination,
  } = useDataGridContext();
  const { handleSubmit, formState, reset } = useFormContext();
  const { t } = useTranslation(['ip-restrictions', 'common']);

  const { addSuccess, addError, clearNotifications } = useNotifications();

  const onError = useCallback(
    () => addError(t('common:private_registry_crud_cidr_error')),
    [addError],
  );

  const onSuccess = useCallback(() => {
    removeDraftRow();
    clearNotifications();
    reset();
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
    addSuccess(
      t(
        isUpdating
          ? 'private_registry_cidr_edition_success'
          : 'private_registry_cidr_submit_success',
      ),
      true,
    );
  }, [addSuccess, t]);

  const { updateIpRestrictions, isPending } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError,
    onSuccess,
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const categorizeByKeyResult = categorizeByKey([data], 'authorization', [
      'management',
      'registry',
    ]);
    updateIpRestrictions({
      cidrToUpdate: categorizeByKeyResult as Record<
        FilterRestrictionsServer,
        TIPRestrictionsData[]
      >,
      action: isUpdating
        ? TIPRestrictionsMethodEnum.REPLACE
        : TIPRestrictionsMethodEnum.ADD,
    });
  };

  if (isPending) {
    return <OsdsSpinner />;
  }

  return (
    <div className="md:grid grid-cols-[0.5fr,0.5fr] gap-4 ">
      <button
        className="button-datagrid-form cursor-pointer border-[--ods-color-blue-200] border-solid border pt-3 bg-white rounded"
        data-testid="remove-draft-button"
        onClick={() => {
          removeDraftRow();
          reset();
        }}
        type={ODS_BUTTON_TYPE.reset}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.CLOSE}
        />
      </button>

      <button
        className="button-datagrid-form cursor-pointer border-[--ods-color-blue-200] border-solid border bg-white pt-3  rounded"
        data-testid="submit-button"
        disabled={Boolean(Object.values(formState.errors)?.length) || undefined}
        type={ODS_BUTTON_TYPE.submit}
        onClick={handleSubmit(onSubmit)}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.OK}
        />
      </button>
    </div>
  );
};

export default Buttons;
