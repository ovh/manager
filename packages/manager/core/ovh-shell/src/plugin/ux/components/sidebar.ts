import { UXComponent, IUxComponent } from './component';

interface ISidebar extends IUxComponent {
  enableToggle: () => void;
  disableToggle: () => void;
  setForceLargeScreenDisplay: (isForced: boolean) => void;
  isToggleAllowed: () => boolean;
}

export default class Sidebar extends UXComponent implements ISidebar {
  private allowToggle?: boolean;

  private forceLargeScreenDisplay?: boolean;

  constructor() {
    super({ visible: false });
    this.reset();
  }

  public reset() {
    this.enableToggle();
    this.setForceLargeScreenDisplay(false);
    super.reset({ visible: false });
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

  public setForceLargeScreenDisplay(isForced: boolean): void {
    this.forceLargeScreenDisplay = isForced;
  }

  public isLargeScreenDisplayForced(): boolean {
    return this.forceLargeScreenDisplay;
  }

  public onSidebarVisibilityChange(callback: CallableFunction): void {
    this.listeners.push(callback);
  }
}
