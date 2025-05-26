import { OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { FC, useContext, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
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
    return ovhSubsidiary
      ? INSTANCE_PRICING_LINKS[
          ovhSubsidiary as keyof typeof INSTANCE_PRICING_LINKS
        ]
      : INSTANCE_PRICING_LINKS.DEFAULT;
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
            <OsdsLink
              key="0"
              color={ODS_THEME_COLOR_INTENT.primary}
              href={pricingHref}
              dir="ltr"
              target={OdsHTMLAnchorElementTarget._blank}
            />,
          ]}
        />
        <OsdsIcon
          slot="end"
          className="ml-4"
          name={ODS_ICON_NAME.EXTERNAL_LINK}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </div>
    </ActionModal>
  );
};

export default BillingMonthlyActionPage;
