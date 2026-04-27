import { withWindowsShortcuts } from '@/lib/shortcut-display';

interface StepContentProps {
  content: string;
}

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match `code` or **bold**
  const regex = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(
        <code
          key={match.index}
          className="bg-bg-tertiary text-primary px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {match[1]}
        </code>
      );
    } else if (match[2] !== undefined) {
      nodes.push(
        <strong key={match.index} className="font-bold text-text-primary">
          {match[2]}
        </strong>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseLine(line: string, key: number): React.ReactNode {
  return <span key={key}>{parseInline(line)}</span>;
}

export default function StepContent({ content }: StepContentProps) {
  const normalizedContent = withWindowsShortcuts(content);
  // Split into paragraphs by double newline
  const paragraphs = normalizedContent.split('\n\n');

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const listItems: string[] = [];
        const beforeList: string[] = [];
        let inList = false;

        for (const line of lines) {
          if (line.startsWith('- ')) {
            inList = true;
            listItems.push(line.slice(2));
          } else {
            if (inList) {
              // Non-list line after list items — treat as after-list text
              beforeList.push(line);
            } else {
              beforeList.push(line);
            }
          }
        }

        return (
          <div key={pIdx} className={pIdx > 0 ? 'mt-2' : undefined}>
            {beforeList.length > 0 && !inList && (
              <p className="text-text-secondary leading-relaxed">
                {beforeList.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {parseLine(line, i)}
                  </span>
                ))}
              </p>
            )}
            {beforeList.length > 0 && inList && (
              <p className="text-text-secondary leading-relaxed mb-1">
                {beforeList.map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {parseLine(line, i)}
                  </span>
                ))}
              </p>
            )}
            {listItems.length > 0 && (
              <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-0.5 ml-1">
                {listItems.map((item, i) => (
                  <li key={i}>{parseInline(item)}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}
