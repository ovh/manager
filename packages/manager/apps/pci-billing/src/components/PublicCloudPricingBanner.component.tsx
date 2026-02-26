import { useContext, useEffect, useRef, useState } from 'react';

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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const PRICING_URLS: Record<string, string> = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/',
  US: 'https://us.ovhcloud.com/public-cloud/prices/',
};

export default function PublicCloudPricingBanner() {
  const { t } = useTranslation('consumption');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const [isVisible, setIsVisible] = useState(true);
  const messageRef = useRef<HTMLOsdsMessageElement>(null);

  const pricingUrl =
    (ovhSubsidiary && PRICING_URLS[ovhSubsidiary]) || PRICING_URLS.DEFAULT;

  useEffect(() => {
    const el = messageRef.current;
    if (!el) return () => {};
    const onRemove = () => setIsVisible(false);
    el.addEventListener('odsRemove', onRemove);
    return () => el.removeEventListener('odsRemove', onRemove);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="my-6 w-full">
      <OsdsMessage
        ref={messageRef}
        color={ODS_THEME_COLOR_INTENT.info}
        icon={ODS_ICON_NAME.INFO}
        data-testid="public-cloud-pricing-banner"
      >
        <div className="flex flex-col gap-1">
          <OsdsText
            className="font-semibold"
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('cpbc_pricing_banner_title')}
          </OsdsText>
          <OsdsText color={ODS_THEME_COLOR_INTENT.primary}>
            {t('cpbc_pricing_banner_body')}
          </OsdsText>
          <OsdsLink
            href={pricingUrl}
            target={OdsHTMLAnchorElementTarget._blank}
            rel={OdsHTMLAnchorElementRel.noopener}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="block"
          >
            {t('cpbc_pricing_banner_link')}
          </OsdsLink>
        </div>
      </OsdsMessage>
    </div>
  );
}
