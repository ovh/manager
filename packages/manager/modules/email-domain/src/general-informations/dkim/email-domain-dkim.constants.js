const DKIM_TRANSLATION_PREFIX = 'email_domain_dkim_';

export const DKIM_STATUS = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  DISABLED_NO_SET: 'error',
  ERROR: 'error',
  TO_CONFIGURE: 'toConfigure',
  MODIFYING: 'modifying',
};

export const DKIM_STATUS_TEXT = {
  [DKIM_STATUS.ENABLED]: `${DKIM_TRANSLATION_PREFIX}deactivation`,
  [DKIM_STATUS.DISABLED]: `${DKIM_TRANSLATION_PREFIX}activation`,
  [DKIM_STATUS.MODIFYING]: `${DKIM_TRANSLATION_PREFIX}in_progress`,
};

export const DKIM_STATUS_CLASS = {
  [DKIM_STATUS.ENABLED]: 'oui-badge_success',
  [DKIM_STATUS.DISABLED]: 'oui-badge_warning',
  [DKIM_STATUS.DISABLED_NO_SET]: 'oui-badge_error',
  [DKIM_STATUS.TO_CONFIGURE]: 'oui-badge_error',
  [DKIM_STATUS.MODIFYING]: 'oui-badge_info',
  [DKIM_STATUS.ERROR]: 'oui-badge_error',
};

export const DKIM_MODAL_TITLE = {
  [DKIM_STATUS.ENABLED]: `${DKIM_TRANSLATION_PREFIX}title_desactivation `,
  [DKIM_STATUS.DISABLED]: `${DKIM_TRANSLATION_PREFIX}title_activation`,
  [DKIM_STATUS.MODIFYING]: `${DKIM_TRANSLATION_PREFIX}title_configuration`,
};

export const DKIM_PRIMARY_BUTTON_LABEL = {
  [DKIM_STATUS.ENABLED]: `${DKIM_TRANSLATION_PREFIX}deactivate`,
  [DKIM_STATUS.DISABLED]: `${DKIM_TRANSLATION_PREFIX}activate`,
  [DKIM_STATUS.MODIFYING]: 'wizard_close',
};

export const DKIM_SECONDARY_BUTTON_LABEL = {
  [DKIM_STATUS.ENABLED]: 'common_cancel',
  [DKIM_STATUS.DISABLED]: 'common_cancel',
  [DKIM_STATUS.MODIFYING]: null,
};

export const DKIM_CONFIGURATION_GUIDE_NO_OVH = {
  US:
    'https://help.ovhcloud.com/csm/en-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058258#configuring-dkim-for-an-email-solution-outside-of-your-ovhcloud-account',
  DE:
    'https://help.ovhcloud.com/csm/de-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058380#dkim-fur-einen-e-mail-dienst-auerhalb-ihres-ovhcloud-kunden-accounts-konfigurieren',
  ES:
    'https://help.ovhcloud.com/csm/es-es-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058253#configurar-el-dkim-para-una-solucion-de-correo-electronico-fuera-de-su-cuenta-de-ovhcloud',
  FR:
    'https://help.ovhcloud.com/csm/fr-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058101#configurer-le-dkim-pour-une-offre-e-mail-hors-de-votre-compte-ovhcloud',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058259#configuring-dkim-for-an-email-solution-outside-of-your-ovhcloud-account',
  IT:
    'https://help.ovhcloud.com/csm/it-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058256#configurare-il-dkim-per-unofferta-email-al-di-fuori-del-tuo-account-ovhcloud',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058259#external-dkim',
  PL:
    'https://help.ovhcloud.com/csm/pl-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058254#konfiguracja-dkim-w-przypadku-oferty-e-mail-poza-twoim-kontem-ovhcloud',
  PT:
    'https://help.ovhcloud.com/csm/pt-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058255#configurar-o-dkim-para-uma-oferta-de-e-mail-fora-da-sua-conta-ovhcloud',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058238#configuring-dkim-for-an-email-solution-outside-of-your-ovhcloud-account',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058260#external-dkim',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058257#external-dkim',
  MA:
    'https://help.ovhcloud.com/csm/fr-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058101#external-dkim',
  SN:
    'https://help.ovhcloud.com/csm/fr-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058101#external-dkim',
  TN:
    'https://help.ovhcloud.com/csm/fr-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058101#external-dkim',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058259#external-dkim',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-dns-zone-dkim?id=kb_article_view&sysparm_article=KB0058258#configuring-dkim-for-an-email-solution-outside-of-your-ovhcloud-account',
};

export default {
  DKIM_STATUS,
  DKIM_STATUS_TEXT,
  DKIM_STATUS_CLASS,
  DKIM_MODAL_TITLE,
  DKIM_PRIMARY_BUTTON_LABEL,
  DKIM_SECONDARY_BUTTON_LABEL,
  DKIM_CONFIGURATION_GUIDE_NO_OVH,
};
