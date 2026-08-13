type TaxKind = 'vat' | 'gst' | 'tax';

const GST_SUBSIDIARIES = ['ASIA', 'AU', 'IN', 'SG'];
const TAX_SUBSIDIARIES = ['US'];

const DEFAULT_TAX_EXCLUDED_LABELS: Record<TaxKind, string> = {
  vat: 'ex. VAT',
  gst: 'ex. GST',
  tax: 'ex. tax',
};

const TAX_EXCLUDED_LABELS: Record<string, Record<TaxKind, string>> = {
  de_DE: { vat: 'zzgl. MwSt.', gst: 'ohne GST', tax: 'zzgl. MwSt.' },
  en_GB: DEFAULT_TAX_EXCLUDED_LABELS,
  es_ES: { vat: '+ IVA', gst: '+ GST', tax: '+ IVA' },
  fr_CA: { vat: 'HT', gst: 'ex. GST', tax: 'HT' },
  fr_FR: { vat: 'HT', gst: 'ex. GST', tax: 'HT' },
  it_IT: { vat: '+IVA', gst: '+GST', tax: '+IVA' },
  pl_PL: { vat: 'netto', gst: 'bez GST', tax: 'netto' },
  pt_PT: { vat: '+ IVA', gst: 'ex. GST', tax: '+ IVA' },
};

const getTaxKind = (ovhSubsidiary: string): TaxKind => {
  if (GST_SUBSIDIARIES.includes(ovhSubsidiary)) {
    return 'gst';
  }

  if (TAX_SUBSIDIARIES.includes(ovhSubsidiary)) {
    return 'tax';
  }

  return 'vat';
};

export const getTaxExcludedLabel = (locale = '', ovhSubsidiary = ''): string =>
  (TAX_EXCLUDED_LABELS[locale] ?? DEFAULT_TAX_EXCLUDED_LABELS)[getTaxKind(ovhSubsidiary)];
