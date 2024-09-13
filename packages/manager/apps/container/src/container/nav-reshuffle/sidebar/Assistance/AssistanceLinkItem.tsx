import { Node } from '../navigation-tree/node';
import { FunctionComponent } from 'react';
import style from '../style.module.scss';
import SidebarLink from '../SidebarLink';
import { SvgIconWrapper } from '@ovh-ux/ovh-product-icons/utils/SvgIconWrapper';

export type Props = {
    node: Node;
    isSelected: boolean;
}

export const AssistanceLinkItem: FunctionComponent<Props> = ({ node, isSelected }) => {
    return (
        <li className={`flex px-3 align-items-center ${isSelected ? style.sidebar_menu_items_selected : ''} ${style.sidebar_menu_items}`} role="menuitem" data-testid="assistance-link-item">
            <SvgIconWrapper name={node.svgIcon} height={24} width={24} className='fill-white block mr-1' />
            <SidebarLink
                handleOnClick={node.onClick}
                node={node}
            />
        </li>
    )
}