import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { DashboardTile } from './dashboard-tile.component';
import '@testing-library/jest-dom';

const testItem = {
  id: 'id',
  label: 'label',
  value: 'value',
};

describe('Dashboard Tile component', () => {
  it('renders correctly', async () => {
    render(<DashboardTile title="Title" items={[testItem]} />);
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText(testItem.value)).toBeInTheDocument();
      expect(screen.getByText(testItem.label)).toBeInTheDocument();
      expect(screen.queryByText(testItem.id)).not.toBeInTheDocument();
    });
  });

  it('renders correctly without items', async () => {
    render(<DashboardTile title="Title 2" items={[]} />);
    await waitFor(() => {
      expect(screen.getByText('Title 2')).toBeInTheDocument();
    });
  });

  it('renders correctly without title', async () => {
    render(<DashboardTile items={[testItem]} />);
    await waitFor(() => {
      expect(screen.getByText(testItem.value)).toBeInTheDocument();
      expect(screen.getByText(testItem.label)).toBeInTheDocument();
      expect(screen.queryByText(testItem.id)).not.toBeInTheDocument();
    });
  });
});
