import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { GUIDE_LIST, SUPPORT_URL } from './guidesLinks.constants';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
  baseUrl?: Record<string, string>;
};

function getGuideListLink({ subsidiary, baseUrl }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    const guide =
      GUIDE_LIST[key[0]][subsidiary as CountryCode] || GUIDE_LIST[key[0]].GB;

    const url = baseUrl[subsidiary] ?? baseUrl.EU;
    list[key[0]] = `${url}${guide}`;
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils(baseUrl = SUPPORT_URL) {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState({});

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({
        subsidiary: ovhSubsidiary,
        baseUrl,
      });
      setList(guideList);
    };
    getSubSidiary();
  }, []);
  return list as GuideLinkProps;
}

export default useGuideUtils;
