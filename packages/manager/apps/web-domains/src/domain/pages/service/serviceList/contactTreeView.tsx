import {
  TreeView,
  TreeViewNode,
  TreeViewNodes,
  TreeViewValueChangeDetail,
} from '@ovhcloud/ods-react';

interface ContactTreeViewProps {
  readonly selectedIds: string[];
  readonly onSelectionChange: (ids: string[]) => void;
}

export default function ContactTreeView({
  selectedIds,
  onSelectionChange,
}: ContactTreeViewProps) {
  const columnItems = [
    {
      id: 'selection',
      name: 'Sélectionner toutes les contacts',
      children: [
        {
          id: 'owner',
          name: 'Contact propriétaire',
        },
        {
          id: 'admin',
          name: 'Contact administrateur',
        },
        {
          id: 'tech',
          name: 'Contact technique',
        },
        {
          id: 'billing',
          name: 'Contact facturation',
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

        onSelectionChange(newValue);
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
