import { AccountStatistics, ResourceStatus } from '@/data/api';

export type DomainBodyParamsType = {
  organizationId: string;
  name: string;
  autoConfigureMX: boolean;
  autoConfigureSPF: boolean;
  autoConfigureDKIM: boolean;
  dkimEnabled?: boolean;
};

export type DomainType = {
  checksum: string;
  currentState: {
    cnameToCheck: string;
    createdAt: string;
    name: string;
    organizationId: string;
    organizationLabel: string;
    status: string;
    updatedAt: string;
    accountsStatistics: AccountStatistics[];
    expectedDNSConfig: ExpectedDNSConfig;
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status?: keyof typeof ResourceStatus;
    type: string;
  }>;
  id: string;
  resourceStatus: keyof typeof ResourceStatus;
  targetSpec: {
    organizationId: string;
  };
};

/** IAM resource metadata embedded in services models */
export interface ResourceMetadata {
  /** Resource display name */
  displayName?: string;
  /** Unique identifier of the resource */
  id: string;
  /** Resource tags. Tags that were internally computed are prefixed with ovh: */
  tags?: { [key: string]: string };
  /** Unique resource name used in policies */
  urn: string;
}

/** Zone dns Management */
export interface ZoneWithIAM {
  /** Is DNSSEC supported by this zone */
  dnssecSupported: boolean;
  /** hasDnsAnycast flag of the DNS zone */
  hasDnsAnycast: boolean;
  /** IAM resource metadata */
  iam?: ResourceMetadata;
  /** Last update date of the DNS zone */
  lastUpdate: string;
  /** Zone name */
  name: string;
  /** Name servers that host the DNS zone */
  nameServers: string[];
}

export type DomainDiagnosisTestResult =
  | DomainDiagnosisTestMXResult
  | DomainDiagnosisTestDKIMResult
  | DomainDiagnosisTestSPFResult;

/** Object representing domain diagnostic */
export interface DomainDiagnosisResponse {
  /** Id of the domain */
  domainId: string;
  /** Name of the domain */
  domainName?: string;
  /** List of errors when doing diagnostics */
  error?: DomainDiagnosisError;
  /** Recommendations on how to configure a domain */
  recommendations?: DomainDiagnosisRecommendations;
  /** Result of the diagnosis */
  result?: DomainDiagnosisResult;
  /** Status of the diagnosis */
  status: DomainDiagnosisStatusEnum;
}

/** Status of performed diagnostic process for given domain */
export enum DomainDiagnosisStatusEnum {
  'ERROR' = 'ERROR',
  'OK' = 'OK',
  'PARTIAL' = 'PARTIAL',
}

/** The result of the diagnosis */
export interface DomainDiagnosisResult {
  /** The result of the DKIM diagnosis */
  dkim: DomainDiagnosisTestDKIMResult;
  /** The result of the MX diagnosis */
  mx: DomainDiagnosisTestMXResult;
  /** The result of the SPF diagnosis */
  spf: DomainDiagnosisTestSPFResult;
}

/** Details on the DKIM error diagnosis error */
export interface DomainDiagnosisTestDKIMError {
  /** The error code for the DKIM error */
  code: DomainDiagnosisTestDKIMErrorCodeEnum;
  /** The error message for the DKIM error */
  message: string;
}

/** Error code of DKIM Diagnosis */
export enum DomainDiagnosisTestDKIMErrorCodeEnum {
  'INCORRECT_CNAME_RECORD' = 'INCORRECT_CNAME_RECORD',
  'INTERNAL_ERROR' = 'INTERNAL_ERROR',
  'MISSING_ONE_SELECTOR' = 'MISSING_ONE_SELECTOR',
  'OVH_NOT_INCLUDED' = 'OVH_NOT_INCLUDED',
  'TASK_FAILED' = 'TASK_FAILED',
  'TASK_RUNNING' = 'TASK_RUNNING',
  'DKIM_DISABLED' = 'DKIM_DISABLED',
}

/** DKIM Diagnosis test result */
export interface DomainDiagnosisTestDKIMResult {
  /** List of error during DKIM diagnosis */
  errors: DomainDiagnosisTestDKIMError[];
  /** Found DKIM records */
  recordsFound: string[];
  /**  */
  status: DomainDiagnosisTestStatusEnum;
}

/** Details on the MX error diagnosis error */
export interface DomainDiagnosisTestMXError {
  /** The error code for the MX error */
  code: DomainDiagnosisTestMXErrorCodeEnum;
  /** The error message for the MX error */
  message: string;
}

