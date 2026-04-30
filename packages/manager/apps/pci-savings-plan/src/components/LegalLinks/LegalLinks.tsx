import { Links, LinkType } from '@ovh-ux/manager-react-components';
import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useSavingsPlanContract } from '@/hooks/useSavingsPlan';
import { US_LEGAL_LINKS } from '@/constants';

type TLegalLinksProps = {
  className?: string;
};

type TLegalLink = {
  name: string;
  url: string;
};

const LegalLinks: React.FC<TLegalLinksProps> = ({ className = '' }) => {
  const isUsRegion =
    useContext(ShellContext).environment?.getRegion?.() === 'US';
  const { data = [] } = useSavingsPlanContract();

  const links: TLegalLink[] = isUsRegion
    ? Object.entries(US_LEGAL_LINKS).map(([name, url]) => ({ name, url }))
    : data.map(({ name, url }) => ({ name, url }));

  return (
    <>
      {links.map((link) => (
        <Links
          className={className}
          data-testid={link.name}
          key={link.name}
          label={link.name}
          href={link.url}
          type={LinkType.external}
          target="_blank"
        />
      ))}
    </>
  );
};

export default LegalLinks;
