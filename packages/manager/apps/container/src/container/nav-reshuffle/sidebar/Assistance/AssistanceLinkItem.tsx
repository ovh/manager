import { Node } from '../navigation-tree/node';
import { FunctionComponent } from 'react';
import style from '../style.module.scss';
import SidebarLink from '../SidebarLink';

type Props = {
    node: Node;
    isSelected: boolean;
}

export const AssistanceLinkItem: FunctionComponent<Props> = ({ node, isSelected }) => {
    return (
        <li className={`flex align-items-center ${isSelected ? style.sidebar_menu_items_selected : ''} ${style.sidebar_menu_items}`} role="menuitem" >
            <SidebarLink
                handleOnClick={node.onClick}
                node={node}
            />
        </li>
    )
}