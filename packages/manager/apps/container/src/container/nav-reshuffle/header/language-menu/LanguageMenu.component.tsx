import { OsdsButton, OsdsIcon, OsdsMenu, OsdsMenuGroup, OsdsMenuItem, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';
import { useShell } from '@/context';

type Props = {
    onChange(show: boolean): void;
    setUserLocale(locale: string): void;
    userLocale?: string;
};

export const LanguageMenu: FunctionComponent<Props> = ({
    onChange,
    setUserLocale,
    userLocale = '',
}) => {
    const { i18n } = useTranslation('language');
    const ref = useRef<any>();
    const shell = useShell();
    const trackingPlugin = shell.getPlugin('tracking');
    const isSmallDevice = useMediaQuery({
        query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
    });
    const { t } = useTranslation('language');
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    useEffect(() => {
        const shadowRoot = ref.current?.shadowRoot;
        if (shadowRoot) {
            const surfaceElement = shadowRoot.querySelector('ocdk-surface');
            if (surfaceElement) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (
                            mutation.type === 'attributes' &&
                            mutation.attributeName === 'opened'
                        ) {
                            const isOpened = surfaceElement.hasAttribute('opened');
                            onChange(isOpened);
                        }
                    });
                });
                observer.observe(surfaceElement, { attributes: true });
                return () => observer.disconnect();
            }
        }
    }, [availableLanguages]);

    useEffect(() => {
        setCurrentLanguage(
            shell
                .getPlugin('i18n')
                .getAvailableLocales()
                .find(({ key }: { key: string }) => key === userLocale),
        );

        setAvailableLanguages(
            shell
                .getPlugin('i18n')
                .getAvailableLocales()
                .filter(({ key }: { key: string }) => key !== userLocale),
        );
    }, [userLocale]);

    const onLocaleChange = (locale: string) => {
        shell.getPlugin('i18n').setLocale(locale);
        setUserLocale(locale);
        trackingPlugin.trackClick({
            name: `topnav::language_selector::switch_to_${locale}`,
            type: 'action',
        });
        i18n.changeLanguage(locale);
    };

    const getLanguageLabel = () => {
        if (currentLanguage) {
            return isSmallDevice
                ? currentLanguage.key.slice(-2)
                : currentLanguage.name;
        }
        return '';
    };

    if (!currentLanguage && availableLanguages.length === 0) {
        return <div></div>;
    }

    return (
        <OsdsMenu ref={ref}>
            <OsdsButton slot='menu-title' size={ODS_BUTTON_SIZE.sm} color={ODS_THEME_COLOR_INTENT.primary} variant={ODS_BUTTON_VARIANT.ghost}>
                {getLanguageLabel()}
                {!isSmallDevice && (<span slot='end'>
                    <OsdsIcon name={ODS_ICON_NAME.CHEVRON_DOWN} size={ODS_ICON_SIZE.xxs} color={ODS_THEME_COLOR_INTENT.primary} />
                </span>)}
            </OsdsButton>
            <OsdsMenuGroup className='w-60'>
                <OsdsText>{t('language_change')}</OsdsText>
            </OsdsMenuGroup>
            {availableLanguages.map(({ name, key }) => (
                <OsdsMenuItem key={key}>
                    <OsdsButton onClick={() => {
                        onLocaleChange(key);
                    }} color={ODS_THEME_COLOR_INTENT.primary} size={ODS_BUTTON_SIZE.sm} variant={ODS_BUTTON_VARIANT.ghost} text-align='start'>
                        <span>{name}</span>
                    </OsdsButton>
                </OsdsMenuItem>
            ))}
        </OsdsMenu>
    );
}
