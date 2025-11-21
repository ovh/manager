import { SHARED_CDN_OPTIONS } from '@/constants';
import { CdnFormValues, CdnOption, CdnOptionType } from '@/data/types/product/cdn';

import {
  SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
  SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
  SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
  SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
} from '.';

export const isOptionEnabled = (domainOptions: CdnOption[], type: CdnOptionType) => {
  return domainOptions?.find((opt) => opt.type === type)?.enabled || false;
};

export const hasOption = (domainOptions: CdnOption[], type: CdnOptionType) => {
  return domainOptions?.some((opt) => opt.type === type);
};

export const findOption = (domainOptions: CdnOption[], type: CdnOptionType) => {
  return domainOptions?.find((opt) => opt.type === type);
};

export const getPrewarmQuotaPercentage = (domainOptions: CdnOption[]) => {
  const prewarmData = findOption(domainOptions, CdnOptionType.PREWARM);
  return ((prewarmData?.extra?.usage || 0) / prewarmData?.extra?.quota) * 100;
};

export const getQuotaUsage = (domainOptions: CdnOption[]) => {
  function bytesFR(value = 0, { precision = 2 } = {}) {
    if (!Number.isFinite(value) || value <= 0) return '0 o';
    const base = 1024;
    const units = ['o', 'Ko', 'Mo', 'Go', 'To', 'Po'];
    const i = Math.min(Math.floor(Math.log(value) / Math.log(base)), units.length - 1);

    const num = value / base ** i;

    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    }).format(num);

    return `${formatted} ${units[i]}`;
  }

  const prewarmData = findOption(domainOptions, CdnOptionType.PREWARM);

  const { usage = 0, quota } = prewarmData?.extra;
  const convertUsage = bytesFR(usage);
  const convertQuota = bytesFR(quota);
  const totalUsage = ((usage / quota) * 100).toFixed(2);

  return `${convertUsage} / ${convertQuota} (${totalUsage}%)`;
};

export const convertToUnitTime = (ttl: number, t: (key: string) => string) => {
  if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_DAY === 0) {
    return {
      timeValue: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
      timeUnit: t('cdn_shared_modal_add_rule_field_time_to_live_unit_days'),
    };
  }
  if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR === 0)
    return {
      timeValue: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR,
      timeUnit: t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours'),
    };
  return {
    timeValue: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE,
    timeUnit: t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes'),
  };
};

export const convertToHstsUnit = (ttl: number) => {
  if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND === 0) {
    return {
      age: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
      unit: SHARED_CDN_SETTINGS_RULE_FACTOR_SECOND,
    };
  }
  if (ttl % SHARED_CDN_SETTINGS_RULE_FACTOR_DAY === 0)
    return {
      age: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
      unit: SHARED_CDN_SETTINGS_RULE_FACTOR_DAY,
    };
  return {
    age: ttl / SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
    unit: SHARED_CDN_SETTINGS_RULE_FACTOR_MONTH,
  };
};

export const convertToTtl = (timeValue: number, timeUnit: string, t: (key: string) => string) => {
  switch (timeUnit) {
    case t('cdn_shared_modal_add_rule_field_time_to_live_unit_days'):
      return timeValue * SHARED_CDN_SETTINGS_RULE_FACTOR_DAY;
    case t('cdn_shared_modal_add_rule_field_time_to_live_unit_hours'):
      return timeValue * SHARED_CDN_SETTINGS_RULE_FACTOR_HOUR;
    case t('cdn_shared_modal_add_rule_field_time_to_live_unit_minutes'):
      return timeValue * SHARED_CDN_SETTINGS_RULE_FACTOR_MINUTE;
    default:
      return 0;
  }
};

export const cdnFormDefaultValues = (optionsData: CdnOption[]): CdnFormValues => {
  const hstsUnit = convertToHstsUnit(findOption(optionsData, CdnOptionType.HSTS)?.config?.ttl);
  return {
    brotli: isOptionEnabled(optionsData, CdnOptionType.BROTLI),
    geoHeaders: isOptionEnabled(optionsData, CdnOptionType.GEO_HEADERS),
    prefetch: isOptionEnabled(optionsData, CdnOptionType.PREFETCH),
    mobileRedirect: isOptionEnabled(optionsData, CdnOptionType.MOBILE_REDIRECT),
    devmode: isOptionEnabled(optionsData, CdnOptionType.DEVMODE),
    querystring: isOptionEnabled(optionsData, CdnOptionType.QUERYSTRING),
    prewarm: isOptionEnabled(optionsData, CdnOptionType.PREWARM),
    cors: isOptionEnabled(optionsData, CdnOptionType.CORS),
    httpsRedirect: isOptionEnabled(optionsData, CdnOptionType.HTTPS_REDIRECT),
    hsts: isOptionEnabled(optionsData, CdnOptionType.HSTS),
    mixedContent: isOptionEnabled(optionsData, CdnOptionType.MIXED_CONTENT),
    waf: isOptionEnabled(optionsData, CdnOptionType.WAF),
    hstsAge: hstsUnit?.age || 0,
    hstUnit: hstsUnit?.unit || 0,
    mobileRedirectType: findOption(optionsData, CdnOptionType.MOBILE_REDIRECT)?.config?.followUri
      ? SHARED_CDN_OPTIONS.MOBILE_REDIRECT.STILL_URL
      : SHARED_CDN_OPTIONS.MOBILE_REDIRECT.KEEP_URL,
    mobileRedirectUrl: findOption(optionsData, CdnOptionType.MOBILE_REDIRECT)?.config?.destination,
    corsResources: findOption(optionsData, CdnOptionType.CORS)?.config?.resources,
    premwarmResources: findOption(optionsData, CdnOptionType.PREWARM)?.config?.resources,
    querytringParam: findOption(optionsData, CdnOptionType.QUERYSTRING)?.config?.queryParameters,
    httpsRedirectCode: findOption(optionsData, CdnOptionType.HTTPS_REDIRECT)?.config?.statusCode,
  };
};

export const hasSecurityOption = (optionsData: CdnOption[]) => {
  return [
    CdnOptionType.CORS,
    CdnOptionType.HTTPS_REDIRECT,
    CdnOptionType.HSTS,
    CdnOptionType.MIXED_CONTENT,
    CdnOptionType.WAF,
  ].some((key) => optionsData?.find((opt) => opt.type === key));
};
