import React, { FunctionComponent } from "react";
import { Tooltip } from "react-tooltip";

type Props = {
    children: React.ReactNode,
    content: string,
    id: string,
};

export const ShortSidebarLinkTooltip: FunctionComponent<Props> = ({
    content,
    children,
    id
}) => {

    const tooltipId = `SidebarLinkTooltip_${id}`;

    return (
        <>
            <span id={tooltipId}>
                {children}
            </span>
            <Tooltip
                anchorSelect={`#${tooltipId}`}
                content={content}
                className="bg-white !text-[--ods-color-primary-800] z-[99999]"
                place="right"
                positionStrategy="fixed"
            />
        </>
    );
};
