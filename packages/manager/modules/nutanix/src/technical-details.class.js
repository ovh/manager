export default class TechnicalDetails {
  constructor(technicalDetails) {
    Object.assign(this, technicalDetails);
  }

  get memoryCapacity() {
    const ram = this.memory;
    if (!ram) {
      return '-';
    }
    const freqUnit = 'Ghz';
    const gbTranslated = 'Gb';
    const ramSize = ram.size ? `${ram.size} ${gbTranslated}` : '';
    const ramType = ram.type ?? '';
    const ramECC = ram.ecc ? 'ECC' : '';
    const ramFrequency = ram.frequency ? `${ram.frequency} ${freqUnit}` : '';
    return `${ramSize} ${ramType} ${ramECC} ${ramFrequency}`;
  }

  get cpu() {
    const cpu = this.server?.cpu;
    if (!cpu) {
      return '-';
    }
    const freqUnit = 'GHz';
    const cpuNumber = cpu.number ?? 1;
    const cpuBrand = cpu.brand ?? '';
    const cpuModel = cpu.model ?? '';
    const cpuCores = cpu.cores ? `${cpu.cores}c` : '';
    const cpuThreads = cpu.threads ? `${cpu.cores && '/'}${cpu.threads}t` : '';
    const cpuFrequency = cpu.frequency ? `${cpu.frequency} ${freqUnit}` : '';
    const cpuBoost =
      cpu.boost !== cpu.frequency ? `/${cpu.boost} ${freqUnit}` : '';
    return `${
      cpuNumber > 1 ? `${cpuNumber}x` : ''
    } ${cpuBrand} ${cpuModel} - ${cpuCores}${cpuThreads} - ${cpuFrequency}${cpuBoost}`;
  }

  get storageCapacity() {
    return this.storage.disks
      .map((disk) => `${disk.number}x ${disk.technology} ${disk.interface}`)
      .join(', ');
  }
}
