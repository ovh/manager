export const IP_SEPARATOR = '.';
export const BLOCK_SEPARATOR = '/';
export const BLOCK_MAX = 32;

export default class IpBlock {
  constructor(value) {
    this.update(value);
    this.isEditing = false;
    this.isLoading = false;
  }

  get text() {
    const { ip, block } = this;
    return ip && block ? `${ip} ${BLOCK_SEPARATOR} ${block}` : '';
  }

  get value() {
    const { ip, block } = this;
    return ip && block ? ip + BLOCK_SEPARATOR + block : '';
  }

  get oldValue() {
    const { $ip, $block } = this;
    return $ip && $block ? $ip + BLOCK_SEPARATOR + $block : '';
  }

  get canSave() {
    const { isBlockValid, isIpValid, isNew, value, oldValue } = this;
    return isBlockValid && isIpValid && (isNew || value !== oldValue);
  }

  get isIpValid() {
    const parts = this.ip?.split(IP_SEPARATOR) || [];
    return (
      parts.length === 4 &&
      parts.filter(Boolean).length === 4 &&
      parts.map(Number).every((p) => p >= 0 && p <= 255) &&
      parts.reduce((sum, p) => sum + p, 0) > 0
    );
  }

  get isBlockValid() {
    const block = Number(this.block);
    return block >= 0 && block <= BLOCK_MAX;
  }

  update(value) {
    const [ip, block = BLOCK_MAX] = value?.split(BLOCK_SEPARATOR) || [];
    this.ip = ip;
    this.$ip = ip;
    this.block = block;
    this.$block = block;
    this.isNew = !value;
    this.id = this.isNew ? 'new' : this.value;
    return this;
  }

  startEdition() {
    this.isEditing = true;
    this.$ip = this.ip;
    this.$block = this.block;
    return this;
  }

  cancelEdition() {
    this.isEditing = false;
    this.ip = this.$ip;
    this.block = this.$block;
    return this;
  }

  startLoading() {
    this.isLoading = true;
    return this;
  }

  stopLoading() {
    this.isLoading = false;
    return this;
  }
}
