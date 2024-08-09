import React from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://help.ovhcloud.com/csm/';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DEFAULT:
      'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    FR: 'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    GB: 'en-ie-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063133',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    list[key[0]] = docUrl + GUIDE_LIST[key[0]][subsidiary || 'DEFAULT'];
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

export function useGuideUtils() {
  const { environment } = React.useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const [guideList, setGuideList] = React.useState<GuideLinkProps>({});

  React.useEffect(() => {
    setGuideList(
      getGuideListLink({ subsidiary: ovhSubsidiary as CountryCode }),
    );
  }, [ovhSubsidiary]);

  return guideList;
}

export default useGuideUtils;
