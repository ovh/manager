import { useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { GUIDE_LIST, SUPPORT_URL } from './guidesLinks.constant';
import { useShellContext } from '@/common/hooks/useShellContext';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    const guide =
      GUIDE_LIST[key[0]][subsidiary as CountryCode] || GUIDE_LIST[key[0]].GB;

    const helpCenterUrl = SUPPORT_URL[subsidiary] ?? SUPPORT_URL.EU;
    list[key[0]] = `${helpCenterUrl}${guide}`;
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils() {
  const { environment } = useShellContext().shell;
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
