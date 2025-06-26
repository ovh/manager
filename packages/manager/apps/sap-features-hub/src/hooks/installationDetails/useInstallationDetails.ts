import { queryOptions, useQuery } from '@tanstack/react-query';
import {
  InstallationDetails,
  SAPInstallationStatus,
} from '@/types/installation.type';
import {
  getInstallationTaskDetails,
  TGetInstallationTaskParams,
} from '@/data/api/sapInstallations';

export const installationTaskDetailsQueryKey = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) => ['sap', serviceName, 'tasks', taskId];

export const useInstallationTaskDetailsOptions = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) =>
  queryOptions({
    queryKey: installationTaskDetailsQueryKey({ serviceName, taskId }),
    queryFn: () => getInstallationTaskDetails({ serviceName, taskId }),
    select: (res) => res.data,
    enabled: () => !!serviceName && !!taskId,
  });

// TODO: implement API calls when developed
export const useInstallationTaskDetails = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) =>
  useQuery(useInstallationTaskDetailsOptions({ serviceName, taskId }));

export const useMockInstallationTaskDetailsOptions = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) =>
  queryOptions({
    ...useInstallationTaskDetailsOptions({ serviceName, taskId }),
    queryFn: (): Promise<{ data: InstallationDetails }> => {
      return new Promise((resolve) => {
        // Generate fake data for InstallationDetails
        const mockData: InstallationDetails = {
          ansibleSapHanaStatus: SAPInstallationStatus.failure,
          ansibleSapSystemStatus: SAPInstallationStatus.failure,
          applicationType: 'ABAP',
          applicationVersion: '1.0.0',
          cleanStatus: SAPInstallationStatus.pending,
          deploymentType: 'Standard',
          endTime: '2022-01-01T12:00:00',
          errorMessage: `1. [ERROR] DependencyError: Failed to install package "libwebsocket-3.2.1"
  2. [WARN] VersionMismatch: Requested Node >=16.x, found Node v14.15.0
  3. [CRITICAL] SegmentationFault: Installation aborted at step "configure_network_adapter"
  4. [ERROR] ChecksumFailed: File integrity compromised on "module-crypto-4.0.2.tar.gz"
  5. [FATAL] PermissionDenied: Unable to access "/usr/local/bin/" directory
  6. [ERROR] CompilationError: Rust crate "tokio-async-1.6.3" failed to build
  7. [WARN] TimeoutWarning: Network timeout while downloading dependency "axios@0.27.2"
  8. [ERROR] SyntaxError: Unexpected token 'import' during parsing config.js
  9. [CRITICAL] KernelIncompatibility: Module "fs-extended" incompatible with Linux Kernel 5.8.0
  10. [ERROR] PortUnavailable: Default port 5432 already in use by another service
  11. [WARN] EnvironmentVariableMissing: Variable DATABASE_URL not found
  12. [ERROR] ConflictDetected: Conflicting installations detected for package "express-router"
  13. [FATAL] DiskSpaceInsufficient: Less than 200MB remaining on partition "/var"
  14. [ERROR] AuthenticationFailed: Access denied to private repository "git@github.com:user/private-lib.git"
  15. [CRITICAL] DockerDaemonOffline: Docker service unavailable or stopped
  16. [ERROR] SSLHandshakeFailed: Unable to verify certificate for domain "api.example.com"
  17. [WARN] DeprecationNotice: Package "lodash@3.10.1" deprecated, installation skipped
  18. [ERROR] DatabaseMigrationFailed: PostgreSQL migration error at script "20240401_init.sql"
  19. [CRITICAL] MissingSystemLibrary: Required system library "libssl-dev" not found
  20. [ERROR] InvalidConfiguration: Unrecognized parameter "max_memory_allocation" in config.yml`,
          gatewayStatus: SAPInstallationStatus.success,
          iam: {
            displayName: 'John Doe',
            id: '123456',
            urn: 'urn:iam:123456',
          },
          sapHanaSid: 'HANA01',
          sapSid: 'SAP01',
          startTime: '2022-01-01T10:00:00',
          status: SAPInstallationStatus.pending,
          taskId: '789012',
          terraformStatus: SAPInstallationStatus.success,
        };
        setTimeout(() => {
          resolve({ data: mockData });
        }, 500);
      });
    },
  });

export const useMockInstallationTaskDetails = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) => {
  return useQuery(
    useMockInstallationTaskDetailsOptions({ serviceName, taskId }),
  );
};
