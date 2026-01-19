import {
  TreeView,
  TreeViewNode,
  TreeViewNodes,
  TreeViewValueChangeDetail,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ContactColumn } from '@/domain/types/export.types';

interface ContactTreeViewProps {
  readonly selectedIds: ContactColumn[];
  readonly onSelectionChange: (ids: ContactColumn[]) => void;
}

export default function ContactTreeView({
  selectedIds,
  onSelectionChange,
}: ContactTreeViewProps) {
  const { t } = useTranslation('domain');
  const columnItems = [
    {
      id: 'selection',
      name: t('domain_table_drawer_contact_treeview'),
      children: [
        {
          id: 'owner',
          name: t('domain_table_header_contact_owner'),
        },
        {
          id: 'admin',
          name: t('domain_table_header_contact_admin'),
        },
        {
          id: 'tech',
          name: t('domain_table_header_contact_tech'),
        },
        {
          id: 'billing',
          name: t('domain_table_header_contact_billing'),
        },
      ],
    },
  ];

  return (
    <TreeView
      items={columnItems}
      multiple
      defaultExpandedValue={['selection']}
      onValueChange={(d: TreeViewValueChangeDetail) => {
        const newValue = Array.isArray(d.value)
          ? d.value
          : ([d.value].filter(Boolean) as string[]);

        onSelectionChange(newValue as ContactColumn[]);
      }}
      value={selectedIds}
    >
      <TreeViewNodes>
        {columnItems.map((item) => (
          <TreeViewNode key={item.id} item={item} />
        ))}
      </TreeViewNodes>
    </TreeView>
  );
}
