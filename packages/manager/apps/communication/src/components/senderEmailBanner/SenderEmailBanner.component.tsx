import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
    OdsLink,
} from '@ovhcloud/ods-components/react';
import type { Subsidiary } from '@ovh-ux/manager-config';


const SENDER_EMAIL_ADDRESSES = 'sender-email-addresses';

const HELP_ROOT = " https://help.ovhcloud.com/csm"
export const HELP_URL: Partial<Record<Subsidiary, string>> = {
    DE: `${HELP_ROOT}/de-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0030035`,
    ES: `${HELP_ROOT}/es-es-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043067`,
    FR: `${HELP_ROOT}/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069#identifier-un-e-mail-de-phishing`,
    GB: `${HELP_ROOT}/en-gb-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043064`,
    IE: `${HELP_ROOT}/en-ie-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043341`,
    IT: `${HELP_ROOT}/it-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043072`,
    MA: `${HELP_ROOT}/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069`,
    NL: `${HELP_ROOT}/en-ie-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043341`,
    PL: `${HELP_ROOT}/pl-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043071`,
    PT: `${HELP_ROOT}/pt-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043070`,
    SN: `${HELP_ROOT}/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069`,
    TN: `${HELP_ROOT}/fr-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043069`,
    ASIA: `${HELP_ROOT}/asia-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043063`,
    AU: `${HELP_ROOT}/en-au-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043344}`,
    CA: `${HELP_ROOT}/en-ca-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043351`,
    QC: `${HELP_ROOT}/fr-ca-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043068`,
    SG: `${HELP_ROOT}/en-sg-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043062`,
    //WE: `${HELP_ROOT}/en${homeIndex}`,
    //WS: `${HELP_ROOT}/es${homeIndex}`,
    US: `${HELP_ROOT}/en-ie-account-scams-fraud-phishing?id=kb_article_view&sysparm_article=KB0043341`,
}

export default function SenderEmailBanner() {
    const shell = useContext(ShellContext);
    const { ovhSubsidiary } = shell.environment.getUser();

    const { t } = useTranslation('communications');
    const {
        data: availability,
    } = useFeatureAvailability([SENDER_EMAIL_ADDRESSES]);

    return availability?.[SENDER_EMAIL_ADDRESSES] &&
        <div className='mb-4'>
            <OdsMessage isDismissible={false} color="warning">
                <span className="mr-2">{t('sender_email_banner_text')}</span>
                <OdsLink
                    href={HELP_URL?.[ovhSubsidiary] || HELP_ROOT}
                    label={t('sender_email_banner_link')}
                />
            </OdsMessage>
        </div> || null;
}
