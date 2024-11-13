import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://docs.ovh.com';

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
  /*
  addNewGuideLink : {
    DEFAULT: '/guide-link-3-path',
    DE: '/guide-link-3-path',
    ES: '/guide-link-3-path',
    ...
  }
  */
};

const TUTO_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  tutoLink1: {
    DE: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    ES: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    IE: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    IT: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    PL: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    PT: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    FR: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    GB: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    CA: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    QC: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    WE: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    WS: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
    US: 'https://blog.ovhcloud.com/tag/ai-endpoints/',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    list[key[0]] = docUrl + GUIDE_LIST[key[0]][subsidiary as CountryCode];
  });

  const tutos = Object.entries(TUTO_LIST);
  tutos.forEach((key) => {
    list[key[0]] = TUTO_LIST[key[0]][subsidiary as CountryCode];
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils() {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState({});

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({ subsidiary: ovhSubsidiary });
      setList(guideList);
    };
    getSubSidiary();
  }, []);
  return list as GuideLinkProps;
}

export default useGuideUtils;
