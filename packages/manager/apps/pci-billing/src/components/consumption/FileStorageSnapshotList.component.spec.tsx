import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { wrapper } from '@/wrapperRenders';
import { TResourceUsage } from '@/api/hook/useConsumption';
import FileStorageSnapshotList from './FileStorageSnapshotList.component';

describe('FileStorageSnapshotList', () => {
  const snapshots: TResourceUsage[] = [
    {
      name: 'my-share-backup',
      region: 'GRA9',
      totalPrice: 0.5,
      quantity: { unit: 'Hour', value: 100 },
    },
  ];

  it('renders the snapshot name and region', () => {
    const { getByText } = render(
      <FileStorageSnapshotList snapshots={snapshots} />,
      { wrapper },
    );

    expect(getByText('my-share-backup')).toBeInTheDocument();
    expect(getByText('GRA9')).toBeInTheDocument();
  });

  it('shows the no-data message when there is no snapshot consumption', () => {
    const { getByText } = render(<FileStorageSnapshotList snapshots={[]} />, {
      wrapper,
    });

    expect(getByText('cpbc_no_consumption_data')).toBeInTheDocument();
  });
});