/** Error code of the MX diagnosis */
export enum DomainDiagnosisTestMXErrorCodeEnum {
  'EXTERNAL_MX_RECORD' = 'EXTERNAL_MX_RECORD',
  'INTERNAL_ERROR' = 'INTERNAL_ERROR',
  'MISSING_OVH_SERVER' = 'MISSING_OVH_SERVER',
  'NO_MX_RECORD' = 'NO_MX_RECORD',
  'OVH_MX_LOW_PRIORITY' = 'OVH_MX_LOW_PRIORITY',
}

/** MX Diagnosis test result */
export interface DomainDiagnosisTestMXResult {
  /** List of errors during MX diagnosis */
  errors: DomainDiagnosisTestMXError[];
  /** Found MX records */
  recordsFound: MXRecord[];
  /**  */
  status: DomainDiagnosisTestStatusEnum;
}

/** Status of performed diagnostic process for given test */
export enum DomainDiagnosisTestStatusEnum {
  'ERROR' = 'ERROR',
  'OK' = 'OK',
  'WARNING' = 'WARNING',
  'DISABLED' = 'DISABLED',
}

/** Details on the SPF error diagnosis error */
export interface DomainDiagnosisTestSPFError {
  /** The error code for the SPF error */
  code: DomainDiagnosisTestSPFErrorCodeEnum;
  /** The error message for the SPF error */
  message: string;
}

/** Error code of the SPF diagnosis */
export enum DomainDiagnosisTestSPFErrorCodeEnum {
  'DANGEROUS_SPF_POLICY' = 'DANGEROUS_SPF_POLICY',
  'INTERNAL_ERROR' = 'INTERNAL_ERROR',
  'INVALID_SPF_RECORD' = 'INVALID_SPF_RECORD',
  'MISSING_OVH_SERVER' = 'MISSING_OVH_SERVER',
  'MISSING_SPF_POLICY' = 'MISSING_SPF_POLICY',
  'MULTIPLE_SPF_RECORDS' = 'MULTIPLE_SPF_RECORDS',
  'NOT_RECOMMENDED_SPF_POLICY' = 'NOT_RECOMMENDED_SPF_POLICY',
  'NO_SPF_RECORD' = 'NO_SPF_RECORD',
}

/** SPF Diagnosis test result */
export interface DomainDiagnosisTestSPFResult {
  /** List of errors during SPF diagnosis */
  errors: DomainDiagnosisTestSPFError[];
  /** Found SPF record */
  recordsFound: string[];
  /**  */
  status: DomainDiagnosisTestStatusEnum;
}

/** Errors of failed diagnostic */
export interface DomainDiagnosisError {
  /** Status of performed diagnostic process for given domain */
  code: DomainDiagnosisErrorCodeEnum;
  /** Diagnosis message */
  message: string;
}

/** Status of performed diagnostic process for given domain */
export enum DomainDiagnosisErrorCodeEnum {
  'BAD_CONFIGURATION' = 'BAD_CONFIGURATION',
  'DOMAIN_IN_TRANSIENT_STATE' = 'DOMAIN_IN_TRANSIENT_STATE',
  'DOMAIN_NOT_FOUND' = 'DOMAIN_NOT_FOUND',
  'DOMAIN_NOT_VALIDATED' = 'DOMAIN_NOT_VALIDATED',
  'INTERNAL_ERROR' = 'INTERNAL_ERROR',
}

/** Recommendations on how to configure a domain */
export interface DomainDiagnosisRecommendations {
  /** Expected configuration of a domain */
  expectedDNSConfig: ExpectedDNSConfig;
}

/** Object representing a DNS configuration that should be applied */
export interface ExpectedDNSConfig {
  /** Recommended DKIM selectors */
  dkim: DKIMSelectors;
  /** Recommended MX records for efficient mail delivery */
  mx: MXRecord[];
  /** DNS configuration to apply to verify ownership */
  ownership: DNSOwnership;
  /** Recommended SPF value */
  spf: string;
}

/** Object representing an MX record */
export interface MXRecord {
  /** Priority for that target server */
  priority: number;
  /** Target server */
  target: string;
}

/** Object representing a DNS configuration that should be applied to verify ownership */
export interface DNSOwnership {
  /** Identifier on zone of domain for verification */
  cname?: string;
}

/** Object representing a DKIM selector objet which is a CName entry. */
export interface DKIMSelectors {
  /** List of CName to configure for DKIM. */
  cnames: CName[];
}

/** Object representing a DNS CName entry */
export interface CName {
  /** Name of the CName entry on customer DNS. */
  name: string;
  /** Value of the CName entry on customer DNS. */
  value: string;
}
