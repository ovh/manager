import { useTranslation } from 'react-i18next';
import { Node } from '../navigation-tree/node';
import style from '../style.module.scss';
import { FunctionComponent } from 'react';
import { useShell } from '@/context';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';

export type Props = {
    node: Node;
    isSelected: boolean;
}

export const ShortAssistanceLinkItem: FunctionComponent<Props> = ({ node, isSelected }) => {
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
        <li className={`flex p-1 justify-center ${isSelected ? style.sidebar_menu_items_selected : ''} ${style.sidebar_menu_items}`} role="menuitem" data-testid={`short-assistance-link-item-${node.id}`}>
            <a
                onClick={node.onClick}
                href={url}
                target={node.isExternal ? '_blank' : '_top'}
                rel={node.isExternal ? 'noopener noreferrer' : ''}
                title={t(node.translation)}
                id={node.id}
                role="link"
                className='d-flex items-center justify-center'
            >
                <SvgIconWrapper name={node.svgIcon} height={24} width={24} className='fill-white block' />
            </a>
        </li>
    )
}