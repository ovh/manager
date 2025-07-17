import { useTranslation } from 'react-i18next';
import { OdsCard, OdsLink } from '@ovhcloud/ods-components/react';

export interface CommunityLink {
  term: string;
  href: string;
  description: string;
  trackingName: string;
}

export interface CommunitySectionProps {
  communityLinks: CommunityLink[];
  isUSRegion?: boolean;
}

export default function CommunitySection({
  communityLinks,
  isUSRegion = false,
}: CommunitySectionProps) {
  const { t } = useTranslation('home');

  // Hide community section for US region (like in AngularJS)
  if (isUSRegion) {
    return null;
  }

  return (
    <div className="col-sm-4 mb-4">
      <OdsCard className="h-100">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">{t('community')}</h3>
          <div className="space-y-4">
            {communityLinks.map((link, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-3 last:border-b-0"
              >
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {t(link.term)}
                  </div>
                  <div>
                    <OdsLink
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      aria-label={`${t(link.description)} - Opens in new tab`}
                    >
                      {t(link.description)}
                    </OdsLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </OdsCard>
    </div>
  );
}
