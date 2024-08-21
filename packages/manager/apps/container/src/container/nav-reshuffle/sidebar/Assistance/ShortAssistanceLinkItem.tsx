import { useTranslation } from 'react-i18next';
import { Node } from '../navigation-tree/node';
import style from '../style.module.scss';
import { FunctionComponent } from 'react';
import { useShell } from '@/context';

type Props = {
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

    const Icon = node.iconNode;

    return (
        <li className={`flex p-1 justify-center ${isSelected ? style.sidebar_menu_items_selected : ''} ${style.sidebar_menu_items}`} role="menuitem" >
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
                <Icon className='fill-white size-[24px] block' />
            </a>
        </li>
    )
}