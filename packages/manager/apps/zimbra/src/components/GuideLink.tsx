import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useContext } from 'react';
import {
  IconLinkAlignmentType,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
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
      color={ODS_LINK_COLOR.primary}
      iconAlignment={IconLinkAlignmentType.right}
      target="_blank"
      href={
        typeof guide.url === 'string'
          ? guide.url
          : guide.url?.[ovhSubsidiary] || guide.url.DEFAULT
      }
      label={label}
    />
  );
}
