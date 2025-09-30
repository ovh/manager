import { ReactElement } from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';

export interface DashboardTabItem {
  name: string;
  title: string;
  badge?: ReactElement<typeof OdsBadge>;
  to: string;
  isRedirectLegacy: boolean;
}
