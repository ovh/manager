import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { Locale } from '@/hooks/useLocale';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';
import { mockedKafkaUserAccess } from '@/__tests__/helpers/mocks/userAccess';
import ShowAccessKey from './ShowAccessKey.modal';

const downloadMock = vi.fn();
describe('Show Access Key modal', () => {
  beforeEach(async () => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
          category: database.engine.CategoryEnum.all,
          userId: mockedDatabaseUser.id,
        }),
      };
    });
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
    }));
    vi.mock('@/data/api/database/user.api', () => ({
      getUserAccess: vi.fn(() => mockedKafkaUserAccess),
    }));

    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        service: {
          ...mockedService,
          engine: database.EngineEnum.kafka,
          capabilities: {
            ...mockedService.capabilities,
            [database.service.CapabilityEnum.userAccess]: {
              read: database.service.capability.StateEnum.enabled,
            },
          },
        },
        category: 'analytics',
        serviceQuery: {} as UseQueryResult<database.Service, Error>,
      })),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should open the modal', async () => {
    render(<ShowAccessKey />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('show-access-modal')).toBeInTheDocument();
      expect(
        screen.queryByTestId('show-access-key-clipboard'),
      ).toBeInTheDocument();
    });
  });
});
