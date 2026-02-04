import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReactRouterDom, { useNavigate } from 'react-router-dom';
import { createWrapper } from '@/test-utils/wrapperRender';
import TokenSecretContext, {
  TokenSecretContextType,
} from '@/contexts/token-secret.context';

import PermanentTokensViewer from './PermanentTokensViewer.page';

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
  const tokenSecretValue = 'fake-token-secret';
  const tokenContextValue: TokenSecretContextType = {
    tokenSecret: tokenSecretValue,
    setTokenSecret: () => {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(navigateSpy);
  });

  it('displays token secret in clipboard', () => {
    const { getByTestId } = render(
      <TokenSecretContext.Provider value={tokenContextValue}>
        <PermanentTokensViewer />
      </TokenSecretContext.Provider>,
      { wrapper },
    );
    expect(getByTestId('tokenSecretClipboard')).toHaveAttribute(
      'value',
      tokenSecretValue,
    );
  });

  it('goes back when clicking the close CTA', () => {
    const { getByTestId } = render(
      <TokenSecretContext.Provider value={tokenContextValue}>
        <PermanentTokensViewer />
      </TokenSecretContext.Provider>,
      { wrapper },
    );
    fireEvent.click(getByTestId('secondary-button'));
    expect(navigateSpy).toHaveBeenCalledWith('..');
  });
});
