import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import AddSshPage from './AddSshPage';
import { wrapper } from '@/setupTests';

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

describe('AddSshPage', () => {
  it('renders AddSshModal correctly', () => {
    const { getByTestId } = render(<AddSshPage />, { wrapper });
    expect(getByTestId('addSshModal-modal')).toBeInTheDocument();
  });
});
