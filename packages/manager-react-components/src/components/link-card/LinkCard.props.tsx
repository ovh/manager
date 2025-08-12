import { MouseEvent } from 'react';

export type LinkCardBadge = {
  text: string;
};

type LinkCardImageDetails = {
  src?: string;
  alt?: string;
};

export type LinkCardProps = {
  href: string;
  externalHref?: boolean;
  hrefLabel?: string;
  img?: LinkCardImageDetails;
  texts: {
    title: string;
    description?: string;
    category: string;
  };
  badges?: LinkCardBadge[];
  hoverable?: boolean;
  onClick?: (event: MouseEvent) => void;
  trackingLabel?: string;
};
