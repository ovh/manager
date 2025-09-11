import { logServicesMock } from '../data/mocks/logService.mock';
import getServiceLabel from './getServiceLabel';

describe('getServiceLabel tests', () => {
  it('should return serviceName if displayname is undefined ', () => {
    const service = logServicesMock?.[0];
    if (service) {
      const label = getServiceLabel(service);
      expect(label).toEqual(service.serviceName);
    }
  });

  it('should return serviceName and displayname if displayname is defined ', () => {
    const service = logServicesMock?.[1];
    if (service) {
      const label = getServiceLabel(service);
      expect(label).toContain(service.serviceName);
      expect(label).toContain(service.displayName);
    }
  });
});
