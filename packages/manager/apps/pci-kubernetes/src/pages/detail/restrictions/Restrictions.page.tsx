import { useParams } from 'react-router-dom';

import { Translation, useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { ResponseAPIError } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  Notifications,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import {
  useDeleteRestriction,
  useMappedRestrictions,
  useUpdateRestriction,
} from '@/api/hooks/useRestriction';
import { formatIP } from '@/helpers';

import { useRestrictionColumns } from '../../../components/restriction/useRestrictionColumns';

export default function RestrictionsPage() {
  const { t } = useTranslation('restrictions');
  const { kubeId, projectId } = useParams();
  const { pagination, setPagination } = useDataGrid();
  const { addError, addSuccess } = useNotifications();

  const {
    data,
    mappedData,
    isPending: isFetchPending,
    addEmptyRow,
    deleteRowByIndex,
  } = useMappedRestrictions(projectId, kubeId, pagination);

  const { deleteRestriction, isPending: isDeletePending } = useDeleteRestriction({
    projectId,
    kubeId,
    onSuccess: () =>
      addSuccess(
        <Translation ns="restrictions">{(_t) => _t('kube_restrictions_add_success')}</Translation>,
        true,
      ),
    onError: (error: ResponseAPIError) =>
      addError(
        <Translation ns="restrictions">
          {(_t) =>
            _t('kube_restrictions_add_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      ),
  });

  const { updateRestriction, isPending: isUpdatePending } = useUpdateRestriction({
    projectId,
    kubeId,
    onSuccess: () =>
      addSuccess(
        <Translation ns="restrictions">{(_t) => _t('kube_restrictions_add_success')}</Translation>,
        true,
      ),
    onError: (error: ResponseAPIError) =>
      addError(
        <Translation ns="restrictions">
          {(_t) =>
            _t('kube_restrictions_add_error', {
              message: error?.response?.data?.message || error?.message || null,
            })
          }
        </Translation>,
        true,
      ),
  });

  const onDelete = (ip: string) => {
    if (ip) {
      const ipToDelete = ip.replace('/', '%2F');
      deleteRestriction(ipToDelete);
    }
  };

  const onClose = (ip: string, index: number) => {
    if (!ip) {
      deleteRowByIndex(index);
    }
  };

  const onSave = (ip: string, index: number) => {
    const ipsToSave = mappedData.map((d) => (d.index === index ? formatIP(ip) : d.value));
    updateRestriction(ipsToSave.filter((d) => d));
  };

  const columns = useRestrictionColumns({
    onDelete,
    onClose,
    onSave,
    disabled: isDeletePending || isUpdatePending,
  });

  return (
    <>
      <OsdsText
        size={ODS_TEXT_SIZE._600}
        level={ODS_TEXT_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block mb-5"
      >
        {t('kube_restrictions_manage')}
      </OsdsText>
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="block mb-5"
      >
        {t('kube_restrictions_manage_description')}
      </OsdsText>

      <div className="my-8">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          inline
          onClick={addEmptyRow}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2 bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('kube_restrictions_add')}
        </OsdsButton>
      </div>

      <div className="my-5">
        <Notifications />
      </div>

      {isFetchPending ? (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <div>
          <Datagrid
            columns={columns}
            items={data.rows || []}
            totalItems={data?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            className="overflow-x-visible"
          />
        </div>
      )}
    </>
  );
}
