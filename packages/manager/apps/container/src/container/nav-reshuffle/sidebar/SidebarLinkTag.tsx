import { useTranslation } from 'react-i18next';
import { Node } from './navigation-tree/node';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export default function SidebarLinkTag({ node }: { node: Node }): JSX.Element {
  const { t } = useTranslation('sidebar');

  return (
    <>
      {node.tag && (
        <OsdsChip data-testid={`static-link-tag-${node.id}`} size={ODS_CHIP_SIZE.sm} className='ml-1' color={ODS_THEME_COLOR_INTENT.info}>
          {t(`sidebar_tag_${node.tag}`)}
        </OsdsChip>
      )}
    </>
  );
}
