export const TELEPHONY_AVAILABILITY = {
  order: ['FR'],
};

angular.module('managerApp').constant('TELEPHONY_INFRASTRUCTURE_OPTIONS', {
  instanceOptions: {
    PaintStyle: {
      lineWidth: 2,
      strokeStyle: '#354291',
    },
    HoverPaintStyle: {
      lineWidth: 4,
      strokeStyle: '#354291',
    },
    ConnectionsDetachable: false,
    EndpointStyle: {
      fillStyle: 'transparent',
    },
    MaxConnections: -1,
  },
  endpointOptions: {
    bottom: {
      source: {
        anchor: [0.5, 0.5, 0, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 0, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    top: {
      source: {
        anchor: [0.5, 0.5, 0, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 0, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    topLeft: {
      source: {
        anchor: [0.5, 0.5, -1, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, -1, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    bottomRight: {
      source: {
        anchor: [0.5, 0.5, 1, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 1, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
  },
}).constant('TELEPHONY_INFRASTRUCTURE_OPTIONS', {
  instanceOptions: {
    PaintStyle: {
      lineWidth: 2,
      strokeStyle: '#354291',
    },
    HoverPaintStyle: {
      lineWidth: 4,
      strokeStyle: '#354291',
    },
    ConnectionsDetachable: false,
    EndpointStyle: {
      fillStyle: 'transparent',
    },
    MaxConnections: -1,
  },
  endpointOptions: {
    bottom: {
      source: {
        anchor: [0.5, 0.5, 0, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 0, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    top: {
      source: {
        anchor: [0.5, 0.5, 0, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 0, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    topLeft: {
      source: {
        anchor: [0.5, 0.5, -1, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, -1, -1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
    bottomRight: {
      source: {
        anchor: [0.5, 0.5, 1, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
      target: {
        anchor: [0.5, 0.5, 1, 1],
        connector: ['TucTwoSegments', { radius: 30 }],
      },
    },
  },
}).constant('TELEPHONY_RMA', {
  pdfBaseUrl: 'https://www.ovh.com/cgi-bin/telephony/rma.pl?reference=',
})
  .constant('TELEPHONY_REPAYMENT_CONSUMPTION', {
    calledFeesPrefix: {
      fr: [
        '0033805',
      ],
      be: [
        '0032800',
      ],
    },
    groupRepaymentsPrefix: {
      fr: [
        '0033806',
        '003381',
        '003382',
        '003389',
      ],
      be: [
        '003278',
        '003270',
        '0032900',
        '0032902',
        '0032903',
        '0032904',
        '0032905',
        '0032906',
        '0032907',
      ],
    },
    specialNumberPrefix: {
      france: ['00338'],
      belgium: ['0032800', '003278', '0032900', '003270'],
    },
  })
  .constant('TELEPHONY_SERVICE', {
    validSoundExtensions: ['aiff', 'au', 'flac', 'ogg', 'mp3', 'wav', 'wma'],
  })
  .constant('TELEPHONY_ALIAS_CONFERENCE', {
    reportStatus: ['none', 'customer', 'other'],
    languages: [
      { label: 'de_DE', value: 'de' },
      { label: 'en_GB', value: 'en' },
      { label: 'es_ES', value: 'es' },
      { label: 'fr_FR', value: 'fr' },
      { label: 'it_IT', value: 'it' },
    ],
    webAccessType: {
      followUp: 'read',
      control: 'write',
    },
  })
  .constant('TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION', {
    tariffsGuideUrl: 'https://www.ovhtelecom.fr/telephonie/decouvrez/tarifs_telephonie.xml',
    lines: {
      strategies: ['sequentiallyByAgentOrder', 'ringAll', 'random', 'longestHangupAgent', 'longestIdleAgent', 'roundRobin', 'cumulationByAgentOrder'],
    },
    filtering: {
      listTypes: ['incomingBlackList', 'incomingWhiteList', 'outgoingBlackList', 'outgoingWhiteList'],
      helperPrefixes: [
        { label: 'mobile', prefixes: ['+336', '+337'] },
        { label: 'line', prefixes: ['+331', '+332', '+333', '+334', '+335', '+339'] },
        { label: 'foreign', prefixes: ['+1', '+2', '+30', '+31', '+32', '+34', '+35', '+36', '+37', '+38', '+39', '+4', '+5', '+6', '+7', '+8', '+9'] },
        { label: 'special', prefixes: ['+338'] },
        { label: 'short', prefixes: ['10', '11', '12', '13', '14', '16', '19', '30', '31', '32', '36', '39'] },
      ],
    },
    recordsGuideUrl: 'http://www.ovh.com/fr/support/documents_legaux/conditions_particulieres_du_service_d_enregistrement_des_communications_telephoniques.pdf',
    records: {
      languages: [
        { id: 'french', code: 'fr_FR' },
        { id: 'english', code: 'en_GB' },
      ],
      digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
  })
  .constant('TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES', [
    'easyPabx', 'miniPabx',
  ])
  .constant('TELEPHONY_GUIDES', {
    sections: [
      {
        label: 'telephony_guides_section_line',
        guides: [
          {
            label: 'telephony_guides_activate_services',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/activer-desactiver-services-depuis-telephone/',
            },
          },
          {
            label: 'telephony_guides_configure_call_forward',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/comment-configurer-les-renvois-d-appels/',
            },
          },
          {
            label: 'telephony_guides_configure_programmable_keys',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/configurer-touches-programmables/',
            },
          },
          {
            label: 'telephony_guides_configure_exceptionnal_closures',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/configurer-plages-horaires-fermetures-exceptionnelles-ligne/',
            },
          },
          {
            label: 'telephony_guides_configure_answering_machine',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/configurer-consulter-repondeur-ligne-ovh/',
            },
          },
          {
            label: 'telephony_guides_configure_click2call',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/configurer-utiliser-click2call/',
            },
          },
          {
            label: 'telephony_guides_manage_abreviated_numbers',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/gerer-numeros-abreges-ligne-sip/',
            },
          },
          {
            label: 'telephony_guides_manage_simultaneous_calling',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/gerer-utiliser-appels-simultanes/',
            },
          },
          {
            label: 'telephony_guides_manage_number_presentation',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/gerer-la-presentation-du-numero-sur-votre-ligne-sip/',
            },
          },
          {
            label: 'telephony_guides_import_phonebook',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/importer_un_carnet_de_contacts/',
            },
          },
          {
            label: 'telephony_guides_intercom_mode',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/mode-intercom/',
            },
          },
          {
            label: 'telephony_guides_update_sounds',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/modifier-musiques-sonneries-ligne/',
            },
          },
          {
            label: 'telephony_guides_restrict_sip_line',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/restreindre-ligne-sip-par-ip/',
            },
          },
        ],
      },
      {
        label: 'telephony_guides_section_phone_troubleshooting',
        guides: [
          {
            label: 'telephony_guides_phone_troubleshooting_pap',
            url: {
              fr: 'https://docs.ovh.com/fr/voip/depannage-telephone-plug-and-phone/',
            },
          },
        ],
      },
    ],
  });

export default {
  TELEPHONY_AVAILABILITY,
};
