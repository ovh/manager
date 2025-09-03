import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

const docUrl = 'https://docs.ovh.com';

type GuideLinks = { [key in OvhSubsidiary]: string };

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
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    list[key[0]] = docUrl + GUIDE_LIST[key[0]][subsidiary as OvhSubsidiary];
  });
  return list;
}

function useGuideUtils() {
  const { ovhSubsidiary } = useContext(ShellContext).environment?.getUser() || {};
  const [list, setList] = useState({});

  useEffect(() => {
    const guideList = getGuideListLink({ subsidiary: ovhSubsidiary || '' });
    setList(guideList);
  }, [ovhSubsidiary]);

  return list;
}

export default useGuideUtils;
