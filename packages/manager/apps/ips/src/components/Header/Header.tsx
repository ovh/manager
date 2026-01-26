import { ChangelogMenu, GuideMenu, GuideMenuItem } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { CHANGELOG_LINKS, useGuideUtils } from '@/utils';

export type Header = {
  title?: React.ReactNode | null;
  guideMenu?: React.ReactElement | null;
  changelogButton?: React.ReactElement | null;
};

export const useHeader = (title: string): Header => {
  const { guides } = useGuideUtils();
  const { trackClick } = useOvhTracking();

  const guideItems: GuideMenuItem[] = guides.map((guide, index) => ({
    id: index,
    href: guide.href,
    target: '_blank',
    children: guide.texts.title,
    onClick: () => {
      trackClick({
        buttonType: ButtonType.externalLink,
        actionType: 'action',
        location: PageLocation.tile,
        actions: [`go-to_${guide.trackingLabel}`],
      });
    },
  }));

  return {
    title,
    changelogButton: (
      <ChangelogMenu chapters={['network::ip::ip']} links={CHANGELOG_LINKS} />
    ),
    guideMenu: <GuideMenu items={guideItems} />,
  };
};
