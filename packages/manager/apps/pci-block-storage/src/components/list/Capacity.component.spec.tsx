import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import CapacityComponent from '@/components/list/Capacity.component';

describe('CapacityComponent', () => {
  it('renders correct size in GiB', () => {
    const { getByText } = render(<CapacityComponent size={1024} />);
    expect(getByText('1 TiB')).toBeInTheDocument();
  });

  it('renders correct size in TiB when size is large', () => {
    const { getByText } = render(<CapacityComponent size={1048576} />);
    expect(getByText('1 PiB')).toBeInTheDocument();
  });

  it('renders correct size in MiB when size is small', () => {
    const { getByText } = render(<CapacityComponent size={1} />);
    expect(getByText('1 GiB')).toBeInTheDocument();
  });
});
