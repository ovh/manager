import { memo } from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { ODS_LINK_COLOR, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { BottomSectionItem } from './useDashboardSections.hook';

type OdsHTMLAnchorElementTarget = '_blank' | '_self' | '_parent' | '_top';
type OdsHTMLAnchorElementRel =
  | 'noopener'
  | 'noreferrer'
  | 'noopener noreferrer';

interface StandardItemProps {
  item: BottomSectionItem;
}

const StandardItem = memo(function StandardItem({ item }: StandardItemProps) {
  const { t } = useTranslation('project');

  return (
    <div className="flex justify-between items-start">
      <div className="flex-1 truncate">
        <OdsLink
          href={item.link as string}
          target={item.target as OdsHTMLAnchorElementTarget}
          rel={item.rel as OdsHTMLAnchorElementRel}
          color={item.color as ODS_LINK_COLOR}
          label={t(item.description || '')}
          icon={item.icon as ODS_ICON_NAME}
          aria-label={`${t(item.ariaLabelKey || item.description || '')} - ${t(
            'opens_in_new_tab',
          )}`}
        />
      </div>
    </div>
  );
});

export default StandardItem;
