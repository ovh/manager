import { useTranslation } from 'react-i18next';
import { Node } from '../navigation-tree/node';
import { FunctionComponent } from 'react';
import { useShell } from '@/context';
import { OsdsLink, OsdsIcon } from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementRel, OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';

export type Props = {
    node: Node;
}

export const ShortAssistanceLinkItem: FunctionComponent<Props> = ({ node }) => {
    const { t } = useTranslation('sidebar');
    const shell = useShell();
    const navigation = shell.getPlugin('navigation');

    let url: string;

    if (node.routing) {
        url = navigation.getURL(
            node.routing.application,
            node.routing.hash || '#/',
        );
    } else if (node.url) {
        url = node.url as string;
    }


    return (
        <OsdsLink
            onClick={node.onClick}
            href={url}
            color={ODS_THEME_COLOR_INTENT.primary}
            target={node.isExternal ? OdsHTMLAnchorElementTarget._blank : OdsHTMLAnchorElementTarget._top}
            rel={node.isExternal ? OdsHTMLAnchorElementRel.noopener : undefined}
            id={node.id}
            role="link"
            className='block p-2'
        >
            {t(node.translation)}
            {node.isExternal && (
                <span slot='end'>
                    <OsdsIcon
                        name={ODS_ICON_NAME.EXTERNAL_LINK}
                        className='ml-1'
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                    />
                </span>
            )}
        </OsdsLink>
    )
}