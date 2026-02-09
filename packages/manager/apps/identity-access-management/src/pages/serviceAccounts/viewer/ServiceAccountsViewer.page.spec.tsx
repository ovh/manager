import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useNavigate } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';
import ServiceAccountSecretContext, {
  ServiceAccountSecretContextType
} from '@/contexts/service-account-secret.context';

import ServiceAccountsViewer from './ServiceAccountsViewer.page';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof ReactRouterDom = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const wrapper = createWrapper();

describe('PermanentTokensViewer', () => {
  const navigateSpy = vi.fn();
  const secretValue = {
    clientId: 'fake-account',
    clientSecret: 'fake-token-secret'
  };
  const secretContextValue: ServiceAccountSecretContextType = {
    secret: secretValue,
    setSecret: () => {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(navigateSpy);
  });

  it('displays token secret in clipboard', () => {
    const { getByTestId } = render(
      <ServiceAccountSecretContext.Provider value={secretContextValue}>
        <ServiceAccountsViewer />
      </ServiceAccountSecretContext.Provider>,
      { wrapper },
    );
    expect(getByTestId('serviceAccountClientIdClipboard')).toHaveAttribute(
      'value',
      secretValue.clientId,
    );
    expect(getByTestId('serviceAccountClientSecretClipboard')).toHaveAttribute(
      'value',
      secretValue.clientSecret,
      );
    });

  it('goes back when clicking the close CTA', () => {
    const { getByTestId } = render(
      <ServiceAccountSecretContext.Provider value={secretContextValue}>
        <ServiceAccountsViewer />
      </ServiceAccountSecretContext.Provider>,
      { wrapper },
    );
    fireEvent.click(getByTestId('secondary-button'));
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
