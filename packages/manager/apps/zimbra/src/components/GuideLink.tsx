import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import React, { useContext } from 'react';
import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { Guide } from '@/guides.constants';

interface GuideLinkProps {
  label: string;
  guide: Guide;
}

export default function GuideLink({ label, guide }: Readonly<GuideLinkProps>) {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  return (
    <Links
      type={LinkType.external}
      target={OdsHTMLAnchorElementTarget._blank}
      href={
        typeof guide.url === 'string'
          ? guide.url
          : guide.url?.[ovhSubsidiary] || guide.url.DEFAULT
      }
      label={label}
    />
  );
}
