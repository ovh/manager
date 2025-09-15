import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { OdsBadge, OdsText } from '@ovhcloud/ods-components/react';
import { Drawer, Links, LinkType } from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

type THelpDrawerItem = {
  titleKey: string;
  descriptionKey: string;
  learnMoreLink?: string;
  hasApiInfo?: boolean;
  comingSoonKey?: string;
};

type TStorageMode = 'swift' | 'local-zone' | 's3-standard';

type THelpDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  storageMode?: TStorageMode;
};

const allHelperItems: Record<string, THelpDrawerItem> = {
  localisation: {
    titleKey: 'pci_projects_project_storages_dashboard_container_localisation',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_localisation_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047384',
  },
  objectsNumber: {
    titleKey:
      'pci_projects_project_storages_dashboard_container_objects_number',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_objects_number_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-faq?id=kb_article_view&sysparm_article=KB0059678',
  },
  usedSpace: {
    titleKey: 'pci_projects_project_storages_dashboard_container_used_space',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_used_space_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-faq?id=kb_article_view&sysparm_article=KB0059678',
  },
  endpoint: {
    titleKey: 'pci_projects_project_storages_dashboard_container_Endpoint',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_endpoint_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-location?id=kb_article_view&sysparm_article=KB0047384',
  },
  cnameTxtValue: {
    titleKey: 'pci_projects_project_storages_dashboard_cname',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_cname_txt_description',
  },
  virtualHostedStyle: {
    titleKey:
      'pci_projects_project_storages_dashboard_container_virtual_hosted_style',
    descriptionKey:
      'pci_projects_project_storages_dashboard_container_virtual_hosted_style_description',
  },
  objectLock: {
    titleKey: 'pci_projects_project_storages_dashboard_object_lock',
    descriptionKey:
      'pci_projects_project_storages_dashboard_object_lock_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-managing-object-lock?id=kb_article_view&sysparm_article=KB0047399',
  },
  versioning: {
    titleKey: 'pci_projects_project_storages_dashboard_versioning',
    descriptionKey:
      'pci_projects_project_storages_dashboard_versioning_description',
    learnMoreLink:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-versioning?id=kb_article_view&sysparm_article=KB0063856',
  },
  tags: {
    titleKey: 'pci_projects_project_storages_dashboard_tags',
    descriptionKey: 'pci_projects_project_storages_dashboard_tags_description',
    hasApiInfo: true,
  },
  accessLogs: {
    titleKey: 'pci_projects_project_storages_dashboard_access_log',
    descriptionKey:
      'pci_projects_project_storages_dashboard_access_log_description',
    hasApiInfo: true,
    learnMoreLink:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-server-access-logging?id=kb_article_view&sysparm_article=KB0056623',
  },
  staticWebsite: {
    titleKey: 'pci_projects_project_storages_dashboard_hosting_static_website',
    descriptionKey:
      'pci_projects_project_storages_dashboard_hosting_static_website_description',
    hasApiInfo: true,
    learnMoreLink:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-static-website?id=kb_article_view&sysparm_article=KB0058095',
  },
};

export const HelpDrawer = ({
  isOpen,
  onClose,
  storageMode = 's3-standard',
}: THelpDrawerProps) => {
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);

  useBodyScrollLock(isOpen);

  const getFilteredHelperItems = (): THelpDrawerItem[] => {
    switch (storageMode) {
      case 'swift':
        return [
          allHelperItems.localisation,
          allHelperItems.endpoint,
          allHelperItems.cnameTxtValue,
        ];

      case 'local-zone':
        return [
          allHelperItems.localisation,
          allHelperItems.objectsNumber,
          allHelperItems.usedSpace,
          allHelperItems.endpoint,
          allHelperItems.virtualHostedStyle,
        ];

      case 's3-standard':
      default:
        // 1AZ/3AZ: Return all items except CNAME/TXT Value
        return Object.values(allHelperItems).filter(
          (item) => item.titleKey !== allHelperItems.cnameTxtValue.titleKey,
        );
    }
  };

  const helperItems = getFilteredHelperItems();

  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onDismiss={onClose}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:close`)}
      onSecondaryButtonClick={onClose}
      heading={t('pci_projects_project_storages_dashboard_helper_drawer_title')}
    >
      <div className="space-y-4">
        {helperItems.map((item) => (
          <div key={item.titleKey} className="border rounded-md">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <OdsText preset="heading-5">{t(item.titleKey)}</OdsText>
                <div className="group relative inline-block">
                  {item.hasApiInfo && (
                    <div className="space-y-2">
                      <OdsBadge
                        label={t(
                          'pci_projects_project_storages_dashboard_object_available_on_api',
                        )}
                        color="neutral"
                      />
                      {item.comingSoonKey && (
                        <OdsText
                          preset="span"
                          className="text-sm text-gray-600 block"
                        >
                          {t(item.comingSoonKey)}
                        </OdsText>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <Trans
                    i18nKey={`dashboard:${item.descriptionKey}_with_link`}
                    components={{
                      1: item.learnMoreLink ? (
                        <Links
                          href={item.learnMoreLink}
                          target="_blank"
                          type={LinkType.external}
                        />
                      ) : (
                        <span />
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};
