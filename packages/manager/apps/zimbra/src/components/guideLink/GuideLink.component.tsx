import React, { useContext, useMemo } from 'react';

import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Link, LinkType } from '@ovh-ux/muk';

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
    <Link
      type={LinkType.external}
      target="_blank"
      href={url}
      onClick={() => {
        trackClick({
          location: PageLocation.tile,
          buttonType: ButtonType.externalLink,
          actionType: 'navigation',
          actions: [GO_TO(guide.tracking)],
        });
      }}
    >
      {label}
    </Link>
  );
};

export default GuideLink;
