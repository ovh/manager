import { GuideLinks } from '@/domain/constants/guideLinks';

export function generateGuideLinks(template: string): GuideLinks {
  return {
    FR: template.replace('{{lang}}', 'fr'),
    EN: template.replace('{{lang}}', 'en-gb'),
    DE: template.replace('{{lang}}', 'de'),
    ES: template.replace('{{lang}}', 'es-es'),
    IT: template.replace('{{lang}}', 'it'),
    PL: template.replace('{{lang}}', 'pl'),
    PT: template.replace('{{lang}}', 'pt'),
    DEFAULT: template.replace('{{lang}}', 'fr'),
  };
}
