import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { User } from '@ovh-ux/manager-config';
import { ApiError } from '@ovh-ux/manager-core-api';
import * as useMeApi from '@/data/hooks/useMe';
import Footer from './Footer.component';

describe('Footer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should not display privacy policy if user has no subsidiary', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      data: {
        language: 'fr_FR',
      },
      isFetched: true,
    } as UseQueryResult<User, ApiError>);
    render(<Footer />);

    const privacyPolicyElement = screen.queryByTestId('privacy-policy');
    expect(privacyPolicyElement).not.toBeInTheDocument();
  });

  it('should not display privacy policy if user has no language', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      data: {
        ovhSubsidiary: 'FR',
      },
      isFetched: true,
    } as UseQueryResult<User, ApiError>);
    render(<Footer />);

    const privacyPolicyElement = screen.queryByTestId('privacy-policy');
    expect(privacyPolicyElement).not.toBeInTheDocument();
  });

  it('should display privacy policy if user has a subsidiary and a language', async () => {
    vi.spyOn(useMeApi, 'useMe').mockReturnValue({
      data: {
        language: 'fr_FR',
        ovhSubsidiary: 'FR',
      },
      isFetched: true,
    } as UseQueryResult<User, ApiError>);
    render(<Footer />);

    const privacyPolicyElement = screen.queryByTestId('privacy-policy');
    expect(privacyPolicyElement).toBeInTheDocument();
  });
});
