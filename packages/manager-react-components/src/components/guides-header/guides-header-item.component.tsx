import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Guide } from './interface';

interface GuidesHeaderItemProps {
  guide: Guide;
  href: string;
  label: string;
  tracking?: string;
  onClick?: (guide: Guide) => void;
}

export function GuidesHeaderItem({
  guide,
  href,
  label,
  onClick,
}: GuidesHeaderItemProps) {
  return (
    <div>
      <OdsLink
        href={href}
        target="_blank"
        icon={ODS_ICON_NAME.externalLink}
        onClick={() => {
          if (onClick) {
            onClick(guide);
          }
        }}
        label={label}
      />
    </div>
  );
}
