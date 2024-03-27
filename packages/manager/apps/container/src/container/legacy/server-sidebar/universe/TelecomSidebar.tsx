import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReket } from '@ovh-ux/ovh-reket';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash-es';
import { useShell } from '@/context';
import { sanitizeMenu, SidebarMenuItem } from '../sidebarMenu';
import Sidebar from '../Sidebar';
import style from '../index.module.scss';
import useServiceLoader from "./useServiceLoader";
import telecomShopConfig from '../order/shop-config/telecom';
import OrderTrigger from '../order/OrderTrigger';
import { ShopItem } from '../order/OrderPopupContent';
import  getIcon  from './GetIcon';



const features = [
  'sms',
  'sms:order',
  'sms:hlr',
  'fax',
  'overthebox',
  'pack',
  'telephony',
];

export default function TelecomSidebar() {
  const [menu, setMenu] = useState<SidebarMenuItem>(undefined);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const shell = useShell();
  const reketInstance = useReket();
  const { loadServices } = useServiceLoader('telecom');
  const { t, i18n } = useTranslation('sidebar');
  const navigation = shell.getPlugin('navigation');
  const environment = shell.getPlugin('environment').getEnvironment();
  const { ovhSubsidiary, isTrusted } = environment.getUser();
  const region = environment.getRegion();

  const getBetaPreference = () =>
    new Promise((resolve, reject) => {
      const key = 'ACCOUNT_BETA_FEATURES';
      if (window.localStorage && window.localStorage.getItem(key) !== null) {
        resolve(['1', 'true'].includes(window.localStorage.getItem(key)));
      } else {
        reketInstance
          .get(`/me/preferences/manager/${key}`)
          .then((result: any) => {
            resolve(result?.value || false);
          })
          .catch((error: any) => {
            if (error.status === 404) {
              resolve(false);
            } else {
              reject(error);
            }
          });
      }
    });

  const { data: isBeta, isLoading: betaPreferenceLoading } = useQuery({
    queryKey: ['sidebar-telecom-beta'],
    queryFn: getBetaPreference
  });

  const getTelecomMenu = (feature: Record<string, string>) => {
    const menu = [];

    menu.push({
      id: 'telecom-v4',
      icon: getIcon('ovh-font ovh-font-backToV4'),
      label: t('sidebar_telecom_v4'),
      href: 'https://www.ovh.com/managerv3/telephony2-main.pl',
      isExternal: true,
    });

    if (feature.pack) {
      menu.push({
        id: 'xdsl',
        label: t('sidebar_internet'),
        icon: getIcon('ovh-font ovh-font-telecom-ethernet'),
        routeMatcher: new RegExp(`^/pack`),
        ...(isBeta
          ? {
              href: navigation.getURL('telecom', '#/pack'),
            }
          : {
              async loader() {
                const xdslPack = await loadServices('/pack/xdsl');
                const xdslStandalone = await loadServices('/xdsl/standalone');
                return [
                  ...xdslPack.map((xdsl) => ({
                    ...xdsl,
                    icon: <span className={style.telecomLabel}>Pack</span>,
                    routeMatcher: new RegExp(`/pack/${xdsl.serviceName}`),
                    async loader() {
                      const services = await loadServices(
                        `/pack/xdsl/${xdsl.serviceName}/xdslAccess/services`,
                      );
                      const servicesLoaded = services.map((service) => ({
                        ...service,
                        label: service.label || service.serviceName,
                        keywords: service.extraParams?.length
                          ? service.extraParams[0]
                          : '',
                        icon: service.extraParams?.length && (
                          <span className={style.telecomLabel}>
                            {capitalize(service.extraParams[0])}
                          </span>
                        ),
                      }));
                      return servicesLoaded;
                    },
                  })),
                  ...xdslStandalone.map((sdsl) => {
                    return {
                      ...sdsl,
                      href: undefined,
                      async loader() {
                        return loadServices(
                          `/xdsl/sdsl/xdsl/${sdsl.serviceName}/lines`,
                        );
                      },
                    };
                  }),
                ];
              },
            }),
      });
    }

    if (feature.telephony) {
      menu.push({
        id: 'voip',
        label: t('sidebar_telephony'),
        icon: getIcon('ovh-font ovh-font-phone'),
        routeMatcher: new RegExp(`^/telephony`),
        ...(isBeta
          ? {
              href: navigation.getURL('telecom', '#/telephony'),
            }
          : {
              async loader() {
                const voips = await loadServices('/telephony');
                return [
                  {
                    id: 'voip-repayments',
                    href: navigation.getURL(
                      'telecom',
                      '#/telephony/repayments',
                    ),
                    icon: getIcon('oui-icon oui-icon-receipt_concept'),
                    label: t('sidebar_telephony_repayments'),
                    ignoreSearch: true,
                  },
                  ...voips.map((voip: SidebarMenuItem) => ({
                    ...voip,
                    routeMatcher: new RegExp(`^/telephony/${voip.serviceName}`),
                    async loader() {
                      const services = await loadServices(
                        `/telephony/${voip.serviceName}/services`,
                      );
                      return services
                        .sort((a, b) => {
                          const aType = a.extraParams?.type.replace(
                            'fax',
                            'zfax',
                          );
                          const bType = b.extraParams?.type.replace(
                            'fax',
                            'zfax',
                          );
                          if (aType && bType) {
                            if (aType === bType) {
                              return a.label.localeCompare(b.label);
                            }
                            return aType.localeCompare(bType);
                          }
                          return a.label.localeCompare(b.label);
                        })
                        .map((service) => ({
                          ...service,
                          keywords: service.extraParams?.type + service.searchParams?.toString(),
                          icon: service.extraParams?.type && (
                            <span className={style.telecomLabel}>
                              {t([
                                `sidebar_telephony_type_${service.extraParams?.type}`,
                                service.extraParams?.type,
                              ])}
                            </span>
                          ),
                        }));
                    },
                  })),
                ];
              },
            }),
      });
    }

    if (feature.sms) {
      menu.push({
        id: 'sms',
        label: t('sidebar_telephony_sms'),
        icon: getIcon('ovh-font ovh-font-message'),
        routeMatcher: new RegExp(`^/sms`),
        ...(isBeta
          ? {
              href: navigation.getURL('telecom', '#/sms'),
            }
          : {
              async loader() {
                return loadServices('/sms');
              },
            }),
      });
    }

    if (feature.fax) {
      menu.push({
        id: 'freefax',
        label: t('sidebar_telephony_fax'),
        icon: getIcon('ovh-font ovh-font-print'),
        routeMatcher: new RegExp(`^/freefax`),
        ...(isBeta
          ? {
              href: navigation.getURL('telecom', '#/freefax'),
            }
          : {
              async loader() {
                return loadServices('/freefax').then((services) =>
                  services.map((freefax: SidebarMenuItem) => ({
                    ...freefax,
                    icon: <span className={style.telecomLabel}>Perso</span>,
                  })),
                );
              },
            }),
      });
    }

    if (feature.overthebox) {
      menu.push({
        id: 'otb',
        label: t('sidebar_otb'),
        icon: getIcon('ovh-font ovh-font-overTheBox'),
        routeMatcher: new RegExp(`^/overTheBox`),
        ...(isBeta
          ? {
              href: navigation.getURL('telecom', '#/overTheBox'),
            }
          : {
              async loader() {
                return loadServices('/overTheBox');
              },
            }),
      });
    }

    menu.push({
      id: 'telecom-tasks',
      label: t('sidebar_telecom_operations'),
      icon: getIcon('ovh-font ovh-font-tasks'),
      href: navigation.getURL('telecom', '#/task'),
      routeMatcher: new RegExp(`^/task`),
    });

    return menu;
  };

  const getFeatures = (): Promise<Record<string, string>> =>
    reketInstance.get(`/feature/${features.join(',')}/availability`, {
      requestType: 'aapi',
    });

  const { data: availability } = useQuery({
    queryKey: ['sidebar-telecom-availability'],
    queryFn: getFeatures,
  });

  useEffect(() => {
    if (availability && !betaPreferenceLoading) {
      setMenu(
        sanitizeMenu({
          id: 'telecom-sidebar',
          label: '',
          subItems: [...getTelecomMenu(availability)],
        }),
      );
      setShopItems(
        telecomShopConfig(navigation, region, ovhSubsidiary, availability),
      );
    }
  }, [availability, betaPreferenceLoading, i18n.language]);

  return (
    <>
      {!isTrusted && <OrderTrigger items={shopItems} />}
      <Sidebar menu={menu} />
    </>
  );
}
