import { GuideButton, GuideItem } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useLinks } from '@/domain/constants/guideLinks';

export default function DomainGuideButton() {
  const { t } = useTranslation(NAMESPACES.DASHBOARD);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideUrls = useLinks(ovhSubsidiary);

  const tileList: GuideItem[] = [
    {
      id: 1,
      label: t(`${NAMESPACES.DASHBOARD}:general_information`),
      href: guideUrls.DOMAINS_LINK,
    },
  ];

  return <GuideButton items={tileList} />;
}
