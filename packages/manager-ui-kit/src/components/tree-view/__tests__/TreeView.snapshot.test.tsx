import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TreeView, TreeViewNode, TreeViewNodes } from '@/components';

describe('TreeView Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(
      <TreeView
        items={[
          {
            children: [
              {
                id: 'app.tsx',
                name: 'app.tsx',
              },
              {
                id: 'index.ts',
                name: 'index.ts',
              },
              {
                children: [
                  {
                    id: 'Button.tsx',
                    name: 'Button.tsx',
                  },
                  {
                    id: 'Card.tsx',
                    name: 'Card.tsx',
                  },
                ],
                id: 'components',
                name: 'components',
              },
            ],
            id: 'src',
            name: 'src',
          },
          {
            id: 'package.json',
            name: 'package.json',
          },
          {
            id: 'readme.md',
            name: 'README.md',
          },
        ]}
      >
        <TreeViewNodes>
          <TreeViewNode
            item={{
              children: [
                {
                  id: 'app.tsx',
                  name: 'app.tsx',
                },
                {
                  id: 'index.ts',
                  name: 'index.ts',
                },
                {
                  children: [
                    {
                      id: 'Button.tsx',
                      name: 'Button.tsx',
                    },
                    {
                      id: 'Card.tsx',
                      name: 'Card.tsx',
                    },
                  ],
                  id: 'components',
                  name: 'components',
                },
              ],
              id: 'src',
              name: 'src',
            }}
          />
          <TreeViewNode
            item={{
              id: 'package.json',
              name: 'package.json',
            }}
          />
          <TreeViewNode
            item={{
              id: 'readme.md',
              name: 'README.md',
            }}
          />
        </TreeViewNodes>
      </TreeView>,
    );
    expect(container).toMatchSnapshot();
  });
});
