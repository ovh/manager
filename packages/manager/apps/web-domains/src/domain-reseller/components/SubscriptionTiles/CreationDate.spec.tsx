import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CreationDate from './CreationDate';

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => ({ date }: { date: string }) =>
      new Date(date).toLocaleDateString(),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useNavigationGetUrl: vi.fn(() => '/mocked-url'),
}));

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

  it('should display the formatted creation date', () => {
    render(<CreationDate {...defaultProps} />);
    const formattedDate = new Date(
      defaultProps.creationDate,
    ).toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('should format date correctly with different date', () => {
    const props = {
      creationDate: '2024-06-20T14:30:00Z',
      serviceName: 'another-service-002',
    };
    render(<CreationDate {...props} />);
    const formattedDate = new Date(props.creationDate).toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });
});
