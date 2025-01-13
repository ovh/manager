import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

interface ChangelogHeaderItemProps {
  href: string;
  label: string;
  tracking?: string;
}

export function ChangelogHeaderItem({
  href,
  label,
  tracking,
}: ChangelogHeaderItemProps) {
  const { trackClick } = useTracking();

  return (
    <div>
      <OdsLink
        href={href}
        target="_blank"
        icon={ODS_ICON_NAME.externalLink}
        label={label}
        onClick={() => {
          if (tracking)
            trackClick({
              name: tracking,
              type: 'action',
            });
        }}
      />
    </div>
  );
}
