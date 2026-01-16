import { getLinkFilename } from '@/utils/getLinkFilename';

describe('urlToStringRegex', () => {
  it.each([
    [
      'https://s3.rbx.io.cloud.ovh.net/backup-tenant-1f386afc-f0c4-4766-b690-9533a7dfa608/vspc/ManagementAgent.vspc_tenant_157941_vspc_tenant_cc1_157941.exe?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=edded%2Fs3%2Faws4_request&X-Amz-Date=20260114T115840Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=edeed',
      'ManagementAgent.vspc_tenant_157941_vspc_tenant_cc1_157941.exe',
    ] as const,
    [
      'https://s3.rbx.io.cloud.ovh.net/backup-tenant-1f386afc-f0c4-4766-b690-9533a7dfa608/vspc/ManagementAgent.vspc_tenant_157941_vspc_tenant_cc1_157941.exe',
      'ManagementAgent.vspc_tenant_157941_vspc_tenant_cc1_157941.exe',
    ] as const,
    ['http://test/script.sh', 'script.sh'] as const,
    ['http://test/script.sh?os=macos', 'script.sh'] as const,
    ['...', ''] as const,
    ['', ''] as const,
    ['not/a/link', ''] as const,
  ] as const)('get link filename : $url for filenameExpected', (url, filenameExpected) => {
    const filename = getLinkFilename(url);
    expect(filenameExpected).toEqual(filename);
  });
});
