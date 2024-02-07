import { OsdsClipboard } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export default function Key({ publicKey }: { publicKey: string }) {
  return (
    <OsdsClipboard
      value={publicKey}
      color={ODS_THEME_COLOR_INTENT.primary}
      className={'mr-8'}
    >
      <span slot={'success-message'}>Success</span>
      <span slot={'error-message'}>Error</span>
    </OsdsClipboard>
  );
}
