export interface IUxComponentOptions {
  visible?: boolean;
}

export interface IUxComponent {
  toggleVisibility: () => void;
  show: () => void;
  hide: () => void;
  getVisibility: () => boolean;
  onVisibilityChange: (callback: CallableFunction) => void;
}

export class UXComponent implements IUxComponent {
  private visible: boolean;

  protected listeners: CallableFunction[] = [];

  constructor(options: IUxComponentOptions = {}) {
    this.visible = options.visible || false;
  }

  public reset(options: IUxComponentOptions = {}) {
    this.setVisibility(options.visible || false);
  }

  public setVisibility = (visibility: boolean) => {
    this.visible = visibility;
    this.triggerListeners();
  };

  public toggleVisibility(): void {
    this.setVisibility(!this.visible);
  }

  public show(): void {
    this.setVisibility(true);
  }

  public hide(): void {
    this.setVisibility(false);
  }

  public getVisibility(): boolean {
    return this.visible;
  }

  public onVisibilityChange(callback: CallableFunction): void {
    this.listeners.push(callback);
  }

  private triggerListeners() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}
