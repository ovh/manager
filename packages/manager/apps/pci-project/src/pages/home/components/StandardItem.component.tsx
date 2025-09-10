import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';

import { DashboardTileItem } from '../DashboardTile.types';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

function StandardItem(item: DashboardTileItem) {
  const { t } = useTranslation('project');

  return (
    <div className="flex flex-col">
      {item.descriptionTranslationKey && (
        <OdsText preset="paragraph" className="text-sm">
          {t(item.descriptionTranslationKey)}
        </OdsText>
      )}
      {item.link && (
        <OdsLink
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          color={item.color as ODS_LINK_COLOR}
          label={t(item.linkLabelTranslationKey)}
          icon={item.iconODS}
          aria-label={`${t(item.linkLabelTranslationKey)} - ${t(
            'pci_projects_project_opens_in_new_tab',
          )}`}
        />
      )}
    </div>
  );
}

export default StandardItem;
