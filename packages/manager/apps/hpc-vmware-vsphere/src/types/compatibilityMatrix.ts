export type SecurityOptionName =
  | 'accessNetworkFiltered'
  | 'advancedSecurity'
  | 'base'
  | 'contentLibrary'
  | 'grsecKernel'
  | 'hds'
  | 'hids'
  | 'hipaa'
  | 'logForwarder'
  | 'nids'
  | 'pcidss'
  | 'privateCustomerVlan'
  | 'privateGw'
  | 'sendLogToCustomer'
  | 'sessionTimeout'
  | 'sftp'
  | 'snc'
  | 'spla'
  | 'sslV3'
  | 'tls1.2'
  | 'tokenValidation'
  | 'twoFa'
  | 'twoFaFail2ban'
  | 'vrliForwarder'
  | 'waf';

export type SecurityOptionReasonCode =
  | 'ACTION_IMPOSSIBLE'
  | 'ALREADY_DISABLED'
  | 'ALREADY_ENABLED'
  | 'BAD_ZONE'
  | 'BREAKING_REQUIREMENTS'
  | 'CONFLICTING_OPTIONS'
  | 'DEFINITIVE_OPTION'
  | 'GENERIC_ERROR'
  | 'HAS_UNSUPPORTED_DEPENDENCIES'
  | 'MISSING_REQUIREMENTS_OPTIONS'
  | 'NOT_ENABLED'
  | 'NOT_MANAGEABLE_DIRECTLY'
  | 'SERVICE_SUSPENDED';

export type SecurityOptionState =
  | 'creating'
  | 'deleted'
  | 'deleting'
  | 'delivered'
  | 'disabled'
  | 'pending'
  | 'toCreate'
  | 'updating';

export interface SecurityOptionReason {
  code: SecurityOptionReasonCode;
  message: string;
}

export interface SecurityOption {
  compatible: boolean;
  description: string;
  enabled: boolean;
  name: SecurityOptionName;
  reason: SecurityOptionReason | null;
  state: SecurityOptionState;
}
