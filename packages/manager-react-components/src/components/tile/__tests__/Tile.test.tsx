import { describe, it, expect, vitest } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tile } from '../index';
import { ActionMenu } from '../../navigation/menus/action/action.component';
import { Link } from '@ovhcloud/ods-react';

describe('Tile Snapshot tests', () => {
  it('renders simple tile', () => {
    const { container } = render(
      <Tile.Root title="Simple Tile">
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term"></Tile.Item.Term>
          <Tile.Item.Description label="Sample Description"></Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term"></Tile.Item.Term>
          <Tile.Item.Description
            label="Sample Description"
            divider={false}
          ></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders tile term with Actions Menu', () => {
    const actionMenu = (
      <ActionMenu
        id={'action-menu'}
        isCompact
        items={[
          {
            id: 1,
            label: 'Test Label',
          },
        ]}
      />
    );
    const { container } = render(
      <Tile.Root title="Simple Tile">
        <Tile.Item.Root>
          <Tile.Item.Term
            label="Sample Term"
            actions={actionMenu}
          ></Tile.Item.Term>
          <Tile.Item.Description
            label="Sample Description"
            divider={false}
          ></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders multiple dd elements', () => {
    const { container } = render(
      <Tile.Root title="Simple Tile">
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term"></Tile.Item.Term>
          <Tile.Item.Description
            label="Sample Description"
            divider={false}
          ></Tile.Item.Description>
          <Tile.Item.Description>
            <Link href="https://www.ovhcloud.com">Link</Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );
    expect(container).toMatchSnapshot();
  });
});
