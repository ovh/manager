import React, { useContext, useMemo } from 'react';

import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';

import { IconLinkAlignmentType, LinkType, Links } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { Guide } from '@/guides.constants';
import { GO_TO } from '@/tracking.constants';

export interface GuideLinkProps {
  label: string;
  guide: Guide;
}

export const GuideLink = ({ label, guide }: Readonly<GuideLinkProps>) => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { trackClick } = useOvhTracking();

  const url = useMemo(() => {
    return guide.url?.[ovhSubsidiary] || guide.url.DEFAULT;
  }, [guide, ovhSubsidiary]);

  return (
    <Links
      type={LinkType.external}
      color={ODS_LINK_COLOR.primary}
      iconAlignment={IconLinkAlignmentType.right}
      target="_blank"
      href={url}
      label={label}
      onClickReturn={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.externalLink,
          actionType: 'navigation',
          actions: [GO_TO(guide.tracking)],
        });
      }}
    />
  );
};

export default GuideLink;
