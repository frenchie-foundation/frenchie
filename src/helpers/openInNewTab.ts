export default function openInNewTab(url: string): void {
  window.open(url, '_blank')?.focus();
}
