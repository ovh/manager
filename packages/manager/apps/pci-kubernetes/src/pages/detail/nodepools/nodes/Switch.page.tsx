import { ReactElement, useMemo } from 'react';

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_LEVEL } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsButton, OsdsModal, OsdsSpinner, OsdsText } from '@ovhcloud/ods-components/react';

import { useNotifications } from '@ovh-ux/manager-react-components';

import { useSwitchToMonthlyBilling } from '@/api/hooks/instances';
import { useNodes } from '@/api/hooks/nodes';
import { useTrack } from '@/hooks/track';

export default function SwitchPage(): ReactElement {
  const { projectId, kubeId: clusterId, poolId } = useParams();
  const [searchParams] = useSearchParams();

  const { trackClick } = useTrack();

  const nodeId = searchParams.get('nodeId');

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { addError, addSuccess } = useNotifications();

  const { t: tKubeNodes } = useTranslation('kube-nodes');
  const { t: tListing } = useTranslation('listing');

  const { data: nodes, isPending: isNodesPending } = useNodes(projectId, clusterId, poolId);

  const node = useMemo(() => nodes?.find((n) => n.id === nodeId), [nodes, nodeId]);

  const { switchToMonthlyBilling, isPending: isSwitching } = useSwitchToMonthlyBilling({
    onError(cause: Error & { response: { data: { message: string } } }): void {
      addError(
        tKubeNodes('kube_nodes_switch_billing_type_error', {
          message: cause?.response?.data?.message,
        }),
      );
      goBack();
    },
    onSuccess(): void {
      addSuccess(tKubeNodes('kube_nodes_switch_billing_type_success'));
      goBack();
    },
    projectId,
    instanceId: node?.instanceId,
  });

  return (
    <OsdsModal
      headline={tKubeNodes('kube_nodes_switch_to_monthly_billing_title')}
      onOdsModalClose={() => {
        goBack();
      }}
    >
      <slot name="content">
        {!isNodesPending ? (
          <>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              className="block mt-6"
            >
              {tKubeNodes('kube_nodes_switch_to_monthly_billing_desc', {
                instanceName: node?.name,
              })}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              className="block mt-6"
            >
              {tKubeNodes('kube_nodes_switch_to_monthly_billing_info')}
            </OsdsText>
          </>
        ) : (
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} className="block text-center" />
        )}
      </slot>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        onClick={() => {
          trackClick(`details::nodepools::details::nodes::billing-type::cancel`);
          goBack();
        }}
      >
        {tListing('kube_common_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackClick(`details::nodepools::details::nodes::billing-type::confirm`);
          switchToMonthlyBilling();
        }}
        {...(isSwitching ? { disabled: true } : {})}
      >
        {tKubeNodes('kube_nodes_common_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
}
