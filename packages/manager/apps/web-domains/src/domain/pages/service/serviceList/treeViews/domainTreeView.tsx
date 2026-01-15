import {
  TreeView,
  TreeViewNode,
  TreeViewNodes,
  TreeViewValueChangeDetail,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DomainColumn } from '@/domain/types/export.types';

interface DomainTreeViewProps {
  readonly selectedIds: DomainColumn[];
  readonly onSelectionChange: (ids: DomainColumn[]) => void;
}

export default function DomainTreeView({
  selectedIds,
  onSelectionChange,
}: DomainTreeViewProps) {
  const { t } = useTranslation('domain');
  const columnItems = [
    {
      id: 'selection',
      name: t('domain_table_drawer_domain_treeview'),
      children: [
        {
          id: 'domain',
          name: t('domain_table_drawer_domain_ascii'),
          disabled: true,
        },
        {
          id: 'domain-utf8',
          name: t('domain_table_drawer_domain_utf8'),
        },
        {
          id: 'creation',
          name: t('domain_table_drawer_domain_creation_date'),
        },
        {
          id: 'expiration',
          name: t(
            'domain_tab_general_information_subscription_expiration_date',
          ),
        },
        {
          id: 'dns-server',
          name: t('domain_tab_DNS_modification_form_server_field'),
        },
        {
          id: 'dnssec',
          name: t('domain_table_header_dnssec'),
        },
        {
          id: 'dns-anycast',
          name: t('domain_table_drawer_domain_anycast'),
        },
        {
          id: 'dns-type',
          name: t('domain_dns_table_header_type'),
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

        onSelectionChange(newValue as DomainColumn[]);
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
