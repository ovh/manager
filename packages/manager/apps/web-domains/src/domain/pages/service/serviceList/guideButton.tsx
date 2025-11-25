import { GuideButton, GuideItem } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useMemo } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DOMAINS_GUIDES } from '../../onboarding/onboarding.constants';

export default function DomainGuideButton() {
  const { t } = useTranslation(NAMESPACES.DASHBOARD);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const tileList: GuideItem[] = [
    {
      id: 1,
      label: t(`${NAMESPACES.DASHBOARD}:general_information`),
      href: useMemo(() => {
        return DOMAINS_GUIDES[ovhSubsidiary] || DOMAINS_GUIDES.DEFAULT;
      }, [ovhSubsidiary]),
    },
  ];

  return <GuideButton items={tileList} />;
}
