import { memo, useCallback } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import {
  OsdsIcon,
  OsdsButton,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  getRegistryQueyPrefixWithId,
  useIpRestrictions,
  useUpdateIpRestriction,
} from '@/api/hooks/useIpRestrictions';
import { TIPRestrictionsData, TIPRestrictionsMethodEnum } from '@/types';

import { categorizeByKey } from '@/helpers';

const Buttons = () => {
  const queryClient = useQueryClient();
  const { projectId, registryId } = useParams();
  const { handleSubmit, formState } = useFormContext();
  const { t } = useTranslation(['ip-restructions', 'common']);

  const { addSuccess, addError } = useNotifications();

  const onError = useCallback(
    () => addError(t('common:private_registry_crud_cidr_error')),
    [addError],
  );
  const onSuccess = useCallback(
    () => addSuccess(t('private_registry_cidr_submit_success')),
    [addSuccess, t],
  );

  const { isPending: isPendingGetRestriction } = useIpRestrictions(
    projectId,
    registryId,
  );

  const { updateIpRestrictions, isPending } = useUpdateIpRestriction({
    projectId,
    registryId,
    onError,
    onSuccess,
  });

  const removeDraftRow = () =>
    queryClient.setQueryData(
      getRegistryQueyPrefixWithId(projectId, registryId, [
        'management',
        'registry',
      ]),
      (oldData: TIPRestrictionsData[]) => oldData.filter((item) => !item.draft),
    );

  const onSubmit: SubmitHandler<TIPRestrictionsData> = (data) => {
    const categorizeByKeyResult = categorizeByKey([data], 'authorization', [
      'management',
      'registry',
    ]);
    updateIpRestrictions({
      cidrToUpdate: categorizeByKeyResult,
      action: TIPRestrictionsMethodEnum.ADD,
    });
  };

  if (isPending || isPendingGetRestriction) {
    return <OsdsSpinner />;
  }

  return (
    <div className="grid grid-cols-[0.45fr,0.45fr] gap-4">
      <OsdsButton
        data-testid="remove-draft-button"
        onClick={removeDraftRow}
        type={ODS_BUTTON_TYPE.submit}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.CLOSE}
        />
      </OsdsButton>

      <OsdsButton
        data-testid="submit-button"
        role="submit"
        disabled={Boolean(Object.values(formState.errors).length) || undefined}
        type={ODS_BUTTON_TYPE.submit}
        onClick={handleSubmit(onSubmit)}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        size={ODS_BUTTON_SIZE.sm}
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.OK}
        />
      </OsdsButton>
    </div>
  );
};

export default memo(Buttons);
