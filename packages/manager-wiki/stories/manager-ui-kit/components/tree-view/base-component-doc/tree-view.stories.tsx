import { type Meta, type StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  FormField,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  TreeView,
  TreeViewNode,
  TreeViewNodes,
  type TreeViewProp,
  type TreeViewValueChangeDetail,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<TreeViewProp>;

(TreeView as any).__docgenInfo = docgenMap.treeView;
(TreeViewNode as any).__docgenInfo = docgenMap.treeViewNode;

const meta: Meta<TreeViewProp> = {
  argTypes: excludeFromDemoControls(['defaultExpandedValue', 'defaultValue', 'items', 'onExpandedChange', 'onValueChange', 'expandedValue', 'value']),
  component: TreeView,
  subcomponents: { TreeViewNode },
  tags: ['new'],
  title: 'Manager UI Kit/Components/Tree View/Base',
};

export default meta;

export const Demo: Story = {
  render: (arg) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];

    return (
      <TreeView
        defaultExpandedValue={ arg.defaultExpandedValue }
        disabled={ arg.disabled }
        expandedValue={ arg.expandedValue }
        items={ items }
        multiple={ arg.multiple }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  },
  argTypes: orderControls({
    disabled: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    multiple: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
  }),
};

export const Default: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];

    return (
      <TreeView items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];

    return (
      <TreeView items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
}

export const Multiple: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <TreeView
        items={ items }
        multiple>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    )
  }
}

export const DefaultExpandedValue: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <TreeView
        defaultExpandedValue={["src", "components"]}
        items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
}

export const Controlled: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    const [selectedId, setSelectedId] = useState<string | undefined>('package.json');
    return (
      <>
        <TreeView
          items={ items }
          onValueChange={(d: TreeViewValueChangeDetail) => setSelectedId(d.value[0])}
          value={ selectedId ? [selectedId] : undefined }>
          <TreeViewNodes>
            { items.map((item) => (
              <TreeViewNode key={ item.id } item={ item } />
            )) }
          </TreeViewNodes>
        </TreeView>
        <div style={{ marginTop: 8 }}>Selected: { selectedId ?? 'None' }</div>
      </>
    );
  }
}

export const ControlledMultiple: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes, type TreeViewValueChangeDetail } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    const [selectedIds, setSelectedIds] = useState<string[]>(['package.json', 'index.ts']);
    return (
      <>
        <TreeView
          items={ items }
          multiple
          onValueChange={(d: TreeViewValueChangeDetail) => setSelectedIds(Array.isArray(d.value) ? d.value : [d.value].filter(Boolean) as string[])}
          value={ selectedIds }>
          <TreeViewNodes>
            { items.map((item) => (
              <TreeViewNode key={ item.id } item={ item } />
            )) }
          </TreeViewNodes>
        </TreeView>
        <div style={{ marginTop: 8 }}>Selected: { selectedIds.length ? selectedIds.join(', ') : 'None' }</div>
      </>
    );
  }
}

export const Disabled: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <TreeView
        disabled
        items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
}

export const DisabledItems: Story = {
  globals: {
    imports: `import { TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts', disabled: true },
          {
            id: 'components',
            name: 'components',
            disabled: true,
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx', disabled: true },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json', disabled: true },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <TreeView items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item } />
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
}

export const CustomRender: Story = {
  globals: {
    imports: `import { Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <TreeView items={ items }>
        <TreeViewNodes>
          { items.map((item) => (
            <TreeViewNode key={ item.id } item={ item }>
              { ({ item, isBranch, isExpanded }) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  { isBranch ? (isExpanded ? <Icon name={ ICON_NAME.folderMinus } /> : <Icon name={ ICON_NAME.folderPlus } />) : <Icon name={ ICON_NAME.file } /> }
                  <span>{ item.name }</span>
                </span>
              ) }
            </TreeViewNode>
          )) }
        </TreeViewNodes>
      </TreeView>
    );
  }
}

