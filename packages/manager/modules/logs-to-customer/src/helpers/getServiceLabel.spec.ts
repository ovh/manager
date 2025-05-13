import { logServicesMock } from '../data/mocks/logService.mock';
import getServiceLabel from './getServiceLabel';

describe('getServiceLabel tests', () => {
  it('should return serviceName if displayname is undefined ', () => {
    const label = getServiceLabel(logServicesMock[0]);

    expect(label).toEqual(logServicesMock[0].serviceName);
  });

  it('should return serviceName and displayname if displayname is defined ', () => {
    const label = getServiceLabel(logServicesMock[1]);

    expect(label).toContain(logServicesMock[1].serviceName);
    expect(label).toContain(logServicesMock[1].displayName);
  });
});
