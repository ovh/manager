import React, { FunctionComponent } from "react";
import { Tooltip } from "react-tooltip";

type Props = { 
    children: React.ReactNode, 
    content: string 
};

export const ShortSidebarLinkTooltip: FunctionComponent<Props> = ({
    content,
    children
}) => {

    const id = 'SidebarLinkTooltip';

    return (
        <>
            <span data-tooltip-id={id}
                data-tooltip-position-strategy={'fixed'}
                data-tooltip-content={content}
                data-tooltip-place="right"
            >
                {children}
            </span>
            <Tooltip
                id={id}
                style={{
                    backgroundColor: 'white',
                    color: '#4d5592',
                    opacity: 1,
                    boxShadow: '0px 0px 1rem rgba(0, 0, 0, 0.25)',
                    zIndex: 99999,
                }}
            />
        </>
    );
};
