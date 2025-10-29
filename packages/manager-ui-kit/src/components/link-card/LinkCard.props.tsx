import type { AnchorHTMLAttributes, MouseEvent } from 'react';

export type LinkCardBadge = Readonly<{
  text: string;
}>;

export type LinkCardImageDetails = Readonly<{
  src?: string | null;
  alt?: string | null;
}>;

export type LinkCardProps = Readonly<{
  href: string;
  externalHref?: boolean;
  hrefLabel?: string;
  img?: LinkCardImageDetails | null;
  texts: {
    title: string;
    description?: string | null;
    category: string;
  };
  badges?: LinkCardBadge[] | null;
  hoverable?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  trackingLabel?: string;
}> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>;
