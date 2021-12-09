export interface IUxComponentOptions {
  visible?: boolean;
}

export interface IUxComponent {
  toggleVisibility: () => void;
  show: () => void;
  hide: () => void;
  getVisibility: () => boolean;
}

export class UXComponent implements IUxComponent {
  private visible: boolean;

  constructor(options: IUxComponentOptions = {}) {
    this.visible = options.visible || false;
  }

  public setVisibility = (visibility: boolean) => {
    this.visible = visibility;
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
}
