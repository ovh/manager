import '@/common/setupTests';
import {
  AdditionalDomainStateEnum,
  DomainStateEnum,
} from '@/domain/enum/domainState.enum';
import { SuspensionStateEnum } from '@/domain/enum/suspensionState.enum';
import { bannerTypeFromFlags } from '@/domain/utils/bannerStatus';

describe('bannerTypeFromFlags (severity + i18n key)', () => {
  it('returns warning + domain.expired for EXPIRED', () => {
    expect(bannerTypeFromFlags([DomainStateEnum.EXPIRED])).toEqual({
      type: 'warning',
      i18nKey: 'domain_tab_general_information_banner_expired_to_delete',
    });
  });

  it('returns warning + flag.dispute for DISPUTE', () => {
    expect(bannerTypeFromFlags([AdditionalDomainStateEnum.DISPUTE])).toEqual({
      type: 'warning',
      i18nKey: 'domain_tab_general_information_banner_dispute',
    });
  });

  it('warning combo: TECHNICAL_SUSPENDED + NOT_SUSPENDED', () => {
    expect(
      bannerTypeFromFlags([
        AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
        SuspensionStateEnum.NOT_SUSPENDED,
      ]),
    ).toEqual({
      type: 'warning',
      i18nKey: 'domain_tab_general_information_banner_technical_not_suspended',
    });
  });

  it('error combo: TECHNICAL_SUSPENDED + SUSPENDED', () => {
    expect(
      bannerTypeFromFlags([
        AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
        SuspensionStateEnum.SUSPENDED,
      ]),
    ).toEqual({
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_technical_suspended',
      link: {
        linkDetails: ['web-ongoing-operations', '/domain', {}],
        linki18n:
          'domain_tab_general_information_banner_link_ongoing_operations',
      },
    });
  });

  it('error combo: FORCED_DELETION + OVH_ABUSE', () => {
    expect(
      bannerTypeFromFlags([
        AdditionalDomainStateEnum.FORCED_DELETION,
        AdditionalDomainStateEnum.OVH_ABUSE,
      ]),
    ).toEqual({
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_forced_delete_ovh_abuse',
    });
  });

  it('error beats direct warning when both present', () => {
    expect(
      bannerTypeFromFlags([
        DomainStateEnum.EXPIRED,
        AdditionalDomainStateEnum.TECHNICAL_SUSPENDED,
        SuspensionStateEnum.SUSPENDED,
      ]),
    ).toEqual({
      type: 'error',
      i18nKey: 'domain_tab_general_information_banner_technical_suspended',
      link: {
        linkDetails: ['web-ongoing-operations', '/domain', {}],
        linki18n:
          'domain_tab_general_information_banner_link_ongoing_operations',
      },
    });
  });

  it('returns undefined when nothing matches', () => {
    expect(bannerTypeFromFlags(['UNKNOWN_FLAG'])).toBeUndefined();
  });

  it('accepts a single string input', () => {
    expect(bannerTypeFromFlags([DomainStateEnum.TO_DELETE])).toEqual({
      type: 'warning',
      i18nKey: 'domain_tab_general_information_banner_expired_to_delete',
    });
  });
});
