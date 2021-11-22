export interface IUxComponentOptions {
  visible?: boolean;
}

export interface IUxComponent {
  toggleVisibility: CallableFunction;
  show: CallableFunction;
  hide: CallableFunction;
  getVisibility: CallableFunction;
}

const uxComponent = (options: IUxComponentOptions = {}): IUxComponent => {
  let visible = options.visible || false;

  const setVisibility = (visibility: boolean) => {
    visible = visibility;
  };

  const toggleVisibility = () => {
    setVisibility(!visible);
  };

  const show = () => {
    setVisibility(true);
  };

  const hide = () => {
    setVisibility(false);
  };

  const getVisibility = (): boolean => {
    return visible;
  };

  return {
    toggleVisibility,
    show,
    hide,
    getVisibility,
  };
};

export default uxComponent;
