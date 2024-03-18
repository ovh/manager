import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import queryClient from '@/queryClient';
import { useRegeneratePassword } from '@/hooks/useUser';
import RegeneratePasswordAction from './RegeneratePasswordAction';
import { User } from '@/interface';

vi.mock('@ovh-ux/manager-react-shell-client', async () => ({
  useEnvironment: () => ({
    user: {},
  }),
  useTracking: () => ({
    trackClick: () => null,
  }),
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => {
    return {
      navigate: () => {},
    };
  },
  useParams: () => {
    return {
      projectId: 'foo',
    };
  },
}));

vi.mock('@/hooks/useUser', () => {
  const regenerate = vi.fn(() => {});
  return {
    useRegeneratePassword: () => ({
      regenerate,
    }),
    useUser: () => ({}),
  };
});

function renderModal() {
  const user: User = {
    username: 'toto',
    id: 1234567,
    creationDate: '2024-01-01',
    password: 'password',
    status: 'OK',
    description: '',
  };
  render(
    <QueryClientProvider client={queryClient}>
      <RegeneratePasswordAction user={user} />,
    </QueryClientProvider>,
  );
}

describe('Regenerate Password', () => {
  it('should regenerate password of user with button', async () => {
    const useRegenerate = useRegeneratePassword({
      projectId: 'foo',
      userId: 'bar',
      onSuccess: () => {},
      onError: () => {},
    });
    renderModal();
    const regeneratePasswordButton = screen.getByTestId(
      'regeneratePasswordButton',
    );
    expect(useRegenerate.regenerate).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(regeneratePasswordButton);
    });
    expect(useRegenerate.regenerate).toHaveBeenCalled();
  });
});
