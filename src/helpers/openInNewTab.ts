export function openInNewTab(url: string): void {
  window.open(url, '_blank')?.focus();
}

export function openLink(url: string): void {
  window.open(url, '_self')?.focus();
}
