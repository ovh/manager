import { LinkType, Links } from '@ovh-ux/manager-react-components';
import React from 'react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useSavingsPlanContract } from '@/hooks/useSavingsPlan';

const LegalLinks = () => {
  const { data = [] } = useSavingsPlanContract();

  return (
    <>
      {data.map((link) => (
        <Links
          label={link.name}
          href={link.url}
          type={LinkType.external}
          target={OdsHTMLAnchorElementTarget._blank}
        />
      ))}
    </>
  );
};

export default LegalLinks;
