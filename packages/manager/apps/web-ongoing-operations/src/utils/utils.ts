import { GUIDES_LIST, LangCode } from '@/guides.constants';

export const removeQuotes = (comment: string) => {
  if (
    comment &&
    comment[0].startsWith('"') &&
    comment.slice(-1).endsWith('"')
  ) {
    return comment.replace(/"/g, '');
  }
  return comment;
};

export function getNicParams(fields: string[]): string {
  if (!fields || fields.length === 0) {
    return '';
  }
  const params = new URLSearchParams({ fields: fields.join(',') });
  return `?${params.toString()}`;
}

export function getLanguageKey(lang: string): LangCode {
  const code = lang.split(/[-_]/)[0].toUpperCase();
  const isSupported = code in GUIDES_LIST.domains.url;

  return isSupported ? (code as LangCode) : 'DEFAULT';
}
