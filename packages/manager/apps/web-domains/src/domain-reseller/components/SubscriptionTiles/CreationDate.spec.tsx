import { render, screen } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import CreationDate from './CreationDate';

describe('CreationDate', () => {
  const defaultProps = {
    creationDate: '2023-01-15T10:00:00Z',
    serviceName: 'service-test-001',
  };

  it('should render without crashing', () => {
    const { container } = render(<CreationDate {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('should display the creation date label', () => {
    render(<CreationDate {...defaultProps} />);
    expect(screen.getByText('creation_date')).toBeInTheDocument();
  });
});
