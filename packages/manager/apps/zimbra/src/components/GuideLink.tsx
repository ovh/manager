import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import React, { useContext, useMemo } from 'react';
import {
  IconLinkAlignmentType,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { Guide } from '@/guides.constants';
import { GO_TO } from '@/tracking.constant';

interface GuideLinkProps {
  label: string;
  guide: Guide;
}

export default function GuideLink({ label, guide }: Readonly<GuideLinkProps>) {
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
}
