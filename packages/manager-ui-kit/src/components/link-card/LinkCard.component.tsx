import { JSX } from 'react';

import { useTranslation } from 'react-i18next';

import { CARD_COLOR, Card, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Badge } from '@/components/badge/Badge.component';
import type { LinkCardBadge, LinkCardProps } from '@/components/link-card/LinkCard.props';
import { Link } from '@/components/link/Link.component';
import { LinkType } from '@/components/link/Link.props';

import './translations/translations';

export function LinkCard({
  href,
  externalHref,
  hrefLabel,
  img,
  badges,
  texts,
  onClick,
  trackingLabel,
  ...props
}: LinkCardProps): JSX.Element {
  const { t } = useTranslation('card');
  const { title, description, category } = texts;

  const hasBadges = Array.isArray(badges) && badges.length > 0;

  return (
    <a
      href={href}
      target={externalHref ? '_blank' : undefined}
      rel={externalHref ? 'noreferrer' : undefined}
      className="no-underline"
      onClick={onClick}
      {...props}
    >
      <Card
        className="w-full h-full p-[1rem]"
        color={CARD_COLOR.neutral}
        data-tracking={trackingLabel}
      >
        <div className="flex flex-col h-full">
          {img?.src && (
            <img className="max-w-full my-3 mx-auto" src={img.src} alt={img.alt ?? ''} />
          )}

          <div className="flex flex-row leading-[28px]">
            <Text preset={TEXT_PRESET.heading4} className="text-(--ods-color-primary-500)">
              {category}
            </Text>

            {hasBadges && (
              <span className="ml-[10px]">
                {badges.map((badge: LinkCardBadge) => (
                  <Badge className="mr-1" key={badge.text}>
                    {badge.text}
                  </Badge>
                ))}
              </span>
            )}
          </div>

          <Text preset={TEXT_PRESET.heading3} className="mb-[8px]">
            {title}
          </Text>

          {description && (
            <Text preset={TEXT_PRESET.paragraph} className="m-0 p-0 mb-4">
              {description}
            </Text>
          )}

          <div className="mt-auto">
            <Link tab-index="-1" type={externalHref ? LinkType.external : LinkType.next}>
              {hrefLabel ?? t('see_more_label')}
            </Link>
          </div>
        </div>
      </Card>
    </a>
  );
}

LinkCard.displayName = 'LinkCard';