export const InFormField: Story = {
  globals: {
    imports: `import { FormField, FormFieldLabel, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    const items = [
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          {
            id: 'components',
            name: 'components',
            children: [
              { id: 'Button.tsx', name: 'Button.tsx' },
              { id: 'Card.tsx', name: 'Card.tsx' },
            ],
          },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ];
    return (
      <FormField>
        <FormFieldLabel>Choose a file</FormFieldLabel>
        <TreeView items={ items }>
          <TreeViewNodes>
            { items.map((item) => (
              <TreeViewNode key={ item.id } item={ item } />
            )) }
          </TreeViewNodes>
        </TreeView>
      </FormField>
    );
  }
}

export const DynamicChildren: Story = {
  globals: {
    imports: `import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, Icon, ICON_NAME, TreeView, TreeViewNode, TreeViewNodes } from '@ovhcloud/ods-react';
import { useRef, useState } from 'react';`,
  },
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  tags: ['!dev'],
  render: ({}) => {
    type Item = { id: string, name: string, children?: Item[] };
    const [items, setItems] = useState<Item[]>([
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'app.tsx', name: 'app.tsx' },
          { id: 'index.ts', name: 'index.ts' },
          { id: 'components', name: 'components', children: [] },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'readme.md', name: 'README.md' },
    ]);
    const counter = useRef(1);

    function addChildTo(collection: Item[], parentId: string, newNode: Item): Item[] {
      return collection.map((node) => {
        if (node.id === parentId) {
          const nextChildren = Array.isArray(node.children) ? [...node.children, newNode] : [newNode];
          return { ...node, children: nextChildren };
        }
        if (node.children?.length) {
          return { ...node, children: addChildTo(node.children, parentId, newNode) };
        }
        return node;
      });
    }

    function removeNodeFrom(collection: Item[], nodeId: string): Item[] {
      return collection
        .filter((node) => node.id !== nodeId)
        .map((node) => node.children?.length ? { ...node, children: removeNodeFrom(node.children, nodeId) } : node);
    }

    function handleAddChild(parentId: string): void {
      const id = `new-file-${counter.current++}.txt`;
      const newNode = { id, name: id };
      setItems((prev) => addChildTo(prev, parentId, newNode));
    }

    function handleDelete(nodeId: string): void {
      setItems((prev) => removeNodeFrom(prev, nodeId));
    }

    function handleAddRootFile(): void {
      const id = `new-file-${counter.current++}.txt`;
      const newNode = { id, name: id };
      setItems((prev) => [...prev, newNode]);
    }

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            aria-label="Add file at root level"
            onClick={ handleAddRootFile }
            size={ BUTTON_SIZE.xs }
            variant={ BUTTON_VARIANT.outline }>
            <Icon name={ ICON_NAME.plus } />
            Add file at root level
          </Button>
        </div>
        <TreeView
          items={ items }
          multiple>
          <TreeViewNodes>
            { items.map((item) => (
              <TreeViewNode key={ item.id } item={ item }>
                { ({ item, isBranch }) => (
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      { isBranch ? <Icon name={ ICON_NAME.folder } /> : <Icon name={ ICON_NAME.file } /> }
                      <span>{ item.name }</span>
                    </span>
                    <div style={{ display: 'inline-flex', marginLeft: 'auto', alignItems: 'center', gap: 8}}>
                      { isBranch ? (
                        <Button
                        aria-label="Add child"
                        onClick={(e) => { e.stopPropagation(); handleAddChild(item.id); }}
                        size={ BUTTON_SIZE.xs }
                        onKeyDown={(e) => { e.stopPropagation(); }}
                        variant={ BUTTON_VARIANT.outline }
                        >
                          <Icon name={ ICON_NAME.plus } />
                        </Button>
                      ) : null }
                      <Button
                        aria-label="Delete"
                        color={ BUTTON_COLOR.critical }
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        onMouseDown={(e) => { e.stopPropagation(); }}
                        onKeyDown={(e) => { e.stopPropagation(); }}
                        size={ BUTTON_SIZE.xs }
                        variant={ BUTTON_VARIANT.outline }>
                        <Icon name={ ICON_NAME.trash } />
                      </Button>
                    </div>
                  </div>
                ) }
              </TreeViewNode>
            )) }
          </TreeViewNodes>
        </TreeView>
      </div>
    );
  }
}
