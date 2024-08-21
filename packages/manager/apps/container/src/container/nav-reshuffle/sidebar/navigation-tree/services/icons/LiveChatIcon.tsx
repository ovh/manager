import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const LiveChatIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="LiveChat_icon" data-name="LiveChat icon" xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 20 17" >
        {props.title && <title>{props.title}</title>}
        <path className={style.icon_cls_1} d="M10 2C5.33329 2 2.00001 4.90561 2.00001 8C2.00001 9.06324 2.37282 10.0773 3.05708 10.9703C3.24956 11.2215 3.31178 11.5489 3.22484 11.8532L2.49764 14.3984L5.5666 13.2942C5.79627 13.2116 6.04823 13.2158 6.275 13.3061C7.38319 13.7472 8.6493 14 10 14C14.6667 14 18 11.0944 18 8C18 4.90561 14.6667 2 10 2ZM8.53321e-06 8C8.53321e-06 3.3624 4.7256 0 10 0C15.2744 0 20 3.3624 20 8C20 12.6376 15.2744 16 10 16C8.54264 16 7.15266 15.7516 5.89671 15.301L1.33858 16.9409C0.985531 17.068 0.591086 16.9867 0.31703 16.7304C0.0429747 16.4742 -0.0645705 16.086 0.0385062 15.7253L1.16946 11.767C0.431003 10.657 8.53321e-06 9.37492 8.53321e-06 8Z" />
    </svg>
)

export default LiveChatIcon;
