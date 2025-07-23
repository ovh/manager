export const SSH_STATE = {
  ACTIVE: 'active',
  SFTPONLY: 'sftponly',
  NONE: 'none',
};

export const USER_STATE = {
  OFF: 'off',
  RW: 'rw',
};

const PREFIX_GUIDES_URL = 'https://help.ovhcloud.com/csm/';

export const FTP_EXPLORER_GUIDE = {
  FILEZILLA: {
    DEFAULT: `${PREFIX_GUIDES_URL}en-ie-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052725`,
    ASIA: `${PREFIX_GUIDES_URL}asia-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052723`,
    IN: `${PREFIX_GUIDES_URL}en-in-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0070368`,
    DE: `${PREFIX_GUIDES_URL}de-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052737`,
    ES: `${PREFIX_GUIDES_URL}es-es-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052734`,
    IE: `${PREFIX_GUIDES_URL}en-ie-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052725`,
    IT: `${PREFIX_GUIDES_URL}it-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052743`,
    PL: `${PREFIX_GUIDES_URL}pl-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052733`,
    PT: `${PREFIX_GUIDES_URL}pt-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052735`,
    GB: `${PREFIX_GUIDES_URL}en-gb-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052736`,
    CA: `${PREFIX_GUIDES_URL}en-ca-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052724`,
    QC: `${PREFIX_GUIDES_URL}fr-ca-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052730`,
    MA: `${PREFIX_GUIDES_URL}fr-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052749`,
    SN: `${PREFIX_GUIDES_URL}fr-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052749`,
    TN: `${PREFIX_GUIDES_URL}fr-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052749`,
    AU: `${PREFIX_GUIDES_URL}en-au-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0040749`,
    SG: `${PREFIX_GUIDES_URL}en-sg-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052729`,
    FR: `${PREFIX_GUIDES_URL}fr-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052749`,
    WE: `${PREFIX_GUIDES_URL}en-ie-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052725`,
    WS: `${PREFIX_GUIDES_URL}es-web-hosting-filezilla?id=kb_article_view&sysparm_article=KB0052732`,
  },
  CYBERDUCK: {
    DEFAULT: `${PREFIX_GUIDES_URL}en-ie-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052716`,
    ASIA: `${PREFIX_GUIDES_URL}asia-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052708`,
    IN: `${PREFIX_GUIDES_URL}en-in-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0070367`,
    DE: `${PREFIX_GUIDES_URL}de-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0061902`,
    ES: `${PREFIX_GUIDES_URL}es-es-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052728`,
    IE: `${PREFIX_GUIDES_URL}en-ie-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052716`,
    IT: `${PREFIX_GUIDES_URL}it-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052715`,
    PL: `${PREFIX_GUIDES_URL}pl-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052720`,
    PT: `${PREFIX_GUIDES_URL}pt-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052721`,
    GB: `${PREFIX_GUIDES_URL}en-gb-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052722`,
    CA: `${PREFIX_GUIDES_URL}en-ca-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0040733`,
    QC: `${PREFIX_GUIDES_URL}fr-ca-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052718`,
    MA: `${PREFIX_GUIDES_URL}fr-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052717`,
    SN: `${PREFIX_GUIDES_URL}fr-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052717`,
    TN: `${PREFIX_GUIDES_URL}fr-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052717`,
    AU: `${PREFIX_GUIDES_URL}en-au-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052709`,
    SG: `${PREFIX_GUIDES_URL}en-sg-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052727`,
    FR: `${PREFIX_GUIDES_URL}fr-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052717`,
    WE: `${PREFIX_GUIDES_URL}en-ie-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052716`,
    WS: `${PREFIX_GUIDES_URL}es-web-hosting-web-cyberduck-macos?id=kb_article_view&sysparm_article=KB0052719`,
  },
};

export default {
  FTP_EXPLORER_GUIDE,
  SSH_STATE,
  USER_STATE,
};
