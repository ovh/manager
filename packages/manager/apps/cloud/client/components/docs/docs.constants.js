angular
  .module('managerApp')
  .constant('DOCS_ALL_GUIDES', {
    FR: 'https://docs.ovh.com/fr/',
    EN: 'https://docs.ovh.com/gb/en/',
    US: 'https://support.us.ovhcloud.com/hc/en-us',
    EN_ASIA: 'https://docs.ovh.com/asia/en',
    EN_AU: 'https://docs.ovh.com/au/en',
    EN_SG: 'https://docs.ovh.com/sg/en',
  })
  .constant('DOCS_HOMEPAGE_GUIDES', {
    FR: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_1',
            atInternetClickTag: 'TopGuide-PublicCloud-1',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/getting_started_with_public_cloud_logging_in_and_creating_a_project/',
          },
          {
            text: 'guide_project_2',
            atInternetClickTag: 'TopGuide-PublicCloud-2',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/information-concernant-le-mode-de-facturation-cloud/',
          },
          {
            text: 'guide_project_4',
            atInternetClickTag: 'TopGuide-PublicCloud-4',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/augmenter-le-quota-public-cloud/',
          },
          {
            text: 'guide_project_5',
            atInternetClickTag: 'TopGuide-PublicCloud-5',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/creer-un-acces-a-horizon/',
          },
          {
            text: 'guide_project_6',
            atInternetClickTag: 'TopGuide-PublicCloud-6',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/demarrer-un-premier-serveur-cloud-en-3-min/',
          },
          {
            text: 'guide_project_7',
            atInternetClickTag: 'TopGuide-PublicCloud-7',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/preparer-lenvironnement-pour-utiliser-lapi-openstack/',
          },
          {
            text: 'guide_project_8',
            atInternetClickTag: 'TopGuide-PublicCloud-8',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/public-cloud/creer-et-configurer-un-disque-supplementaire-sur-une-instance/',
          },
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/public-cloud/',
          },
          {
            text: 'guide_project_apac_trafic',
            atInternetClickTag: 'TopGuide-PublicCloud-traffic-apac',
            isExternal: true,
            href: 'https://www.ovh.com/fr/public-cloud/faq/#trafficAPAC',
          },
        ],
      },
      VPS: {
        title: 'homepage_type_of_guide_vps',
        list: [
          {
            text: 'guide_vps_1',
            atInternetClickTag: 'TopGuide-VPS-1',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/debuter-avec-vps/',
          },
          {
            text: 'guide_vps_2',
            atInternetClickTag: 'TopGuide-VPS-2',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/conseils-securisation-vps/',
          },
          {
            text: 'guide_vps_3',
            atInternetClickTag: 'TopGuide-VPS-3',
            isExternal: true,
            href:
              'https://docs.ovh.com/fr/vps/repartitionner-vps-suite-upgrade/',
          },
          {
            text: 'guide_vps_4',
            atInternetClickTag: 'TopGuide-VPS-4',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/utilisation-kvm-sur-vps/',
          },
          {
            text: 'guide_vps_5',
            atInternetClickTag: 'TopGuide-VPS-5',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/windows-first-config/',
          },
          {
            text: 'guide_vps_6',
            atInternetClickTag: 'TopGuide-VPS-6',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/dedicated/ssh-introduction/',
          },
          {
            text: 'guide_vps_7',
            atInternetClickTag: 'TopGuide-VPS-7',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/root-password/',
          },
          {
            text: 'guide_vps_8',
            atInternetClickTag: 'TopGuide-VPS-8',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/mode-rescue-vps/',
          },
          {
            text: 'guide_vps_all',
            atInternetClickTag: 'TopGuide-VPS-all',
            isExternal: true,
            href: 'https://docs.ovh.com/fr/vps/',
          },
        ],
      },
    },
    EN: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_1',
            atInternetClickTag: 'TopGuide-PublicCloud-1',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/public-cloud/getting_started_with_public_cloud_logging_in_and_creating_a_project/',
          },
          {
            text: 'guide_project_5',
            atInternetClickTag: 'TopGuide-PublicCloud-5',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/',
          },
          {
            text: 'guide_project_6',
            atInternetClickTag: 'TopGuide-PublicCloud-6',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/public-cloud/start-a-first-cloud-server-within-3-min/',
          },
          {
            text: 'guide_project_7',
            atInternetClickTag: 'TopGuide-PublicCloud-7',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/public-cloud/prepare_the_environment_for_using_the_openstack_api/',
          },
          {
            text: 'guide_project_8',
            atInternetClickTag: 'TopGuide-PublicCloud-8',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/public-cloud/create_and_configure_an_additional_disk_on_an_instance/',
          },
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/public-cloud/',
          },
          {
            text: 'guide_project_apac_trafic',
            atInternetClickTag: 'TopGuide-PublicCloud-traffic-apac',
            isExternal: true,
            href: 'https://www.ovh.co.uk/public-cloud/faq/#trafficAPAC',
          },
        ],
      },
      VPS: {
        title: 'homepage_type_of_guide_vps',
        list: [
          {
            text: 'guide_vps_1',
            atInternetClickTag: 'TopGuide-VPS-1',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/getting-started-vps/',
          },
          {
            text: 'guide_vps_2',
            atInternetClickTag: 'TopGuide-VPS-2',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/tips-for-securing-a-vps/',
          },
          {
            text: 'guide_vps_3',
            atInternetClickTag: 'TopGuide-VPS-3',
            isExternal: true,
            href:
              'https://docs.ovh.com/gb/en/vps/repartitioning-vps-after-upgrade/',
          },
          {
            text: 'guide_vps_4',
            atInternetClickTag: 'TopGuide-VPS-4',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/use-kvm-for-vps/',
          },
          {
            text: 'guide_vps_5',
            atInternetClickTag: 'TopGuide-VPS-5',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/windows-first-config/',
          },
          {
            text: 'guide_vps_7',
            atInternetClickTag: 'TopGuide-VPS-7',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/root-password/',
          },
          {
            text: 'guide_vps_8',
            atInternetClickTag: 'TopGuide-VPS-8',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/rescue/',
          },
          {
            text: 'guide_vps_all',
            atInternetClickTag: 'TopGuide-VPS-9',
            isExternal: true,
            href: 'https://docs.ovh.com/gb/en/vps/',
          },
        ],
      },
    },
    EN_ASIA: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_1',
            atInternetClickTag: 'TopGuide-PublicCloud-1',
            href:
              'https://docs.ovh.com/asia/en/public-cloud/getting-started-with-public-cloud/',
          },
          {
            text: 'guide_project_5',
            atInternetClickTag: 'TopGuide-PublicCloud-5',
            href:
              'https://docs.ovh.com/asia/en/public-cloud/configure-user-access-to-horizon/',
          },
          {
            text: 'guide_project_6',
            atInternetClickTag: 'TopGuide-PublicCloud-6',
            href:
              'https://docs.ovh.com/asia/en/public-cloud/start-a-first-cloud-server-within-3-min/',
          },
          {
            text: 'guide_project_7',
            atInternetClickTag: 'TopGuide-PublicCloud-7',
            href:
              'https://docs.ovh.com/asia/en/public-cloud/prepare-environment-for-using-openstack-api/',
          },
          {
            text: 'guide_project_8',
            atInternetClickTag: 'TopGuide-PublicCloud-8',
            href:
              'https://docs.ovh.com/asia/en/public-cloud/create-and-configure-additional-disk-instance/',
          },
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            href: 'https://docs.ovh.com/asia/en/public-cloud/',
          },
          {
            text: 'guide_project_apac_trafic',
            atInternetClickTag: 'TopGuide-PublicCloud-traffic-apac',
            isExternal: true,
            href: 'https://www.ovh.com/asia/public-cloud/faq/#trafficAPAC',
          },
        ],
      },
      VPS: {
        title: 'homepage_type_of_guide_vps',
        list: [
          {
            text: 'guide_vps_1',
            atInternetClickTag: 'TopGuide-VPS-1',
            href: 'https://docs.ovh.com/asia/en/vps/getting-started-vps/',
          },
          {
            text: 'guide_vps_2',
            atInternetClickTag: 'TopGuide-VPS-2',
            href: 'https://docs.ovh.com/asia/en/vps/tips-for-securing-a-vps/',
          },
          {
            text: 'guide_vps_3',
            atInternetClickTag: 'TopGuide-VPS-3',
            href:
              'https://docs.ovh.com/asia/en/vps/repartitioning-vps-after-upgrade/',
          },
          {
            text: 'guide_vps_4',
            atInternetClickTag: 'TopGuide-VPS-4',
            href: 'https://docs.ovh.com/asia/en/vps/use-kvm-for-vps/',
          },
          {
            text: 'guide_vps_5',
            atInternetClickTag: 'TopGuide-VPS-5',
            href: 'https://docs.ovh.com/asia/en/vps/windows-first-config/',
          },
          {
            text: 'guide_vps_7',
            atInternetClickTag: 'TopGuide-VPS-7',
            href: 'https://docs.ovh.com/asia/en/vps/root-password/',
          },
          {
            text: 'guide_vps_8',
            atInternetClickTag: 'TopGuide-VPS-8',
            href: 'https://docs.ovh.com/asia/en/vps/rescue/',
          },
          {
            text: 'guide_vps_all',
            atInternetClickTag: 'TopGuide-VPS-9',
            href: 'https://docs.ovh.com/asia/en/vps/',
          },
        ],
      },
    },
    EN_AU: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_1',
            atInternetClickTag: 'TopGuide-PublicCloud-1',
            href:
              'https://docs.ovh.com/au/en/public-cloud/getting-started-with-public-cloud/',
          },
          {
            text: 'guide_project_5',
            atInternetClickTag: 'TopGuide-PublicCloud-5',
            href:
              'https://docs.ovh.com/au/en/public-cloud/configure-user-access-to-horizon/',
          },
          {
            text: 'guide_project_6',
            atInternetClickTag: 'TopGuide-PublicCloud-6',
            href:
              'https://docs.ovh.com/au/en/public-cloud/start-a-first-cloud-server-within-3-min/',
          },
          {
            text: 'guide_project_7',
            atInternetClickTag: 'TopGuide-PublicCloud-7',
            href:
              'https://docs.ovh.com/au/en/public-cloud/prepare-environment-for-using-openstack-api/',
          },
          {
            text: 'guide_project_8',
            atInternetClickTag: 'TopGuide-PublicCloud-8',
            href:
              'https://docs.ovh.com/au/en/public-cloud/create-and-configure-additional-disk-instance/',
          },
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            href: 'https://docs.ovh.com/au/en/public-cloud/',
          },
          {
            text: 'guide_project_apac_trafic',
            atInternetClickTag: 'TopGuide-PublicCloud-traffic-apac',
            isExternal: true,
            href: 'https://www.ovh.com.au/public-cloud/faq/#trafficAPAC',
          },
        ],
      },
      VPS: {
        title: 'homepage_type_of_guide_vps',
        list: [
          {
            text: 'guide_vps_1',
            atInternetClickTag: 'TopGuide-VPS-1',
            href: 'https://docs.ovh.com/au/en/vps/getting-started-vps/',
          },
          {
            text: 'guide_vps_2',
            atInternetClickTag: 'TopGuide-VPS-2',
            href: 'https://docs.ovh.com/au/en/vps/tips-for-securing-a-vps/',
          },
          {
            text: 'guide_vps_3',
            atInternetClickTag: 'TopGuide-VPS-3',
            href:
              'https://docs.ovh.com/au/en/vps/repartitioning-vps-after-upgrade/',
          },
          {
            text: 'guide_vps_4',
            atInternetClickTag: 'TopGuide-VPS-4',
            href: 'https://docs.ovh.com/au/en/vps/use-kvm-for-vps/',
          },
          {
            text: 'guide_vps_5',
            atInternetClickTag: 'TopGuide-VPS-5',
            href: 'https://docs.ovh.com/au/en/vps/windows-first-config/',
          },
          {
            text: 'guide_vps_7',
            atInternetClickTag: 'TopGuide-VPS-7',
            href: 'https://docs.ovh.com/au/en/vps/root-password/',
          },
          {
            text: 'guide_vps_8',
            atInternetClickTag: 'TopGuide-VPS-8',
            href: 'https://docs.ovh.com/au/en/vps/rescue/',
          },
          {
            text: 'guide_vps_all',
            atInternetClickTag: 'TopGuide-VPS-9',
            href: 'https://docs.ovh.com/au/en/vps/',
          },
        ],
      },
    },
    EN_SG: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_1',
            atInternetClickTag: 'TopGuide-PublicCloud-1',
            href:
              'https://docs.ovh.com/sg/en/public-cloud/getting-started-with-public-cloud/',
          },
          {
            text: 'guide_project_5',
            atInternetClickTag: 'TopGuide-PublicCloud-5',
            href:
              'https://docs.ovh.com/sg/en/public-cloud/configure-user-access-to-horizon/',
          },
          {
            text: 'guide_project_6',
            atInternetClickTag: 'TopGuide-PublicCloud-6',
            href:
              'https://docs.ovh.com/sg/en/public-cloud/start-a-first-cloud-server-within-3-min/',
          },
          {
            text: 'guide_project_7',
            atInternetClickTag: 'TopGuide-PublicCloud-7',
            href:
              'https://docs.ovh.com/sg/en/public-cloud/prepare-environment-for-using-openstack-api/',
          },
          {
            text: 'guide_project_8',
            atInternetClickTag: 'TopGuide-PublicCloud-8',
            href:
              'https://docs.ovh.com/sg/en/public-cloud/create-and-configure-additional-disk-instance/',
          },
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            href: 'https://docs.ovh.com/sg/en/public-cloud/',
          },
          {
            text: 'guide_project_apac_trafic',
            atInternetClickTag: 'TopGuide-PublicCloud-traffic-apac',
            isExternal: true,
            href: 'https://www.ovh.com/sg/public-cloud/faq/#trafficAPAC',
          },
        ],
      },
      VPS: {
        title: 'homepage_type_of_guide_vps',
        list: [
          {
            text: 'guide_vps_1',
            atInternetClickTag: 'TopGuide-VPS-1',
            href: 'https://docs.ovh.com/sg/en/vps/getting-started-vps/',
          },
          {
            text: 'guide_vps_2',
            atInternetClickTag: 'TopGuide-VPS-2',
            href: 'https://docs.ovh.com/sg/en/vps/tips-for-securing-a-vps/',
          },
          {
            text: 'guide_vps_3',
            atInternetClickTag: 'TopGuide-VPS-3',
            href:
              'https://docs.ovh.com/sg/en/vps/repartitioning-vps-after-upgrade/',
          },
          {
            text: 'guide_vps_4',
            atInternetClickTag: 'TopGuide-VPS-4',
            href: 'https://docs.ovh.com/sg/en/vps/use-kvm-for-vps/',
          },
          {
            text: 'guide_vps_5',
            atInternetClickTag: 'TopGuide-VPS-5',
            href: 'https://docs.ovh.com/sg/en/vps/windows-first-config/',
          },
          {
            text: 'guide_vps_7',
            atInternetClickTag: 'TopGuide-VPS-7',
            href: 'https://docs.ovh.com/sg/en/vps/root-password/',
          },
          {
            text: 'guide_vps_8',
            atInternetClickTag: 'TopGuide-VPS-8',
            href: 'https://docs.ovh.com/sg/en/vps/rescue/',
          },
          {
            text: 'guide_vps_all',
            atInternetClickTag: 'TopGuide-VPS-9',
            href: 'https://docs.ovh.com/sg/en/vps/',
          },
        ],
      },
    },
    US: {
      PROJECT: {
        title: 'homepage_type_of_guide_pci',
        list: [
          {
            text: 'guide_project_all',
            atInternetClickTag: 'TopGuide-PublicCloud-all',
            isExternal: true,
            href: 'https://support.us.ovhcloud.com/hc/en-us',
          },
        ],
      },
    },
  });
