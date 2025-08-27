import { useContext, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Icon, ICON_NAME, Link } from '@ovhcloud/ods-react';
import { DefaultError } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';

import { INSTANCE_PRICING_LINKS } from '@/constants';
import { useProjectId } from '@/hooks/project/useProjectId';
import { isApiErrorResponse } from '@/utils';
import {
  useInstanceActionModal,
  useInstanceParams,
} from '@/pages/instances/action/hooks/useInstanceActionModal';

const section = 'billing/monthly/activate';

const BillingMonthlyActionPage = () => {
  const projectId = useProjectId();
  const { instanceId, region } = useInstanceParams();

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { addError, addInfo } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation(['actions']);

  const { instance, isLoading } = useInstanceActionModal(
    region,
    instanceId,
    section,
  );

  const closeModal = () => navigate('..');

  const onSuccess = () => {
    addInfo(
      t(
        `pci_instances_actions_billing_monthly_activate_instance_success_message`,
        {
          name: instance?.name,
        },
      ),
      true,
    );

    closeModal();
  };

  const onError = (rawError: unknown) => {
    const errorMessage = isApiErrorResponse(rawError)
      ? rawError.response?.data.message
      : (rawError as DefaultError).message;
    addError(
      t(
        `pci_instances_actions_billing_monthly_activate_instance_error_message`,
        {
          name: instance?.name,
          error: errorMessage,
        },
      ),
      true,
    );
  };

  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    region,
    {
      onError,
      onSuccess,
    },
  );
  const handleInstanceAction = () => {
    if (!instance) return;
    mutationHandler({ instance });
  };

  const pricingHref = useMemo(() => {
    return INSTANCE_PRICING_LINKS[
      ovhSubsidiary as keyof typeof INSTANCE_PRICING_LINKS
    ];
  }, [ovhSubsidiary]);

  return (
    <ActionModal
      isLoading={isLoading}
      title={t(`pci_instances_actions_billing_monthly_activate_instance_title`)}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={closeModal}
      instance={instance}
      section={section}
    >
      <div>
        <Trans
          i18nKey={`pci_instances_actions_billing_monthly_activate_instance_confirmation_message`}
          ns={'actions'}
          components={[
            <span key="0" className="text-[--ods-color-text]" />,
            <Link
              key="1"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={pricingHref}
              dir="ltr"
              target={OdsHTMLAnchorElementTarget._blank}
            />,
          ]}
        />
        <Icon
          className="ml-4 text-[--ods-color-primary-500]"
          name={ICON_NAME.externalLink}
        />
      </div>
    </ActionModal>
  );
};

export default BillingMonthlyActionPage;
