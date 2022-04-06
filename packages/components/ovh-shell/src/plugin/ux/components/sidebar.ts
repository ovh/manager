import { UXComponent, IUxComponent } from './component';

interface ISidebar extends IUxComponent {
  enableToggle: () => void;
  disableToggle: () => void;
  setForceLargeScreenDisplay: (v: boolean) => void;
  isToggleAllowed: () => boolean;
}

export default class Sidebar extends UXComponent implements ISidebar {
  private allowToggle?: boolean;
  private forceLargeScreenDisplay?: boolean;

  constructor() {
    super({ visible: false });
    this.allowToggle = true;
    this.forceLargeScreenDisplay = false;
  }

  public isToggleAllowed(): boolean {
    return this.allowToggle;
  }

  public enableToggle(): void {
    this.allowToggle = true;
  }

  public disableToggle(): void {
    this.allowToggle = false;
  }

  public setForceLargeScreenDisplay(v: boolean): void {
    this.forceLargeScreenDisplay = v;
  }

  public isLargeScreenDisplayForced(): boolean {
    return this.forceLargeScreenDisplay;
  }

  public onSidebarVisibilityChange(callback: CallableFunction): void {
    this.listeners.push(callback);
  }
}
