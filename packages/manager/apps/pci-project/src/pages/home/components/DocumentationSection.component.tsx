import { useTranslation } from 'react-i18next';
import { OdsCard, OdsLink, OdsText } from '@ovhcloud/ods-components/react';

export interface DocumentationLink {
  term: string;
  href: string;
  description: string;
  trackingName: string;
}

export interface DocumentationSectionProps {
  links: DocumentationLink[];
}

export default function DocumentationSection({
  links,
}: DocumentationSectionProps) {
  const { t } = useTranslation('home');

  return (
    <div className="col-sm-4 mb-4">
      <OdsCard className="h-100">
        <div className="p-4">
          <OdsText preset="heading-4" className="mb-4">
            {t('documentation')}
          </OdsText>
          <div className="space-y-4">
            {links.map((link, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-3 last:border-b-0"
              >
                <div className="flex flex-col">
                  <OdsText preset="caption" className="mb-1">
                    {t(link.term)}
                  </OdsText>
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
