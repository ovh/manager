import React from 'react';

import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type Props = {
  onClick?(): void;
  targetURL: string;
};

function NavbarBrand({ onClick = () => {}, targetURL }: Props): JSX.Element {
  return (
    <a
      className="oui-navbar__brand"
      href={targetURL}
      aria-label="OVHcloud"
      onClick={onClick}
    >
      <OsdsIcon
        aria-hidden="true"
        name={ODS_ICON_NAME.OVH}
        size={ODS_ICON_SIZE.lg}
        color={ODS_THEME_COLOR_INTENT.primary}
      ></OsdsIcon>
    </a>
  );
}

export default NavbarBrand;
