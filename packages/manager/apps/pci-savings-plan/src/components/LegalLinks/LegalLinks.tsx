import { Links, LinkType } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useSavingsPlanContract } from '@/hooks/useSavingsPlan';

type TLegalLinksProps = {
  className?: string;
};

const LegalLinks: React.FC<TLegalLinksProps> = ({ className = '' }) => {
  const { data = [] } = useSavingsPlanContract();

  return (
    <>
      {data.map((link) => (
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
