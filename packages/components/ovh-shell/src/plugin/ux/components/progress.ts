interface IProgressComponent {
  start(): void;
  stop(): void;
  onStart(callback: CallableFunction): void;
  onStop(callback: CallableFunction): void;
}

export class UxProgress implements IProgressComponent {
  protected started = false;

  protected startListeners: CallableFunction[] = [];

  protected stopListeners: CallableFunction[] = [];

  start(): void {
    this.started = true;
    this.triggerStartListeners();
  }

  stop(): void {
    this.started = false;
    this.triggerStoptListeners();
  }

  onStart(callback: CallableFunction): void {
    this.startListeners.push(callback);
  }

  onStop(callback: CallableFunction): void {
    this.stopListeners.push(callback);
  }

  protected triggerStartListeners() {
    this.startListeners.forEach((listener) => {
      listener();
    });
  }

  protected triggerStoptListeners() {
    this.stopListeners.forEach((listener) => {
      listener();
    });
  }
}

export default UxProgress;
