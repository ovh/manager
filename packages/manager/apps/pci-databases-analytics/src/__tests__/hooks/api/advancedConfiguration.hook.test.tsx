import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import {
  useGetAdvancedConfiguration,
  useGetAdvancedConfigurationCapabilities,
  useUpdateAdvancedConfiguration,
} from '../../../hooks/api/advancedConfiguration.api.hook';
import * as databaseAPI from '../../../api/databases/advancedConfiguration';
import { database } from '../../../models/database';
// Mock the API functions
vi.mock('@/api/databases/advancedConfiguration', () => ({
  getAdvancedConfiguration: vi.fn(),
  getAdvancedConfigurationCapabilities: vi.fn(),
  updateAdvancedConfiguration: vi.fn(),
}));

describe('useGetAdvancedConfiguration', () => {
  it('should return advanced configuration data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockData = { key: 'value' };
    databaseAPI.getAdvancedConfiguration.mockResolvedValue(mockData);

    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useGetAdvancedConfiguration(projectId, engine, serviceId),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockData);
      expect(databaseAPI.getAdvancedConfiguration).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useGetAdvancedConfigurationCapabilities', () => {
  it('should return advanced configuration capabilities', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockCapabilities = [{ name: 'capability' }];
    databaseAPI.getAdvancedConfigurationCapabilities.mockResolvedValue(
      mockCapabilities,
    );

    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () =>
        useGetAdvancedConfigurationCapabilities(projectId, engine, serviceId),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockCapabilities);
      expect(
        databaseAPI.getAdvancedConfigurationCapabilities,
      ).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useUpdateAdvancedConfiguration', () => {
  it('should call updateAdvancedConfiguration on mutation', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockAdvancedConfiguration = { key: 'value' };
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const mockMutationResponse = { updated: true };
    databaseAPI.updateAdvancedConfiguration.mockResolvedValue(
      mockMutationResponse,
    );
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(
      () => useUpdateAdvancedConfiguration({ onError, onSuccess }),
      { wrapper },
    );

    result.current.updateAdvancedConfiguration({
      projectId,
      engine,
      serviceId,
      data: mockAdvancedConfiguration,
    });

    await waitFor(() => {
      expect(databaseAPI.updateAdvancedConfiguration).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
        data: mockAdvancedConfiguration,
      });
      expect(onSuccess).toHaveBeenCalledWith(
        mockMutationResponse,
        {
          data: mockAdvancedConfiguration,
          engine,
          projectId,
          serviceId,
        },
        undefined,
      );
    });
  });
});
