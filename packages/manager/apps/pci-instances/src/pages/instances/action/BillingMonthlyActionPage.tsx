import { FC, useContext, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Icon, ICON_NAME, Link } from '@ovhcloud/ods-react';
import ActionModal from '@/components/actionModal/ActionModal.component';
import { useBaseInstanceAction } from '@/data/hooks/instance/action/useInstanceAction';

import { TRescueActionPageProps } from './RescueAction.page';
import { INSTANCE_PRICING_LINKS } from '@/constants';

type TBillingMonthlyActionPageProps = Omit<
  TRescueActionPageProps,
  'section'
> & {
  section: 'billing/monthly/activate';
};

const BillingMonthlyActionPage: FC<TBillingMonthlyActionPageProps> = ({
  title,
  onModalClose,
  section,
  instance,
  projectId,
  onError,
  onSuccess,
  isLoading,
}) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { mutationHandler, isPending } = useBaseInstanceAction(
    section,
    projectId,
    {
      onError,
      onSuccess,
    },
  );
  const handleInstanceAction = () => {
    if (!instance) return;
    mutationHandler(instance);
  };

  const pricingHref = useMemo(() => {
    return INSTANCE_PRICING_LINKS[
      ovhSubsidiary as keyof typeof INSTANCE_PRICING_LINKS
    ];
  }, [ovhSubsidiary]);

  return (
    <ActionModal
      isLoading={isLoading}
      title={title}
      isPending={isPending}
      handleInstanceAction={handleInstanceAction}
      onModalClose={onModalClose}
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
