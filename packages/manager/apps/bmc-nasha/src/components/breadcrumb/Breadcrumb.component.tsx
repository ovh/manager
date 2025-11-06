import React from 'react';

import { Breadcrumb as MUKBreadcrumb } from '@ovh-ux/muk';

import { AppConfig, appName } from '@/App.constants';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';

function Breadcrumb({ customRootLabel }: BreadcrumbProps): React.JSX.Element {
  const rootLabel = customRootLabel || AppConfig.rootLabel;

  return <MUKBreadcrumb appName={appName} rootLabel={rootLabel} />;
}

export default Breadcrumb;
