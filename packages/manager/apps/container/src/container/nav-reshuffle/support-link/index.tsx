import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { useSupport } from '@/hooks/support/useSupport';

export const SupportLink = () => {
  const { t } = useTranslation('navbar');
  const ticketLinkURL = useSupport();

  return (
    <a
      href={t(ticketLinkURL)}
      target={OdsHTMLAnchorElementTarget._blank}
      rel={OdsHTMLAnchorElementRel.noopener}
      data-testid="support-link"
    >
      <span className={`text-[var(--ods-color-primary-100)] hover:underline`}>
        {t('navbar_support')}
      </span>
    </a>
  );
};
