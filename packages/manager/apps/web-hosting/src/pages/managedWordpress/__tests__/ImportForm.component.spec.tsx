/* eslint-disable @typescript-eslint/await-thenable */
import { useLocation, useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import 'element-internals-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { queryClient } from '@ovh-ux/manager-react-core-application';
import { useNotifications } from '@ovh-ux/muk';

import {
  postManagedCmsResourceWebsite,
  putManagedCmsResourceWebsiteTasks,
} from '@/data/api/managedWordpress';
import { useManagedWordpressWebsiteDetails } from '@/data/hooks/managedWordpress/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails';
import { renderWithRouter, wrapper } from '@/utils/test.provider';
import { getDomRect } from '@/utils/test.setup';

import ImportForm from '../ManagedWordpressResource/import/importForm/ImportForm.component';

vi.mock('@/data/api/managedWordpress', () => ({
  postManagedCmsResourceWebsite: vi.fn(() => Promise.resolve({ id: 'mock-website-id' })),
  putManagedCmsResourceWebsiteTasks: vi.fn(),
}));

vi.mock(
  '@/data/hooks/managedWordpress/managedWordpressWebsiteDetails/useManagedWordpressWebsiteDetails',
  () => ({
    useManagedWordpressWebsiteDetails: vi.fn(),
  }),
);

describe('ImportForm Component', () => {
  const addSuccess = vi.fn();
  const addError = vi.fn();
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(120, 120));
    vi.clearAllMocks();
  });
  afterEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => getDomRect(0, 0));
  });
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useLocation).mockReturnValue({
      pathname: '',
      search: '',
      state: undefined,
      hash: '',
      key: 'location-key',
    } as ReturnType<typeof useLocation>);
    vi.mocked(useManagedWordpressWebsiteDetails).mockReturnValue({
      data: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useManagedWordpressWebsiteDetails>);
    vi.mocked(useNotifications).mockReturnValue({
      addSuccess,
      addError,
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    });
    vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);
  });

  it('should render the form inputs and submit button for step 1', () => {
    const { getByTestId } = render(<ImportForm />, { wrapper });
    expect(getByTestId('input-admin-url')).toBeInTheDocument();
    expect(getByTestId('input-admin-login')).toBeInTheDocument();
    expect(getByTestId('input-admin-password')).toBeInTheDocument();
    expect(getByTestId('import-step1')).toBeInTheDocument();
  });

  it('should enable the submit button and make an API call on valid input for step 1', async () => {
    const { getByTestId } = render(<ImportForm />, { wrapper });

    const adminURLInput = getByTestId('input-admin-url');
    const adminLoginInput = getByTestId('input-admin-login');
    const adminPasswordInput = getByTestId('input-admin-password');
    const submitButton = getByTestId('import-step1');

    await act(() => {
      fireEvent.input(adminURLInput, {
        target: { value: 'http://example.com' },
      });
    });
    await act(() => {
      fireEvent.input(adminLoginInput, { target: { value: 'admin' } });
    });
    await act(() => {
      fireEvent.input(adminPasswordInput, { target: { value: 'Password12345' } });
    });

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(postManagedCmsResourceWebsite).toHaveBeenCalled();
    });
  });

  it('should render the form inputs and submit button for step 2', () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '',
      search: '',
      state: { websiteId: 'mock-website-id', step: 2 },
      hash: '',
      key: 'location-key-step2',
    } as ReturnType<typeof useLocation>);
    vi.mocked(useManagedWordpressWebsiteDetails).mockReturnValue({
      data: {
        currentState: {
          import: {
            checkResult: {
              cmsSpecific: {
                wordpress: {
                  plugins: [{ name: 'plugin-one', version: '1.0.0' }],
                  themes: [{ name: 'theme-one', version: '1.0.0' }],
                },
              },
            },
          },
        },
        currentTasks: [{ id: 'task-1' }],
      },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useManagedWordpressWebsiteDetails>);

    const { getByTestId } = render(<ImportForm />, {
      wrapper,
    });

    expect(getByTestId('import-media')).toBeInTheDocument();
  });

  it('should launch import and show success on step 2 submission', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue(undefined);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '',
      search: '',
      state: { websiteId: 'mock-website-id', step: 2 },
      hash: '',
      key: 'location-key-step2',
    } as ReturnType<typeof useLocation>);
    vi.mocked(useManagedWordpressWebsiteDetails).mockReturnValue({
      data: {
        currentState: {
          import: {
            checkResult: {
              cmsSpecific: {
                wordpress: {
                  plugins: [{ name: 'plugin-one', version: '1.0.0' }],
                  themes: [{ name: 'theme-one', version: '1.0.0' }],
                },
              },
            },
          },
        },
        currentTasks: [{ id: 'task-1' }],
      },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useManagedWordpressWebsiteDetails>);
    vi.mocked(putManagedCmsResourceWebsiteTasks).mockResolvedValue(
      {} as Awaited<ReturnType<typeof putManagedCmsResourceWebsiteTasks>>,
    );

    const { getByTestId } = render(<ImportForm />, { wrapper });

    act(() => {
      fireEvent.click(getByTestId('import-media'));
    });

    const form = getByTestId('import-step2').closest('form');
    if (!form) {
      throw new Error('Form not found');
    }
    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(putManagedCmsResourceWebsiteTasks).toHaveBeenCalledWith(
        'test-service',
        expect.any(Object),
        'task-1',
      );
      expect(addSuccess).toHaveBeenCalled();
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['managedWordpressWebsiteDetails', 'test-service', 'mock-website-id'],
      });
    });
  });

  it('should show an error when step 2 submission fails', async () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: '',
      search: '',
      state: { websiteId: 'mock-website-id', step: 2 },
      hash: '',
      key: 'location-key-step2',
    } as ReturnType<typeof useLocation>);
    vi.mocked(useManagedWordpressWebsiteDetails).mockReturnValue({
      data: {
        currentState: {
          import: {
            checkResult: {
              cmsSpecific: {
                wordpress: {
                  plugins: [{ name: 'plugin-one', version: '1.0.0' }],
                  themes: [{ name: 'theme-one', version: '1.0.0' }],
                },
              },
            },
          },
        },
        currentTasks: [{ id: 'task-1' }],
      },
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useManagedWordpressWebsiteDetails>);
    vi.mocked(putManagedCmsResourceWebsiteTasks).mockRejectedValue(new Error('submit failed'));

    const { getByTestId } = render(<ImportForm />, { wrapper });

    act(() => {
      fireEvent.click(getByTestId('import-media'));
    });

    const form = getByTestId('import-step2').closest('form');
    if (!form) {
      throw new Error('Form not found');
    }
    act(() => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(putManagedCmsResourceWebsiteTasks).toHaveBeenCalled();
      expect(addError).toHaveBeenCalled();
    });
  });
  it('should have a valid html with a11y and w3c', async () => {
    const { container } = renderWithRouter(<ImportForm />);
    // Strip empty aria-describedby from ODS FormField (invalid IDREFS) before validation
    const html = container.innerHTML.replace(/\s*aria-describedby=""\s*/g, ' ');
    await expect(html).toBeValidHtml();
    await expect(container).toBeAccessible();
  });
});
