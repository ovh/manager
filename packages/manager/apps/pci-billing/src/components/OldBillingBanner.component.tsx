import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OsdsLink,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';

export const OldBillingBanner = () => {
  const { t } = useTranslation('consumption');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [payAsYouGoUrl, setPayAsYouGoUrl] = useState('');

  useEffect(() => {
    navigation
      .getURL('billing', '/history', {})
      .then((data) => setPayAsYouGoUrl(data as string));
  }, [navigation]);

  return (
    <div className="my-6 w-full">
      <OsdsMessage
        color={ODS_THEME_COLOR_INTENT.info}
        icon={ODS_ICON_NAME.INFO}
        data-testid="public-cloud-pricing-banner"
      >
        <div className="flex flex-col gap-1">
          <OsdsText
            className="font-semibold"
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('cpbc_pricing_banner_old_billing_title')}
          </OsdsText>
          <OsdsText color={ODS_THEME_COLOR_INTENT.primary}>
            {t('cpbc_pricing_banner_old_billing_body')}
          </OsdsText>
          <OsdsLink
            href={payAsYouGoUrl}
            target={OdsHTMLAnchorElementTarget._blank}
            rel={OdsHTMLAnchorElementRel.noopener}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="block"
          >
            {t('cpbc_pricing_banner_old_billing_link')}
          </OsdsLink>
        </div>
      </OsdsMessage>
    </div>
  );
};
