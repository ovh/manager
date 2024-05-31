import { useState, useEffect, useContext } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://docs.ovh.com/';

type GuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DE: '/update-path',
    ES: '/update-path',
    IE: '/en/update-path',
    IT: '/update-path',
    PL: '/update-path',
    PT: '/update-path',
    FR: '/update-path',
    GB: '/update-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  guideLink2: {
    DE: '/guide-link-2-path',
    ES: '/guide-link-2-path',
    IE: '/en/guide-link-2-path',
    IT: '/guide-link-2-path',
    PL: '/guide-link-2-path',
    PT: '/guide-link-2-path',
    FR: '/guide-link-2-path',
    GB: '/guide-link-2-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  guideLink3: {
    DE: '/guide-link-3-path',
    ES: '/guide-link-3-path',
    IE: '/en/guide-link-3-path',
    IT: '/guide-link-3-path',
    PL: '/guide-link-3-path',
    PT: '/guide-link-3-path',
    FR: '/guide-link-3-path',
    GB: '/guide-link-3-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  /*
  addNewGuideLink : {
    DEFAULT: '/guide-link-3-path',
    DE: '/guide-link-3-path',
    ES: '/guide-link-3-path',
    ...
  }
  */
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode;
};

function getGuideListLink({
  subsidiary,
}: GetGuideLinkProps): { [guideName: string]: string } {
  return Object.entries(GUIDE_LIST).reduce(
    (list, [key, value]) => ({
      ...list,
      [key]: value[subsidiary],
    }),
    {},
  );
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils() {
  const { environment } = useContext(ShellContext);
  const subsidiary = environment.getUser().ovhSubsidiary as CountryCode;
  const [linkTabs, setLinkTabs] = useState<GuideLinkProps>({});

  useEffect(() => {
    setLinkTabs(getGuideListLink({ subsidiary }));
  }, [subsidiary]);

  return linkTabs;
}

export default useGuideUtils;
