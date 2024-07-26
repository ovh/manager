interface PointerEventProps extends EventInit {
  button: number;
  ctrlKey: boolean;
}
export class PointerEvent extends Event {
  button: number;

  ctrlKey: boolean;

  constructor(type: string, props: PointerEventProps) {
    super(type, props);
    if (props.button != null) {
      this.button = props.button;
    }
    if (props.ctrlKey != null) {
      this.ctrlKey = props.ctrlKey;
    }
  }
}
