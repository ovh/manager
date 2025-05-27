export function kebabToSnake(name: string) {
  return name.replace(/-/g, '_').toLowerCase();
}
