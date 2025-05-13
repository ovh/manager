import React from 'react';
import { waitFor, screen } from '@testing-library/react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { render } from '../../../utils/test.provider';
import { ManagerTile } from './manager-tile.component';

const testItem = (
  <ManagerTile.Item>
    <ManagerTile.Item.Label>label</ManagerTile.Item.Label>
    <ManagerTile.Item.Description>
      <OdsText>value</OdsText>
    </ManagerTile.Item.Description>
  </ManagerTile.Item>
);

describe('Manager Tile component', () => {
  it('renders correctly', async () => {
    render(
      <ManagerTile>
        <ManagerTile.Title>Title</ManagerTile.Title>
        <ManagerTile.Divider />
        {testItem}
      </ManagerTile>,
    );
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('value')).toBeInTheDocument();
      expect(screen.getByText('label')).toBeInTheDocument();
    });
  });

  it('renders correctly without items', async () => {
    render(
      <ManagerTile>
        <ManagerTile.Title>Title 2</ManagerTile.Title>
      </ManagerTile>,
    );
    await waitFor(() => {
      expect(screen.getByText('Title 2')).toBeInTheDocument();
    });
  });

  it('renders correctly without title', async () => {
    render(<ManagerTile>{testItem}</ManagerTile>);
    await waitFor(() => {
      expect(screen.getByText('value')).toBeInTheDocument();
      expect(screen.getByText('label')).toBeInTheDocument();
    });
  });

  it('renders correctly without label', async () => {
    render(
      <ManagerTile>
        <ManagerTile.Item>
          <ManagerTile.Item.Description>value</ManagerTile.Item.Description>
        </ManagerTile.Item>
      </ManagerTile>,
    );
    await waitFor(() => {
      expect(screen.getByText('value')).toBeInTheDocument();
      expect(screen.queryByText('label')).not.toBeInTheDocument();
    });
  });
});
