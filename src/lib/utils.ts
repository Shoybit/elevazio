export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Locale-aware number formatting, e.g. 1500 -> "1,500". */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}
