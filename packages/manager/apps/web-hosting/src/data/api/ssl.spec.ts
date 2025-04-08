import { describe, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createCertificate,
  createDomainCertificate,
  deleteDomainCertificate,
  regenerateDomainCertificate,
  getDomainCertificate,
} from '@/data/api/ssl';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    post: vi.fn().mockReturnValue({ data: {} }),
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn().mockReturnValue({ data: {} }),
  },
}));

describe('createCertificate', () => {
  it('should call v6 with right arguments', () => {
    createCertificate('serviceName', 'certificate', 'key', 'chain');
    expect(v6.post).toHaveBeenLastCalledWith('/hosting/web/serviceName/ssl', {
      certificate: 'certificate',
      key: 'key',
      chain: 'chain',
    });
  });
});

describe('createDomainCertificate', () => {
  it('should call v6 with right arguments', () => {
    createDomainCertificate('serviceName', 'domain');
    expect(v6.post).toHaveBeenLastCalledWith(
      '/hosting/web/serviceName/attachedDomain/domain/ssl',
    );
  });
});

describe('deleteDomainCertificate', () => {
  it('should call v6 with right arguments', () => {
    deleteDomainCertificate('serviceName', 'domain');
    expect(v6.delete).toHaveBeenLastCalledWith(
      '/hosting/web/serviceName/attachedDomain/domain/ssl',
    );
  });
});

describe('regenerateDomainCertificate', () => {
  it('should call v6 with right arguments', () => {
    regenerateDomainCertificate('serviceName', 'domain');
    expect(v6.put).toHaveBeenLastCalledWith(
      '/hosting/web/serviceName/attachedDomain/domain/ssl',
      {
        regenerate: true,
      },
    );
  });
});

describe('getDomainCertificate', () => {
  it('should call v6 with right arguments', () => {
    getDomainCertificate('serviceName', 'domain');
    expect(v6.get).toHaveBeenLastCalledWith(
      '/hosting/web/serviceName/attachedDomain/domain/ssl',
    );
  });
});
