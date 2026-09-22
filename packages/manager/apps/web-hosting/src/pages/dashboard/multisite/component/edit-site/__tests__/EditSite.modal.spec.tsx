import { fireEvent, render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import EditSiteModal from '../EditSite.modal';

const putWebHostingWebsite = vi.fn<
  (serviceName: string, id: string, payload: unknown) => Promise<object>
>(() => Promise.resolve({}));

vi.mock('@/data/api/webHosting', () => ({
  putWebHostingWebsite: (serviceName: string, id: string, payload: unknown) =>
    putWebHostingWebsite(serviceName, id, payload),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ serviceName: 'foo.ovh' }),
    useLocation: () => ({
      state: { siteId: 'website-1', siteName: 'my-site', path: 'current-path' },
    }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@ovh-ux/muk', () => ({
  Modal: ({
    children,
    heading,
    primaryButton,
  }: React.PropsWithChildren<{
    heading?: string;
    primaryButton?: { label: string; onClick: () => void; disabled?: boolean };
  }>) => (
    <div data-testid="edit-site-modal">
      {heading && <div>{heading}</div>}
      {children}
      <button
        type="button"
        data-testid="confirm"
        disabled={primaryButton?.disabled}
        onClick={primaryButton?.onClick}
      >
        {primaryButton?.label}
      </button>
    </div>
  ),
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
}));

describe('EditSite modal', () => {
  beforeEach(() => {
    putWebHostingWebsite.mockClear();
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });

  it('renders the modal', () => {
    const { getByTestId } = render(<EditSiteModal />, { wrapper });
    expect(getByTestId('edit-site-modal')).not.toBeNull();
  });

  it('keeps the confirm button disabled while the path has not changed', () => {
    const { getByTestId } = render(<EditSiteModal />, { wrapper });
    expect(getByTestId('confirm')).toHaveProperty('disabled', true);
  });

  it('sends the new path along with the unchanged site name', async () => {
    const { container, getByTestId } = render(<EditSiteModal />, { wrapper });
    const pathInput = container.querySelector('input[name="path"]');

    fireEvent.change(pathInput, { target: { value: 'new-path' } });
    await waitFor(() => expect(getByTestId('confirm')).toHaveProperty('disabled', false));

    fireEvent.click(getByTestId('confirm'));

    await waitFor(() =>
      expect(putWebHostingWebsite).toHaveBeenCalledWith('foo.ovh', 'website-1', {
        targetSpec: { name: 'my-site', path: 'new-path' },
      }),
    );
  });
});
