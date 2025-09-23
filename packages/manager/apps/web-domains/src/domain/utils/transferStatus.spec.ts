import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';
import { transferStatusFromState } from './transferStatus';

describe('transferStatusFromState', () => {
  it('should return the correct result for UNPROTECTED to PROTECTED', () => {
    const result = transferStatusFromState(
      ProtectionStateEnum.UNPROTECTED,
      ProtectionStateEnum.PROTECTED,
    );
    expect(result).toEqual({
      color: 'information',
      toggleStatus: 'disabled',
      i18nkeyContent: 'domain_dns_table_state_activating',
      i18nkeyTooltip:
        'domain_tab_general_information_transfer_activation_progress',
    });
  });

  it('should return the correct result for PROTECTED to PROTECTED', () => {
    const result = transferStatusFromState(
      ProtectionStateEnum.PROTECTED,
      ProtectionStateEnum.PROTECTED,
    );
    expect(result).toEqual({
      color: 'success',
      toggleStatus: 'active',
      i18nkeyContent: 'domain_dns_table_state_enabled',
      i18nkeyTooltip: 'domain_tab_general_information_transfer_activated',
    });
  });

  it('should return the correct result for PROTECTED to UNPROTECTED', () => {
    const result = transferStatusFromState(
      ProtectionStateEnum.PROTECTED,
      ProtectionStateEnum.UNPROTECTED,
    );
    expect(result).toEqual({
      color: 'warning',
      toggleStatus: 'disabled',
      i18nkeyContent: 'domain_dns_table_state_deleting',
      i18nkeyTooltip:
        'domain_tab_general_information_transfer_disable_progress',
    });
  });

  it('should return the correct result for UNPROTECTED to UNPROTECTED', () => {
    const result = transferStatusFromState(
      ProtectionStateEnum.UNPROTECTED,
      ProtectionStateEnum.UNPROTECTED,
    );
    expect(result).toEqual({
      color: 'critical',
      toggleStatus: 'active',
      i18nkeyContent: '@ovh-ux/manager-common-translations/status:disabled',
      i18nkeyTooltip: 'domain_tab_general_information_transfer_disabled',
    });
  });

  it('should return undefined for unknown states', () => {
    const result = transferStatusFromState(
      'UNKNOWN_STATE' as ProtectionStateEnum,
      'UNKNOWN_STATE' as ProtectionStateEnum,
    );
    expect(result).toBeUndefined();
  });
});
