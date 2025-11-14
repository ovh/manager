import {
  TreeView,
  TreeViewNode,
  TreeViewNodes,
  TreeViewValueChangeDetail,
} from '@ovhcloud/ods-react';

interface DomainTreeViewProps {
  readonly selectedIds: string[];
  readonly onSelectionChange: (ids: string[]) => void;
}

export default function DomainTreeView({
  selectedIds,
  onSelectionChange,
}: DomainTreeViewProps) {
  const columnItems = [
    {
      id: 'selection',
      name: 'Sélectionner toutes les options',
      children: [
        {
          id: 'domain',
          name: 'Nom de domaine ASCII (Punycode)',
          disabled: true,
        },
        {
          id: 'domain-utf8',
          name: 'Nom de domaine UTF-8',
        },
        {
          id: 'creation',
          name: 'Date de création',
        },
        {
          id: 'expiration',
          name: "Date d'expiration",
        },
        {
          id: 'service-owo',
          name: 'Service OWO (RDDS)',
        },
        {
          id: 'dns-server',
          name: 'Serveur DNS',
        },
        {
          id: 'dnssec',
          name: 'DNSSEC',
        },
        {
          id: 'dns-anycast',
          name: 'DNS Anycast',
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
        if (!newValue.includes('domain')) {
          newValue.push('domain');
        }

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
