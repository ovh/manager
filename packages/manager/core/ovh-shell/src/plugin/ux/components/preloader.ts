interface IPreloaderComponent {
  show(): void;
  hide(): void;
  onShow(callback: CallableFunction): void;
  removeOnSHow(callback: CallableFunction): void;
  onHide(callback: CallableFunction): void;
  removeOnHide(callback: CallableFunction): void;
}

export class UxPreloader implements IPreloaderComponent {
  protected showListeners: CallableFunction[] = [];

  protected hideListeners: CallableFunction[] = [];

  show(): void {
    this.triggerOnShowListeners();
  }

  onShow(callback: CallableFunction): void {
    this.showListeners.push(callback);
  }

  removeOnSHow(callback: CallableFunction): void {
    const index = this.showListeners.indexOf(callback);
    if (index) {
      this.hideListeners.splice(index, 1);
    }
  }

  protected triggerOnShowListeners() {
    this.showListeners.forEach((listener) => {
      listener();
    });
  }

  hide(): void {
    this.triggerOnHideListeners();
  }

  onHide(callback: CallableFunction): void {
    this.hideListeners.push(callback);
  }

  removeOnHide(callback: CallableFunction): void {
    const index = this.hideListeners.indexOf(callback);
    if (index) {
      this.hideListeners.splice(index, 1);
    }
  }

  protected triggerOnHideListeners() {
    this.hideListeners.forEach((listener) => {
      listener();
    });
  }
}

export default UxPreloader;
