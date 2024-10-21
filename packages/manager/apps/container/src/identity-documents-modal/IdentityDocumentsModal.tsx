import { kycIndiaModalLocalStorageKey, kycIndiaFeature, requiredStatusKey } from "./constants";
import { useIdentityDocumentsStatus } from "@/hooks/useIdentityDocumentsStatus";
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useFeatureAvailability } from "@ovh-ux/manager-react-components";
import { useTranslation, Trans } from 'react-i18next';
import { useLocalStorage } from "react-use";
import { useShell } from "@/context";
import {
    OsdsButton,
    OsdsCollapsible,
    OsdsModal,
    OsdsText,
} from '@ovhcloud/ods-components/react';
import {
    ODS_THEME_COLOR_HUE,
    ODS_THEME_COLOR_INTENT,
    ODS_THEME_TYPOGRAPHY_LEVEL,
    ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';

export const IdentityDocumentsModal: FunctionComponent = () => {
    const shell = useShell();
    const navigationPlugin = shell.getPlugin('navigation');
    const [storage, setStorage] = useLocalStorage<boolean>(kycIndiaModalLocalStorageKey);

    const { t } = useTranslation('identity-documents-modal');
    const legalInformationRef = useRef<any>(null);

    const [showModal, setShowModal] = useState<boolean>(false);

    const availabilityDataResponse = useFeatureAvailability([kycIndiaFeature]);
    const availability = availabilityDataResponse?.data;

    const { data: statusDataResponse } = useIdentityDocumentsStatus({
        enabled: Boolean(availability && availability[kycIndiaFeature] && !storage)
    });

    const onCancel = () => {
        setShowModal(false);
        setStorage(true);
    }

    const onConfirm = () => {
        setShowModal(false);
        setStorage(true);
        navigationPlugin.navigateTo(
            'dedicated',
            `#/identity-documents`,
        );
    }

    useEffect(() => {
        if (statusDataResponse?.data?.status === requiredStatusKey) {
            setShowModal(true);
        }
    }, [statusDataResponse?.data?.status])

    return showModal && (
        <OsdsModal
            dismissible={false}
            onOdsModalClose={onCancel}
        >
            <div className="my-2 text-center">
                <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                    color={ODS_THEME_COLOR_INTENT.text}
                    hue={ODS_THEME_COLOR_HUE._800}
                >{t('identity_documents_modal_title')}</OsdsText>
            </div>
            <div className="my-2 text-center">
                <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    hue={ODS_THEME_COLOR_HUE._800}
                >
                    {t('identity_documents_modal_description')}
                </OsdsText>
            </div>
            <div className="my-1 text-center">
                <OsdsButton
                    slot="actions"
                    size={ODS_BUTTON_SIZE.sm}
                    variant={ODS_BUTTON_VARIANT.flat}
                    inline={true}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    onClick={onConfirm}
                >
                    {t('identity_documents_modal_button_start')}

                </OsdsButton>
            </div>
            <div className="my-1 text-center">
                <OsdsButton
                    slot="actions"
                    onClick={onCancel}
                    inline={true}
                    size={ODS_BUTTON_SIZE.sm}
                    variant={ODS_BUTTON_VARIANT.ghost}

                    color={ODS_THEME_COLOR_INTENT.primary}
                >
                    {t('identity_documents_modal_button_later')}
                </OsdsButton>
            </div>
            <div className="my-1 text-center">
                <OsdsText
                    level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    className="cursor-pointer underline"
                    hue={ODS_THEME_COLOR_HUE._800}
                    onClick={() => {
                        legalInformationRef.current.opened = !legalInformationRef?.current?.opened;
                    }}
                >
                    {t('identity_documents_modal_more_info')}
                </OsdsText>
                <OsdsCollapsible ref={legalInformationRef}>
                    <OsdsText
                        level={ODS_THEME_TYPOGRAPHY_LEVEL.caption}
                        color={ODS_THEME_COLOR_INTENT.info}
                        hue={ODS_THEME_COLOR_HUE._800}>
                        <Trans
                            t={t}
                            i18nKey="identity_documents_modal_legal_information"
                        ></Trans>
                    </OsdsText>
                </OsdsCollapsible>
            </div>
        </OsdsModal>
    )
}