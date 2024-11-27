import { AccountStatistics, ResourceStatus } from '../api.type';

export type DomainBodyParamsType = {
  organizationId?: string;
  name?: string;
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
    expectedDNSConfig: {
      mx: Array<{
        priority: number;
        target: string;
      }>;
      ownership: {
        cname: string | null;
      };
    };
  };
  currentTasks: Array<{
    id: string;
    link: string;
    status?: ResourceStatus;
    type: string;
  }>;
  id: string;
  resourceStatus: ResourceStatus;
  targetSpec: {
    organizationId: string;
  };
};

export type DnsDiagnostic = MXDiagnostic | SPFDiagnostic | DKIMDiagnostic;

/** Error code of MX Diagnostics */
export enum MXErrorCodeEnum {
  'MISSING_VALID_MX_RECORD' = 'MISSING_VALID_MX_RECORD',
}

/** Object representing an MX record */
export interface MXRecord {
  /** Priority for that target server */
  priority: number;
  /** Target server */
  target: string;
}

/** Object representing a MX diagnostic */
export interface MXDiagnostic {
  /** Error code of the MX diagnostic */
  errorCode?: MXErrorCodeEnum;
  /** Error message of the MX diagnostic */
  errorMessage?: string;
  /** MX records found */
  recordsFound?: MXRecord[];
  /** Status of the MX diagnostic */
  status: DiagnosticStatusEnum;
}

/** Error code of SPF Diagnostics */
export enum SPFErrorCodeEnum {
  'MISSING_RECORD' = 'MISSING_RECORD',
  'OVH_NOT_INCLUDED' = 'OVH_NOT_INCLUDED',
}

/** Object representing a SPF diagnostic */
export interface SPFDiagnostic {
  /** Error code of the SPF diagnostic */
  errorCode?: SPFErrorCodeEnum;
  /** Error message of the SPF diagnostic */
  errorMessage?: string;
  /** Record found for SPF */
  recordFound?: string;
  /** Status of the SPF diagnostic */
  status: DiagnosticStatusEnum;
}

/** Global status of the diagnostic */
export enum GlobalDiagnosticStatusEnum {
  'ERROR' = 'ERROR',
  'OK' = 'OK',
  'PARTIAL' = 'PARTIAL',
}

/** Error code for glopbal diagnostic */
export enum GlobalDiagnosticErrorEnum {
  'DNS_TIMEOUT' = 'DNS_TIMEOUT',
}

/** Status of the diagnostic */
export enum DiagnosticStatusEnum {
  'DISABLED' = 'DISABLED',
  'ERROR' = 'ERROR',
  'OK' = 'OK',
  'TO_CONFIGURE' = 'TO_CONFIGURE',
  'UPDATING' = 'UPDATING',
}

/** Error code of DKIM Diagnostics */
export enum DKIMErrorCodeEnum {
  'INCORRECT_CNAME_RECORD' = 'INCORRECT_CNAME_RECORD',
  'MISSING_ONE_SELECTOR' = 'MISSING_ONE_SELECTOR',
  'OVH_NOT_INCLUDED' = 'OVH_NOT_INCLUDED',
  'TASK_FAILED' = 'TASK_FAILED',
}

/** Object representing a diagnostic of DKIM */
export interface DKIMDiagnostic {
  /** Error code of the DKIM diagnostic */
  errorCode?: DKIMErrorCodeEnum;
  /** Error message of the DKIM diagnostic */
  errorMessage?: string;
  /** Records found in DNS identified as DKIM */
  recordsFound?: string[];
  /** Status of the DKIM diagnostic */
  status: DiagnosticStatusEnum;
}

/** Diagnostic of a domain */
export interface Diagnostic {
  /** Diagnostic of DKIM fields */
  dkim?: DKIMDiagnostic;
  /** Error code of the global diagnostic */
  errorCode?: GlobalDiagnosticErrorEnum;
  /** Error message of the global diagnostic */
  errorMessage?: string;
  /** Diagnostic of MX fields */
  mx?: MXDiagnostic;
  /** Diagnostic of SPF field */
  spf?: SPFDiagnostic;
  /** Global status of the diagnostic */
  status: GlobalDiagnosticStatusEnum;
}

/** Response to a diagnostic request */
export interface DiagnosticResponse {
  /** Diagnostic of the domain */
  diagnostic: Diagnostic;
  /** Id of the domain */
  domainId: string;
  /** Name of the domain */
  domainName: string;
  /** Id of the diagnostic */
  id: string;
}
