import React from 'react';

import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import 'element-internals-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { queryClient } from '@ovh-ux/manager-react-core-application';

import { managedWordpressResourceDetailsMock } from '@/data/__mocks__';
import { managedWordpressRerefenceAvailableLanguageMock } from '@/data/__mocks__/managedWordpress/language';
import { managedWordpressRerefenceSupportedVersionMock } from '@/data/__mocks__/managedWordpress/supportedPhpVersion';
import { postManagedCmsResourceWebsite } from '@/data/api/managedWordpress';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect, navigate } from '@/utils/test.setup';

import CreatePage from '../ManagedWordpressResource/create/Create.page';

describe('CreatePage Component', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
    vi.mock(
      '@/data/hooks/managedWordpress/managedWordpressResourceDetails/useManagedWordpressResourceDetails',
      () => ({
        useManagedWordpressResourceDetails: vi.fn(() => ({
          data: managedWordpressResourceDetailsMock,
          refetch: vi.fn(),
        })),
      }),
    );
    vi.mock(
      '@/data/hooks/managedWordpress/managedWordpressReferenceAvailableLanguages/useManagedWordpressReferenceAvailableLanguages',
      () => ({
        useManagedWordpressReferenceAvailableLanguages: vi.fn(() => ({
          data: managedWordpressRerefenceAvailableLanguageMock,
        })),
      }),
    );
    vi.mock(
      '@/data/hooks/managedWordpress/managedWordpressReferenceSupportedPHPVersions/managedWordpressReferenceSupportedPHPVersions',
      () => ({
        useManagedCmsLatestPhpVersion: vi.fn(() => ({
          data: managedWordpressRerefenceSupportedVersionMock,
        })),
      }),
    );

    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });

  it('should render the form inputs and submit button', () => {
    const { getByTestId } = render(<CreatePage />, { wrapper });
    expect(getByTestId('input-language')).toBeInTheDocument();
    expect(getByTestId('input-phpVersion')).toBeInTheDocument();
    expect(getByTestId('input-admin-login')).toBeInTheDocument();
    expect(getByTestId('input-admin-password')).toBeInTheDocument();
    expect(getByTestId('create')).toBeInTheDocument();
  });

  it('should enable the submit button and make an API call on valid input', async () => {
    const { getByTestId } = render(<CreatePage />, { wrapper });

    const languageSelect = getByTestId('input-language') as HTMLSelectElement;
    const phpVersionSelect = getByTestId('input-phpVersion') as HTMLSelectElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('create');

    vi.mocked(postManagedCmsResourceWebsite).mockResolvedValue(undefined);

    act(() => {
      fireEvent.change(languageSelect, { target: { value: 'fr_FR' } });
      fireEvent.blur(languageSelect);
    });
    act(() => {
      fireEvent.change(phpVersionSelect, { target: { value: '8.1' } });
      fireEvent.blur(phpVersionSelect);
    });
    act(() => {
      fireEvent.change(adminLoginInput, { target: { value: 'admin@example.com' } });
      fireEvent.blur(adminLoginInput);
    });
    act(() => {
      fireEvent.change(adminPasswordInput, { target: { value: 'Password12345' } });
      fireEvent.blur(adminPasswordInput);
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalledWith('test-service', {
        targetSpec: {
          creation: {
            adminLogin: 'admin@example.com',
            adminPassword: 'Password12345',
            cms: 'WORDPRESS',
            cmsSpecific: { wordpress: { language: 'fr_FR' } },
            phpVersion: '8.1',
          },
        },
      });
    });
  });

  it('should show an error when form submission fails', async () => {
    vi.mocked(postManagedCmsResourceWebsite).mockRejectedValue(new Error('submit failed'));

    const { getByTestId } = render(<CreatePage />, { wrapper });

    const languageSelect = getByTestId('input-language') as HTMLSelectElement;
    const phpVersionSelect = getByTestId('input-phpVersion') as HTMLSelectElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('create');

    act(() => {
      fireEvent.change(languageSelect, { target: { value: 'fr_FR' } });
      fireEvent.blur(languageSelect);
    });
    act(() => {
      fireEvent.change(phpVersionSelect, { target: { value: '8.1' } });
      fireEvent.blur(phpVersionSelect);
    });
    act(() => {
      fireEvent.change(adminLoginInput, { target: { value: 'admin@example.com' } });
      fireEvent.blur(adminLoginInput);
    });
    act(() => {
      fireEvent.change(adminPasswordInput, { target: { value: 'Password12345' } });
      fireEvent.blur(adminPasswordInput);
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
    });
  });

  it('should navigate back after successful submission', async () => {
    vi.mocked(postManagedCmsResourceWebsite).mockResolvedValue(undefined);

    const { getByTestId } = render(<CreatePage />, { wrapper });

    const languageSelect = getByTestId('input-language') as HTMLSelectElement;
    const phpVersionSelect = getByTestId('input-phpVersion') as HTMLSelectElement;
    const adminLoginInput = getByTestId('input-admin-login') as HTMLInputElement;
    const adminPasswordInput = getByTestId('input-admin-password') as HTMLInputElement;
    const submitButton = getByTestId('create');

    act(() => {
      fireEvent.change(languageSelect, { target: { value: 'fr_FR' } });
      fireEvent.blur(languageSelect);
    });
    act(() => {
      fireEvent.change(phpVersionSelect, { target: { value: '8.1' } });
      fireEvent.blur(phpVersionSelect);
    });
    act(() => {
      fireEvent.change(adminLoginInput, { target: { value: 'admin@example.com' } });
      fireEvent.blur(adminLoginInput);
    });
    act(() => {
      fireEvent.change(adminPasswordInput, { target: { value: 'Password12345' } });
      fireEvent.blur(adminPasswordInput);
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalled();
    });
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<CreatePage />);

    // Strip empty aria-describedby from ODS FormField (invalid IDREFS) before validation
    const html = container.innerHTML.replace(/\s*aria-describedby=""\s*/g, ' ');
    await expect(html).toBeValidHtml();

    await expect(container).toBeAccessible();
  });
});
