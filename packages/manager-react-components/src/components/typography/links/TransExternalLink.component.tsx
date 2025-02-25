import React, { PropsWithChildren } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Links, { LinksProps, LinkType } from './links.component';

export type TTransExternalLinkProps = {
  onClickReturn?: () => void;
  href: string;
  i18nNamespace: string;
  i18nKey: string;
};

const ExternalLink: React.FC<LinksProps & PropsWithChildren> = ({
  children,
  href,
  onClickReturn,
}) => (
  <Links
    type={LinkType.external}
    target="_blank"
    href={href}
    label={children as string}
    data-testid="trans-external-link"
    onClickReturn={onClickReturn}
  />
);

export const TransExternalLink: React.FC<TTransExternalLinkProps> = ({
  href,
  i18nNamespace,
  i18nKey,
  onClickReturn,
}) => {
  const { t } = useTranslation(i18nNamespace);

  return (
    <Trans
      t={t}
      i18nKey={i18nKey}
      components={{
        ExternalLink: (
          <ExternalLink href={href} onClickReturn={onClickReturn} />
        ),
      }}
    />
  );
};
