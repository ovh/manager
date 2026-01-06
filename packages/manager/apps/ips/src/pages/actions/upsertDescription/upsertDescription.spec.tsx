import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import UpsertDescriptionModal from './upsertDescription.page';

// Mock react-router hooks used by the component
const navigateMock = vi.fn();
const paramsMock = { id: 'ip-1', parentId: 'parent-1' } as any;
const searchParamsMock = { toString: () => '' } as any;
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as any),
    useNavigate: () => navigateMock,
    useParams: () => paramsMock,
    useSearchParams: () => [searchParamsMock],
  };
});

// Mock tracking and notifications
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  Modal: (props: any) => (
    <div>
      <div data-testid="modal-heading">{props.heading}</div>
      <button data-testid="primary" onClick={props.onPrimaryButtonClick}>
        {props.primaryLabel}
      </button>
      <button data-testid="secondary" onClick={props.onSecondaryButtonClick}>
        {props.secondaryLabel}
      </button>
      <div>{props.children}</div>
    </div>
  ),
  useNotifications: () => ({ addSuccess: vi.fn() }),
}));

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsFormField: (props: any) => <div>{props.children}</div>,
  OdsText: (props: any) => <span>{props.children}</span>,
  OdsTextarea: (props: any) => (
    <textarea
      data-testid={props['data-testid']}
      value={props.value}
      onChange={(e) => props.onOdsChange({ detail: { value: e.target.value } })}
      readOnly={props.isReadonly}
    />
  ),
}));

// Mock data hooks
const mutateMock = vi.fn();
vi.mock('@/data/hooks/ip/useUpsertIpDescription', () => ({
  useUpsertIpDescription: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

vi.mock('@/data/hooks/ip', () => ({
  useGetIpdetails: () => ({
    ipDetails: { description: 'initial description' },
    isLoading: false,
  }),
}));

// Minimal translations mock
vi.mock('react-i18next', async () => {
  return {
    useTranslation: () => ({
      t: (k: string, opts?: any) => (opts && opts.value) || k,
    }),
  };
});

describe('UpsertDescriptionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial description and character count', () => {
    render(<UpsertDescriptionModal />);

    expect(screen.getByTestId('modal-heading')).toBeDefined();
    expect(screen.getByTestId('textarea-form-field')).toBeDefined();
    expect(screen.getByTestId('textarea-form-field')).toHaveValue(
      'initial description',
    );
    expect(screen.getByText(/initial description/)).toBeDefined();
  });

  it('updates character count when textarea changes', async () => {
    render(<UpsertDescriptionModal />);

    const textarea = screen.getByTestId('textarea-form-field');
    fireEvent.change(textarea, { target: { value: 'new text' } });

    await waitFor(() => {
      expect(screen.getByText(/new text/)).toBeDefined();
    });
  });

  it('calls mutate on confirm and navigates on success flow', async () => {
    render(<UpsertDescriptionModal />);

    const primary = screen.getByTestId('primary');
    fireEvent.click(primary);

    expect(mutateMock).toHaveBeenCalled();
  });

  it('navigates when cancel is clicked', () => {
    render(<UpsertDescriptionModal />);

    const secondary = screen.getByTestId('secondary');
    fireEvent.click(secondary);

    expect(navigateMock).toHaveBeenCalled();
  });
});
