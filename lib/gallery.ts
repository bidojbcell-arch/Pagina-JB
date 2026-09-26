export function previousImageIndex(current: number, count: number): number {
  return (current - 1 + count) % count;
}

export function nextImageIndex(current: number, count: number): number {
  return (current + 1) % count;
}
