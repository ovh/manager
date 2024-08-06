import React, { FunctionComponent } from "react";

type Props = {
    tooltip: string,
    text: string,
};

export const SidebarTooltipLink: FunctionComponent<Props> = ({
    tooltip,
    text,
}) => {
    return (
        <span title={tooltip}>
            {text}
        </span>
    );
};
