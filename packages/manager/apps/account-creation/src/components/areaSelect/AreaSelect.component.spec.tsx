import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AREA_COUNTRY } from '@/types/area';
import AreaSelect from './AreaSelect.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: {
    AREA: {
      US: 'area-us',
      CA: 'area-ca',
    },
  },
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsFormField: ({ children }: any) => <div>{children}</div>,
  OdsText: ({ children }: any) => <span>{children}</span>,
  OdsSelect: ({ children, ...props }: any) => (
    <select {...props}>{children}</select>
  ),
}));

const defaultProps = {
  name: 'area',
  value: 'CA',
  onChange: vi.fn(),
  onBlur: vi.fn(),
  country: 'US' as AREA_COUNTRY,
  area: {
    in: ['CA', 'TX', 'NY'],
    mandatory: false,
  },
  error: undefined,
  disabled: false,
  isLoading: false,
};

describe('AreaSelect component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing if area.in is empty', () => {
    const { container } = render(
      <AreaSelect
        {...defaultProps}
        area={{ in: [], mandatory: false }}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should display state label key for US country', () => {
    render(<AreaSelect {...defaultProps} />);

    expect(
      screen.getByText('account_details_field_state')
    ).toBeVisible();
  });

  it('should display province label key for CA country', () => {
    render(
      <AreaSelect
        {...defaultProps}
        country="CA"
      />,
    );

    expect(
      screen.getByText('account_details_field_province')
    ).toBeVisible();
  });

  it('should display mandatory star when area.mandatory is true', () => {
    render(
      <AreaSelect
        {...defaultProps}
        area={{ in: ['CA'], mandatory: true }}
      />,
    );

    expect(
      screen.getByText(/account_details_field_state \*/)
    ).toBeVisible();
  });

  it('should display area keys as options', () => {
    render(<AreaSelect {...defaultProps} />);

    expect(screen.getByText('CA')).toBeVisible();
    expect(screen.getByText('TX')).toBeVisible();
    expect(screen.getByText('NY')).toBeVisible();
  });

  it('should display error message when error is provided', () => {
    render(
      <AreaSelect
        {...defaultProps}
        error="Area is required"
      />,
    );

    expect(screen.getByText('Area is required')).toBeVisible();
  });
});
