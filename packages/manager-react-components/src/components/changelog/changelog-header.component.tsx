import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { ChangelogHeaderItem } from './changelog-header-item.component';
import { Changelog } from './interface';

export interface ChangelogHeaderProps {
  label: string;
  changelogs: Changelog[];
}

export function ChangelogHeader({ label, changelogs }: ChangelogHeaderProps) {
  return (
    <>
      <div id="changelog-header-trigger">
        <OdsButton
          slot={'menu-title'}
          variant={ODS_BUTTON_VARIANT.ghost}
          label={label}
        />
      </div>
      <OdsPopover triggerId="changelog-header-trigger">
        {changelogs.map((changelog) => (
          <ChangelogHeaderItem
            key={changelog.key}
            href={changelog.url}
            label={changelog.label}
            tracking={changelog.tracking}
          />
        ))}
      </OdsPopover>
    </>
  );
}
