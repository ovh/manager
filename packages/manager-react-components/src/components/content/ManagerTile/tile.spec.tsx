import React from 'react';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { ManagerTile } from './manager-tile.component';

const testItem = {
  id: 'id',
  label: 'label',
  value: 'value',
};

describe.skip('Dashboard Tile component', () => {
  it('renders correctly', async () => {
    // render(<ManagerTile title="Title" items={[testItem]} />);
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText(testItem.value)).toBeInTheDocument();
      expect(screen.getByText(testItem.label)).toBeInTheDocument();
      expect(screen.queryByText(testItem.id)).not.toBeInTheDocument();
    });
  });

  it('renders correctly without items', async () => {
    // render(<ManagerTile title="Title 2" items={[]} />);
    await waitFor(() => {
      expect(screen.getByText('Title 2')).toBeInTheDocument();
    });
  });

  it('renders correctly without title', async () => {
    // render(<ManagerTile items={[testItem]} />);
    await waitFor(() => {
      expect(screen.getByText(testItem.value)).toBeInTheDocument();
      expect(screen.getByText(testItem.label)).toBeInTheDocument();
      expect(screen.queryByText(testItem.id)).not.toBeInTheDocument();
    });
  });

  it('renders correctly without label', async () => {
    // render(<ManagerTile items={[{ ...testItem, label: undefined }]} />);
    await waitFor(() => {
      expect(screen.getByText(testItem.value)).toBeInTheDocument();
      expect(screen.queryByText(testItem.label)).not.toBeInTheDocument();
      expect(screen.queryByText(testItem.id)).not.toBeInTheDocument();
    });
  });
});
