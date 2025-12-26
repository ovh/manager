import { useContext, useEffect, useState } from 'react';
import { GuideMenuItem } from '@ovh-ux/muk';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type GuideLinks = Partial<{ [key in CountryCode | 'DEFAULT']: string }>;

const ENDPOINT = 'https://help.ovhcloud.com/csm/';

const getFirstStepUrl = (language: string, article: string) =>
  `${ENDPOINT}${language}-dedicated-servers-getting-started-dedicated-server?id=kb_article_view&sysparm_article=${article}`;

const firstStepEnIe = ['en-ie', 'KB0043476'] as const;
const firstStepFr = ['fr', 'KB0043481'] as const;

const FIRST_STEP_LINKS: GuideLinks = {
  FR: getFirstStepUrl(...firstStepFr),
  DE: getFirstStepUrl('de', 'KB0030498'),
  ES: getFirstStepUrl('es-es', 'KB0043480'),
  IE: getFirstStepUrl(...firstStepEnIe),
  IT: getFirstStepUrl('it', 'KB0043487'),
  NL: getFirstStepUrl(...firstStepEnIe),
  PL: getFirstStepUrl('pl', 'KB0043483'),
  PT: getFirstStepUrl('pt', 'KB0043484'),
  GB: getFirstStepUrl('en-gb', 'KB0043475'),
  CA: getFirstStepUrl('en-ca', 'KB0043473'),
  QC: getFirstStepUrl('fr-ca', 'KB0043482'),
  MA: getFirstStepUrl(...firstStepFr),
  SN: getFirstStepUrl(...firstStepFr),
  TN: getFirstStepUrl(...firstStepFr),
  AU: getFirstStepUrl('en-au', 'KB0043474'),
  IN: getFirstStepUrl('en-in', 'KB0067915'),
  SG: getFirstStepUrl('en-sg', 'KB0043478'),
  ASIA: getFirstStepUrl('asia', 'KB0043472'),
  WE: getFirstStepUrl(...firstStepEnIe),
  WS: getFirstStepUrl('es', 'KB0043479'),
  DEFAULT: getFirstStepUrl(...firstStepEnIe),
};

const getSecureUrl = (language: string, article: string) =>
  `${ENDPOINT}${language}-dedicated-servers-securing-server?id=kb_article_view&sysparm_article=${article}`;

const secureEnIe = ['en-ie', 'KB0043971'] as const;
const secureFr = ['fr', 'KB0043978'] as const;

const SECURE_LINKS: GuideLinks = {
  FR: getSecureUrl(...secureFr),
  DE: getSecureUrl('de', 'KB0043981'),
  ES: getSecureUrl('es-es', 'KB0043976'),
  IE: getSecureUrl(...secureEnIe),
  IT: getSecureUrl('it', 'KB0043982'),
  NL: getSecureUrl(...secureEnIe),
  PL: getSecureUrl('pl', 'KB0043983'),
  PT: getSecureUrl('pt', 'KB0043986'),
  GB: getSecureUrl('en-gb', 'KB0043969'),
  CA: getSecureUrl('en-ca', 'KB0043970'),
  QC: getSecureUrl('fr-ca', 'KB0043979'),
  MA: getSecureUrl(...secureFr),
  SN: getSecureUrl(...secureFr),
  TN: getSecureUrl(...secureFr),
  AU: getSecureUrl('en-au', 'KB0043972'),
  IN: getSecureUrl('en-in', 'KB0067991'),
  SG: getSecureUrl('en-sg', 'KB0043974'),
  ASIA: getSecureUrl('asia', 'KB0031024'),
  WE: getSecureUrl(...secureEnIe),
  WS: getSecureUrl(...secureEnIe),
  DEFAULT: getSecureUrl(...secureEnIe),
};

const getSSHConnectionsUrl = (language: string, article: string) =>
  `${ENDPOINT}${language}-dedicated-servers-ssh-introduction?id=kb_article_view&sysparm_article=${article}`;

const sshConnectionEnIe = ['en-ie', 'KB0044020'] as const;
const sshConnectionFr = ['fr', 'KB0044339'] as const;

const SSH_CONNECTIONS_LINKS: GuideLinks = {
  FR: getSSHConnectionsUrl(...sshConnectionFr),
  DE: getSSHConnectionsUrl('de', 'KB0044338'),
  ES: getSSHConnectionsUrl('es-es', 'KB0044025'),
  IE: getSSHConnectionsUrl(...sshConnectionEnIe),
  IT: getSSHConnectionsUrl('it', 'KB0044027'),
  NL: getSSHConnectionsUrl(...sshConnectionEnIe),
  PL: getSSHConnectionsUrl('pl', 'KB0044030'),
  PT: getSSHConnectionsUrl('pt', 'KB0044029'),
  GB: getSSHConnectionsUrl('en-gb', 'KB0044024'),
  CA: getSSHConnectionsUrl('en-ca', 'KB0044022'),
  QC: getSSHConnectionsUrl('fr-ca', 'KB0044023'),
  MA: getSSHConnectionsUrl(...sshConnectionFr),
  SN: getSSHConnectionsUrl(...sshConnectionFr),
  TN: getSSHConnectionsUrl(...sshConnectionFr),
  AU: getSSHConnectionsUrl('en-au', 'KB0044019'),
  IN: getSSHConnectionsUrl('en-in', 'KB0068003'),
  SG: getSSHConnectionsUrl('en-sg', 'KB0044327'),
  ASIA: getSSHConnectionsUrl('asia', 'KB0031077'),
  WE: getSSHConnectionsUrl(...sshConnectionEnIe),
  WS: getSSHConnectionsUrl('es', 'KB0044028'),
  DEFAULT: getSSHConnectionsUrl(...sshConnectionEnIe),
};

const guidesList = [
  {
    label: 'guide_first_step_label',
    links: FIRST_STEP_LINKS,
  },
  {
    label: 'guide_secure_label',
    links: SECURE_LINKS,
  },
  {
    label: 'guide_ssh_connections_label',
    links: SSH_CONNECTIONS_LINKS,
  },
];

export default function useGuides(translate: (key: string) => string) {
  const [guides, setGuides] = useState<GuideMenuItem[]>([]);
  const {
    shell: { environment },
  } = useContext(ShellContext);

  useEffect(() => {
    (async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();

      setGuides(
        guidesList.map(({ label, links }, id) => ({
          id,
          children: translate(label),
          href: links[ovhSubsidiary as CountryCode] || links.DEFAULT,
          target: '_blank',
        })),
      );
    })();
  }, []);

  return guides;
}
