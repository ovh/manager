import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://help.ovhcloud.com/csm/';

type GuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  discover: {
    DE:
      '/de-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045728',
    ES:
      '/es-es-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045741',
    IE:
      '/en-ie-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0032943',
    IT:
      '/it-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045743',
    PL:
      '/pl-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045745',
    PT:
      '/pt-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045833',
    FR:
      '/fr-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045740',
    GB:
      '/en-gb-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045834',
    CA:
      '/en-ca-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045744',
    QC:
      '/fr-ca-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045738',
    WE:
      '/en-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045739',
    WS:
      '/es-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045742',
  },
  vsphere_access: {
    DE:
      '/de-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0033694',
    ES:
      '/es-es-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046439',
    IE:
      '/en-ie-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046429',
    IT:
      '/it-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046449',
    PL:
      '/pl-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046441',
    PT:
      '/pt-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046446',
    FR:
      '/fr-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046435',
    GB:
      '/en-gb-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046440',
    CA:
      '/en-ca-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046438',
    QC:
      '/fr-ca-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046447',
    WE:
      '/en-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046431',
    WS:
      '/es-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046445',
  },
  veeam_backup: {
    DE:
      '/de-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064987',
    ES:
      '/es-es-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065001',
    IE:
      '/en-ie-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046154',
    IT:
      '/it-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065003',
    PL:
      '/pl-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064998',
    PT:
      '/pt-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065002',
    FR:
      '/fr-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046156',
    GB:
      '/en-gb-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046150',
    CA:
      '/en-ca-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046148',
    QC:
      '/fr-ca-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046159',
    WE:
      '/en-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046155',
    WS:
      '/es-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064999',
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
