import { useTranslation } from 'react-i18next';

import { DrawerOpenChangeDetail, Link, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { HelpDrawer } from '@/components/help-drawer/HelpDrawer.component';

const guide = 'fds';
const handleOpenGuideLink = () => {
  // TODO track open guide click
};

const handleOpenHelper = ({ open }: DrawerOpenChangeDetail) => {
  if (open) {
    // TODO track click
  }
};

export const PlanHelper = () => {
  const { t } = useTranslation('add');

  return (
    <HelpDrawer onOpenChange={handleOpenHelper}>
      <Text preset="heading-2">{t('kube_add_plan_helper_title')}</Text>

      <Text preset="paragraph" className="py-4">
        {t('kube_add_plan_helper_description')}
      </Text>

      <Text preset="paragraph" className="font-semibold">
        {t('kube_add_plan_helper_free_title')}
      </Text>
      <Text preset="paragraph" className="pb-4">
        {t('kube_add_plan_helper_free_description')}
      </Text>

      <Text preset="paragraph" className="font-semibold">
        {t('kube_add_plan_helper_standard_title')}
      </Text>
      <Text preset="paragraph" className="pb-4">
        {t('kube_add_plan_helper_standard_description')}
      </Text>

      <Text preset="paragraph" className="font-semibold">
        {t('kube_add_plan_helper_difference_title')}
      </Text>
      <ul className="list-disc space-y-2 pb-4 pl-5">
        <li>
          <Text preset="paragraph">{t('kube_add_plan_helper_difference_sla')}</Text>
        </li>
        <li>
          <Text preset="paragraph">{t('kube_add_plan_helper_difference_etcd')}</Text>
        </li>
        <li>
          <Text preset="paragraph">{t('kube_add_plan_helper_difference_nodes')}</Text>
        </li>
        <li>
          <Text preset="paragraph">{t('kube_add_plan_helper_difference_az')}</Text>
        </li>
      </ul>

      <Link
        className="visited:text-[var(--ods-color-primary-500)]"
        href={guide}
        onClick={handleOpenGuideLink}
        target="_blank"
      >
        {t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      </Link>
    </HelpDrawer>
  );
};
