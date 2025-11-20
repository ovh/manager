import { OsdsIcon, OsdsLink, OsdsMenuItem, OsdsButton, OsdsMenuGroup } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
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
    <OsdsMenuGroup> 
    <OsdsMenuItem>
    <div className='flex items-center'>
  
      <OsdsLink

        href={href}
        color={ODS_THEME_COLOR_INTENT.primary}
        target={OdsHTMLAnchorElementTarget._blank}
        onClick={() => {
          if (onClick) {
            onClick(guide);
          }
        }}
      >
        {label}
        
        <span slot='end'>
      <OsdsIcon className= 'ml-4' size={ODS_ICON_SIZE.xs} name={ODS_ICON_NAME.EXTERNAL_LINK} color={ODS_THEME_COLOR_INTENT.primary} />      
      </span>
    </OsdsLink>

    </div>
    </OsdsMenuItem>
    </OsdsMenuGroup>
  );
}
