import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { wrapper } from '@/setupTests';
import RemoveSshPage from '@/pages/RemoveSshPage';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ projectId: '123' }),
  useNavigate: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({
    addError: vi.fn(),
    addSuccess: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

describe('RemoveSshPage', () => {
  it('renders RemoveSshModal correctly', () => {
    const { getByTestId } = render(<RemoveSshPage />, { wrapper });
    expect(getByTestId('pciModal-modal')).toBeInTheDocument();
  });
});
