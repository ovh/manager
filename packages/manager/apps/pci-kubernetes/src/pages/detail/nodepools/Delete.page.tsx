import { ReactElement, useMemo, useState } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_INPUT_TYPE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsModal,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { useClusterNodePools, useDeleteNodePool } from '@/api/hooks/node-pools';
import LoadingSkeleton from '@/components/LoadingSkeleton.component';
import { useTrack } from '@/hooks/track';
import queryClient from '@/queryClient';

const CONFIRMATION_TEXT = 'DELETE';

export default function DeletePage(): ReactElement {
  const { projectId, kubeId: clusterId } = useParams();
  const [searchParams] = useSearchParams();
  const poolId = searchParams.get('nodePoolId');

  const { trackClick } = useTrack();

  const [confirmationInputData, setConfirmationInputData] = useState<{
    hasError: boolean;
    text: string;
  }>({
    hasError: false,
    text: '',
  });

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t: tKubeNodes } = useTranslation('kube-nodes');
  const { t: tNodePool } = useTranslation('node-pool');
  const { t: tCommon } = useTranslation('common');
  const { t: tNodePoolDelete } = useTranslation('delete-pool');

  const { data: pools, isPending: isPoolsPending } = useClusterNodePools(projectId, clusterId);

  const pool = useMemo(() => pools?.find((p) => p.id === poolId), [pools, poolId]);

  const { deletePool, isPending: isDeleting } = useDeleteNodePool({
    onError(cause: Error & { response: { data: { message: string } } }): void {
      addError(
        tNodePoolDelete('kube_node_pool_delete_error', {
          message: cause?.response?.data?.message,
        }),
      );
      goBack();
    },
    onSuccess: async () => {
      goBack();
      addSuccess(tNodePoolDelete('kube_node_pool_delete_success'));
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'kubernetes', clusterId, 'nodePools'],
      });
    },
    projectId,
    clusterId,
    poolId,
  });

  const remove = () => {
    if (confirmationInputData.text === CONFIRMATION_TEXT) {
      deletePool();
    } else {
      setConfirmationInputData((prev) => ({ ...prev, hasError: true }));
    }
  };

  return (
    <OsdsModal
      headline={tNodePool('kube_node_pool_delete')}
      onOdsModalClose={() => {
        goBack();
      }}
      color={ODS_THEME_COLOR_INTENT.warning}
    >
      <slot name="content">
        <LoadingSkeleton when={!isPoolsPending && !isDeleting}>
          <>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              className="block mt-6"
            >
              {tNodePoolDelete('kube_node_pool_delete_confirmation', {
                node: pool?.name,
              })}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              className="block mt-6"
            >
              {tNodePoolDelete('kube_node_pool_delete_warning')}
            </OsdsText>

            <OsdsFormField
              className="mt-4"
              inline
              error={confirmationInputData.hasError ? tCommon('common_field_error_required') : ''}
            >
              <OsdsText
                slot="label"
                color={
                  confirmationInputData.hasError
                    ? ODS_THEME_COLOR_INTENT.error
                    : ODS_THEME_COLOR_INTENT.text
                }
                className="mt-4"
                size={ODS_TEXT_SIZE._200}
              >
                {tNodePoolDelete('kube_node_pool_delete_enter')}
              </OsdsText>
              <OsdsInput
                value={confirmationInputData.text}
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                onOdsValueChange={(e) => {
                  setConfirmationInputData((prev) => ({
                    ...prev,
                    text: e.detail.value,
                  }));
                  if (e.detail.value === CONFIRMATION_TEXT) {
                    setConfirmationInputData((prev) => ({
                      ...prev,
                      hasError: false,
                    }));
                  } else {
                    setConfirmationInputData((prev) => ({
                      ...prev,
                      hasError: true,
                    }));
                  }
                }}
                type={ODS_INPUT_TYPE.text}
                error={false}
                className="border"
              />
            </OsdsFormField>
          </>
        </LoadingSkeleton>
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          trackClick(`details::nodepools::delete::cancel`);
          goBack();
        }}
      >
        {tKubeNodes('kube_nodes_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackClick(`details::nodepools::delete::confirm`);
          remove();
        }}
        {...(isDeleting ? { disabled: true } : {})}
      >
        {tKubeNodes('kube_nodes_common_delete')}
      </OsdsButton>
    </OsdsModal>
  );
}
