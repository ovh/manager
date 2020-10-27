export const TARIFFS_GUIDE_URL =
  'https://www.ovhtelecom.fr/telephonie/decouvrez/tarifs_telephonie.xml';

export const LINES = {
  strategies: [
    'sequentiallyByAgentOrder',
    'ringAll',
    'random',
    'longestHangupAgent',
    'longestIdleAgent',
    'roundRobin',
    'cumulationByAgentOrder',
  ],
};

export const FILTERING = {
  listTypes: [
    'incomingBlackList',
    'incomingWhiteList',
    'outgoingBlackList',
    'outgoingWhiteList',
  ],
  helperPrefixes: [
    { label: 'mobile', prefixes: ['+336', '+337'] },
    {
      label: 'line',
      prefixes: ['+331', '+332', '+333', '+334', '+335', '+339'],
    },
    {
      label: 'foreign',
      prefixes: [
        '+1',
        '+2',
        '+30',
        '+31',
        '+32',
        '+34',
        '+35',
        '+36',
        '+37',
        '+38',
        '+39',
        '+4',
        '+5',
        '+6',
        '+7',
        '+8',
        '+9',
      ],
    },
    { label: 'special', prefixes: ['+338'] },
    {
      label: 'short',
      prefixes: [
        '10',
        '11',
        '12',
        '13',
        '14',
        '16',
        '19',
        '30',
        '31',
        '32',
        '36',
        '39',
      ],
    },
  ],
};

export const RECORDS_GUIDE_URL =
  'http://www.ovh.com/fr/support/documents_legaux/conditions_particulieres_du_service_d_enregistrement_des_communications_telephoniques.pdf';

export const RECORDS = {
  languages: [
    { id: 'french', code: 'fr_FR' },
    { id: 'english', code: 'en_GB' },
  ],
  digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
};

export default {
  TARIFFS_GUIDE_URL,
  LINES,
  FILTERING,
  RECORDS_GUIDE_URL,
  RECORDS,
};
