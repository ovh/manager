import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://help.ovhcloud.com';

type GuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DE:
      '/csm/de-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065406',
    ES:
      '/csm/es--public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065402',
    IE:
      '/csm/en-ie-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065398',
    IT:
      '/csm/it-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065399',
    PL:
      '/csm/pl-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065419',
    PT:
      '/csm/pt-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065400',
    FR:
      '/csm/fr-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065411',
    GB:
      '/csm/en-gb-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065401',
    CA:
      '/csm/en-ca-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065397',
    QC:
      '/csm/fr-ca-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065405',
    WE:
      '/csm/en-ca-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065397',
    WS:
      '/csm/en-ca-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065397',
    US:
      '/csm/en-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065403',
  },
  guideLink2: {
    DE:
      '/csm/de-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065404',
    ES:
      '/csm/es-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065425',
    IE:
      '/csm/en-ie-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065412',
    IT:
      '/csm/it-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065422',
    PL:
      '/csm/pl-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065423',
    PT:
      '/csm/pt-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065426',
    FR:
      '/csm/fr-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065424',
    GB:
      '/csm/en-gb-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065417',
    CA:
      '/csm/en-ca-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065420',
    QC:
      '/csm/fr-ca-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065416',
    WE:
      '/csm/en-ca-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065420',
    WS:
      '/csm/en-ca-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065420',
    US:
      '/csm/en-public-cloud-ai-endpoints-capabilities?id=kb_article_view&sysparm_article=KB0065421',
  },
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
