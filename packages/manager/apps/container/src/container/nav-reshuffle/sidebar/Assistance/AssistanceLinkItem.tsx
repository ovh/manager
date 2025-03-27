import { Node } from '../navigation-tree/node';
import { FunctionComponent } from 'react';
import style from '../style.module.scss';
import SidebarLink from '../SidebarLink';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';

export type Props = {
    node: Node;
    isSelected: boolean;
    isLoading: boolean;
}

export const AssistanceLinkItem: FunctionComponent<Props> = ({ node, isSelected, isLoading }) => {
    return (
        <li className={`flex align-items-center whitespace-nowrap ${isSelected ? style.sidebar_menu_items_selected : ''} ${style.sidebar_menu_items}`} role="menuitem" data-testid="assistance-link-item">
            {isLoading ? <OsdsSkeleton randomized className='mx-8' /> : <SidebarLink
                handleOnClick={node.onClick}
                node={node}
            />}
        </li>
    )
}