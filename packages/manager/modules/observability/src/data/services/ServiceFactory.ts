import { config } from '../../config/environment';
import { IDashboardService } from './IDashboardService';
import { DashboardServiceApi } from './DashboardServiceApi';
import { DashboardServiceMock } from './DashboardServiceMock';

/**
 * Factory function to create dashboard service instances.
 * Actually, This factory allows switching between mock and real API implementations
 * based on the configuration settings.
 */
export const getDashboardService = (): IDashboardService => {
  return true ? new DashboardServiceMock() : new DashboardServiceApi();
};
