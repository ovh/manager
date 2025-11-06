import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vitest } from 'vitest';

import { Link } from '@ovhcloud/ods-react';

import { assertNotNull } from '@/commons/tests-utils/Assertions.utils';
import { ActionMenu, Tile } from '@/components';

vitest.mock('@/hooks/iam/useOvhIam', () => ({
  useAuthorizationIam: vitest.fn().mockReturnValue({
    isAuthorized: true,
    isLoading: false,
    isFetched: true,
  }),
}));

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
          <Tile.Item.Description label="Sample Description" divider={false}></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders tile term with Tooltip', async () => {
    const { baseElement, container } = render(
      <Tile.Root title="Simple Tile">
        <Tile.Item.Root>
          <Tile.Item.Term label="Sample Term" tooltip="Sample Tooltip Message"></Tile.Item.Term>
          <Tile.Item.Description label="Sample Description" divider={false}></Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );

    const tooltipElement = container.querySelector('span[data-scope="tooltip"]');
    assertNotNull(tooltipElement);

    await userEvent.hover(tooltipElement);
    expect(baseElement).toMatchSnapshot();
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
          <Tile.Item.Term label="Sample Term" actions={actionMenu}></Tile.Item.Term>
          <Tile.Item.Description label="Sample Description" divider={false}></Tile.Item.Description>
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
          <Tile.Item.Description label="Sample Description" divider={false}></Tile.Item.Description>
          <Tile.Item.Description>
            <Link href="https://www.ovhcloud.com">Link</Link>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>,
    );
    expect(container).toMatchSnapshot();
  });
});
