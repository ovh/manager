import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import Root, { Loader } from '@/pages/Root.page';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as serviceApi from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';

const ServiceProps = {
  params: {
    projectId: 'projectId',
    category: 'operational',
  },
  request: new Request('https://my-api.com/endpoint'),
};

describe('Home page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock necessary hooks and dependencies
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));

    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        redirect: vi.fn(),
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
        }),
      };
    });

    vi.mock('@/data/api/database/service.api', () => ({
      getServices: vi.fn(() => []),
    }));

    vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
      const mod = await importOriginal<
        typeof import('@ovh-ux/manager-react-shell-client')
      >();
      return {
        ...mod,
        useShell: vi.fn(() => ({
          i18n: {
            getLocale: vi.fn(() => Locale.fr_FR),
            onLocaleChange: vi.fn(),
            setLocale: vi.fn(),
          },
        })),
      };
    });
  });

  it('fetches services data', async () => {
    Loader(ServiceProps);
    await waitFor(() => {
      expect(serviceApi.getServices).toHaveBeenCalled();
    });
  });

  it('should display service page', async () => {
    vi.mocked(serviceApi.getServices).mockResolvedValue([mockedService]);
    render(<Root />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(
        screen.getByTestId('services-guides-container'),
      ).toBeInTheDocument();
    });
  });
});
