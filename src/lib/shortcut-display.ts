const WINDOWS_NOTE = 'Windowsの場合は';

function appendWindowsShortcut(
  text: string,
  sourceLabel: 'Cmd' | 'Option',
  targetLabel: 'Ctrl' | 'Alt'
): string {
  const regex = new RegExp(
    `${sourceLabel}\\+([A-Za-z0-9\`,]+(?:\\+[A-Za-z0-9\`,]+)*)`,
    'g'
  );

  return text.replace(regex, (full, keys, offset, original) => {
    const tail = original.slice(offset + full.length, offset + full.length + 40);
    if (tail.includes(WINDOWS_NOTE) || tail.includes(targetLabel)) {
      return full;
    }
    return `${full}（${WINDOWS_NOTE}${targetLabel}+${keys}）`;
  });
}

export function withWindowsShortcuts(text: string): string {
  const withCtrl = appendWindowsShortcut(text, 'Cmd', 'Ctrl');
  return appendWindowsShortcut(withCtrl, 'Option', 'Alt');
}
