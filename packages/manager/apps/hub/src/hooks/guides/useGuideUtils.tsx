import { useContext, useEffect, useState } from 'react';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function useGuideUtils(guides: Record<string, Partial<Record<CountryCode, string>>>) {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState({});

  const getGuideListLink = ({ subsidiary }: GetGuideLinkProps) => {
    const keys = Object.keys(guides);
    return keys.reduce<Record<string, string>>(
      (links, key: string) => ({
        ...links,
        [key]: guides[key][subsidiary as CountryCode] ?? guides[key][CountryCode.GB],
      }),
      {} as Record<string, string>,
    );
  };

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({ subsidiary: ovhSubsidiary });
      setList(guideList);
    };
    getSubSidiary();
  }, []);
  return list as Record<string, string>;
}

export default useGuideUtils;
