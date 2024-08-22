import { SvgIconProps } from "./icons.type";
import { FunctionComponent } from "react";
import style from "./style.module.scss";

const LeafIcon: FunctionComponent<SvgIconProps> = (props) => (
    <svg id="Leaf_icon" data-name="Leaf icon" xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 16 16" >
        {props.title && <title>{props.title}</title>}
<path className={style.icon_cls_1} d="M7.28571 11.92V9.13137L6.06635 7.76569C5.78741 7.45327 5.78741 6.94673 6.06635 6.63432C6.3453 6.3219 6.79756 6.3219 7.0765 6.63432L7.28571 6.86863V4.8C7.28571 4.35817 7.60551 4 8 4C8.39449 4 8.71429 4.35817 8.71429 4.8V8.46863L9.63778 7.43432C9.91672 7.1219 10.369 7.1219 10.6479 7.43432C10.9269 7.74674 10.9269 8.25327 10.6479 8.56569L8.71429 10.7314V11.92C10.3445 11.5494 11.5714 9.93517 11.5714 8C11.5714 6.58384 10.7768 4.95454 9.6883 3.54789C9.16708 2.87431 8.63187 2.32185 8.20553 1.95046C8.131 1.88554 8.06233 1.82837 8 1.77858C7.93767 1.82837 7.869 1.88554 7.79447 1.95046C7.36813 2.32185 6.83292 2.87431 6.3117 3.54789C5.22322 4.95454 4.42857 6.58384 4.42857 8C4.42857 9.93517 5.65554 11.5494 7.28571 11.92ZM7.28571 13.5433C4.86265 13.1551 3 10.8212 3 8C3 4 7.28571 0 8 0C8.71429 0 13 4 13 8C13 10.8212 11.1374 13.1551 8.71429 13.5433V15.2C8.71429 15.6418 8.39449 16 8 16C7.60551 16 7.28571 15.6418 7.28571 15.2V13.5433Z" />
       
    </svg>
)

export default LeafIcon;
