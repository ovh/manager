import { useMemo } from 'react';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

type BottomSection = {
  title: string;
  type: 'billing' | 'documentation' | 'community';
  items: BottomSectionItem[];
};

type BottomSectionItem = {
  label: string;
  description?: string;
  link: string;
  price?: string;
  validUntil?: string;
  isVoucherLink?: boolean;
};

export default function DashboardTiles({ projectId }: { projectId: string }) {
  const { t } = useTranslation(['home']);
  const bottomSections: BottomSection[] = useMemo(
    () => [
      {
        title: t('billing_section'),
        type: 'billing',
        items: [
          {
            label: t('promo_code_1'),
            description: t('free_test'),
            price: '0,00€',
            validUntil: t('valid_until', { date: '23 février 2025' }),
            link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
          },
          {
            label: t('promo_code_2'),
            description: t('free_test'),
            price: '0,00€',
            validUntil: t('valid_until', { date: '23 février 2025' }),
            link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
          },
          {
            label: t('promo_code_3'),
            description: t('free_test'),
            price: '0,00€',
            validUntil: t('valid_until', { date: '23 février 2025' }),
            link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
          },
        ],
      },
      {
        title: t('documentation_section'),
        type: 'documentation',
        items: [
          {
            label: t('getting_started'),
            description: t('essential_to_start'),
            link:
              'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
          },
          {
            label: t('public_cloud'),
            description: t('get_familiar'),
            link: 'https://docs.ovh.com/ca/fr/public-cloud/',
          },
          {
            label: t('instances'),
            description: t('manage_instances'),
            link:
              'https://docs.ovh.com/ca/fr/public-cloud/creer-instance-espace-client/',
          },
          {
            label: t('billing'),
            description: t('understand_manage'),
            link:
              'https://docs.ovh.com/ca/fr/public-cloud/comprendre-facturation-cloud/',
          },
          {
            label: t('guides'),
            description: t('see_all_guides'),
            link: 'https://docs.ovh.com/ca/fr/public-cloud/',
          },
        ],
      },
      {
        title: t('community_section'),
        type: 'community',
        items: [
          {
            label: t('roadmap'),
            description: t('discover_participate'),
            link: 'https://github.com/ovh/public-cloud-roadmap',
          },
          {
            label: t('developer_center'),
            description: t('start_with_products'),
            link: 'https://developer.ovh.com/',
          },
          {
            label: t('community'),
            description: t('discuss_discord'),
            link: 'https://discord.gg/ovhcloud',
          },
          {
            label: t('community_alt'),
            description: t('discuss_community'),
            link: 'https://community.ovh.com/',
          },
        ],
      },
    ],
    [projectId, t],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {bottomSections.map((section, sectionIdx) => {
        const items = [...section.items];
        if (section.type === 'billing') {
          items.push({
            label: t('credits_vouchers'),
            link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
            description: '',
            isVoucherLink: true,
          });
        }
        return (
          <div key={sectionIdx} className="space-y-4 flex flex-col h-full">
            <div className="flex flex-col min-h-[400px] h-full">
              <DashboardTile
                title={section.title}
                items={items.map((item, itemIdx) => ({
                  id: `${sectionIdx}-${itemIdx}`,
                  value: (
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-base mb-1">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs text-gray-500 mb-1">
                              {item.description}
                            </div>
                          )}
                          {item.validUntil && (
                            <div className="text-xs text-gray-400">
                              {item.validUntil}
                            </div>
                          )}
                        </div>
                        {item.price && (
                          <div className="font-bold text-primary-600 text-lg ml-2">
                            {item.price}
                          </div>
                        )}
                      </div>
                      {item.isVoucherLink && (
                        <a
                          href={item.link}
                          className="text-primary-600 font-semibold text-sm hover:underline inline-block mt-4"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.label} →
                        </a>
                      )}
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
