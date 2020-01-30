export default {
  statistics: {
    sampleRate: '5m-avg',
  },
  maxRemotes: 10,
  subs: [
    {
      url: {
        fr: 'https://docs.ovh.com/fr/overthebox/comment-fonctionne-overthebox/',
        it: 'https://www.ovh.it/g2237.{title}',
        en: 'https://www.ovh.com/us/g2237.{title}',
      },
      label: 'overTheBox_docs_how_it_works',
      emphasis: false,
    },
    {
      label: 'overTheBox_docs_label_installation',
      subs: [
        {
          url: {
            fr:
              'https://docs.ovh.com/fr/overthebox/mes-10-premieres-minutes-avec-overthebox/',
            it: 'https://www.ovh.it/g2228.{title}',
            en: 'https://www.ovh.com/us/g2228.{title}',
          },
          label: 'overTheBox_docs_quick_start',
          emphasis: false,
        },
        {
          url: {
            fr:
              'https://docs.ovh.com/fr/overthebox/desactiver-votre-serveur-dhcp/',
            it: 'https://www.ovh.it/g2238.{title}',
            en: 'https://www.ovh.com/us/g2238.{title}',
          },
          label: 'overTheBox_docs_modem_dhcp_disable',
          emphasis: false,
        },
        {
          url: {
            fr: 'https://docs.ovh.com/fr/overthebox/faq-overthebox/',
            it: 'https://www.ovh.it/g2242.{title}',
            en: 'https://www.ovh.com/us/g2242.{title}',
          },
          label: 'overTheBox_docs_faq',
          emphasis: false,
        },
      ],
    },
    {
      label: 'overTheBox_docs_label_config',
      subs: [
        {
          label: 'overTheBox_docs_label_intermediate',
          subs: [
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/retablir-la-configuration-dusine/',
                it: 'https://www.ovh.it/g2243.{title}',
                en: 'https://www.ovh.com/us/g2243.{title}',
              },
              label: 'overTheBox_docs_factory_reset',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/acces-a-distance/',
                it: 'https://www.ovh.it/g2275.{title}',
                en: 'https://www.ovh.com/us/g2275.{title}',
              },
              label: 'overTheBox_docs_remote_access',
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/configurer-votre-lan/',
                it: 'https://www.ovh.it/g2244.{title}',
                en: 'https://www.ovh.com/us/g2244.{title}',
              },
              label: 'overTheBox_docs_lan_configure',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/redirection-de-port/',
                it: 'https://www.ovh.it/g2245.{title}',
                en: 'https://www.ovh.com/us/g2245.{title}',
              },
              label: 'overTheBox_docs_port_redirection',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/activer-la-qos/',
                it: 'https://www.ovh.it/g2246.{title}',
                en: 'https://www.ovh.com/us/g2246.{title}',
              },
              label: 'overTheBox_docs_qos_activate',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/fonctionnement-et-customisation-de-la-qos/',
                it: 'https://www.ovh.it/g2247.{title}',
                en: 'https://www.ovh.co.uk/g2247.{title}',
              },
              label: 'overTheBox_docs_qos_principle',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/',
                it: 'https://www.ovh.it/g2252.{title}',
                en: 'https://www.ovh.com/us/g2252.{title}',
              },
              label: 'overTheBox_docs_aggregate_policy',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/creer-un-bail-dhcp-permanent/',
                it: 'https://www.ovh.it/g2253.{title}',
                en: 'https://www.ovh.com/us/g2253.{title}',
              },
              label: 'overTheBox_docs_permanent_dhcp_lease',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/desactiver-le-serveur-dhcp-doverthebox/',
                it: 'https://www.ovh.it/g2254.{title}',
                en: 'https://www.ovh.com/us/g2254.{title}',
              },
              label: 'overTheBox_docs_otb_dhcp_disable',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/protocole-de-test-de-debit/',
                it: 'https://www.ovh.it/g2255.{title}',
                en: 'https://www.ovh.com/us/g2255.{title}',
              },
              label: 'overTheBox_docs_rate_test_protocol',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/exporter-et-importer-une-configuration/',
                it: 'https://www.ovh.it/g2256.{title}',
                en: 'https://www.ovh.com/us/g2256.{title}',
              },
              label: 'overTheBox_docs_conf_import_export',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/',
                it: 'https://www.ovh.it/g2281.{title}',
                en: 'https://www.ovh.com/us/g2281.{title}',
              },
              label: 'overTheBox_docs_virtualbox_test',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/integration-dune-clef-3g-4g/',
                it: 'https://www.ovh.it/g2314.{title}',
                en: 'https://www.ovh.com/us/g2314.{title}',
              },
              label: 'overTheBox_docs_three_g_four_g',
              emphasis: false,
            },
          ],
        },
        {
          label: 'overTheBox_docs_label_advanced',
          subs: [
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/installer-limage-overthebox-sur-votre-materiel/',
                it: 'https://www.ovh.it/g2257.{title}',
                en: 'https://www.ovh.com/us/g2257.{title}',
              },
              label: 'overTheBox_docs_image_installation',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/desactiver-le-monitoring-dhcp-des-modems/',
                it: 'https://www.ovh.it/g2276.{title}',
                en: 'https://www.ovh.com/us/g2276.{title}',
              },
              label: 'overTheBox_docs_modem_dhcp_monitoring_disable',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/creer-une-interface-modem-manuellement/',
                it: 'https://www.ovh.it/g2259.{title}',
                en: 'https://www.ovh.com/us/g2259.{title}',
              },
              label: 'overTheBox_docs_modem_interface',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/configurer-votre-propre-serveur-dns/',
                it: 'https://www.ovh.it/g2260.{title}',
                en: 'https://www.ovh.com/us/g2260.{title}',
              },
              label: 'overTheBox_docs_dns_configure',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/configuration-de-vlan/',
                it: 'https://www.ovh.it/g2261.{title}',
                en: 'https://www.ovh.com/us/g2261.{title}',
              },
              label: 'overTheBox_docs_vlan_configuration',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/regles-firewall/',
                it: 'https://www.ovh.it/g2262.{title}',
                en: 'https://www.ovh.com/us/g2262.{title}',
              },
              label: 'overTheBox_docs_firewall_rules',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/tethering-iphone-et-android/',
                it: 'https://www.ovh.it/g2264.{title}',
                en: 'https://www.ovh.com/us/g2264.{title}',
              },
              label: 'overTheBox_docs_iphone_android_tethering',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/dmz-couplage-overthebox-avec-un-autre-routeur/',
                it: 'https://www.ovh.it/g2265.{title}',
                en: 'https://www.ovh.com/us/g2265.{title}',
              },
              label: 'overTheBox_docs_router_coupling',
              emphasis: false,
            },
            {
              url: {
                fr:
                  'https://docs.ovh.com/fr/overthebox/ajouter-un-serveur-active-directory-dans-les-options-dhcp/',
                it: 'https://www.ovh.it/g2266.{title}',
                en: 'https://www.ovh.com/us/g2266.{title}',
              },
              label: 'overTheBox_docs_active_directory_add',
              emphasis: false,
            },
            {
              url: {
                fr: 'https://docs.ovh.com/fr/overthebox/',
                it: 'https://www.ovh.it/g2263.{title}',
                en: 'https://www.ovh.com/us/g2263.{title}',
              },
              label: 'overTheBox_docs_multiwan_route',
              emphasis: false,
            },
          ],
        },
      ],
    },
  ],
};
