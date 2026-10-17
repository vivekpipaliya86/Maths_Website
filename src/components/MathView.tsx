import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<code class="font-mono text-sm">${math}</code>`;
    }
  }, [math, block]);

  return (
    <span
      className={`${block ? 'block overflow-x-auto py-2 text-center' : 'inline-block px-1'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
