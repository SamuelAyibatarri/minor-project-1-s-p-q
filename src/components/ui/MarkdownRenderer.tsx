import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For tables, strikethrough, etc.
import rehypeRaw from 'rehype-raw'; // To process raw HTML inside Markdown (e.g., <u>)

// 1. Define the props interface
interface MarkdownRendererProps {
  _: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ _ }) => {
  return (
    <div className="markdown-section-container">
      {/* 2. Use the ReactMarkdown component */}
      <ReactMarkdown
        // Pass the string content
        children={_}
        
        // Add plugins for extended Markdown features
        remarkPlugins={[remarkGfm]}
        
        // Add plugins to handle raw HTML (use cautiously)
        rehypePlugins={[rehypeRaw]}
        
        // OPTIONAL: Customize rendered HTML elements (e.g., add classes)
        components={{
          h1: ({ node, ...props }) => <h1 className="md-heading-1" {...props} />,
          p: ({ node, ...props }) => <p className="md-paragraph" {...props} />,
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      />
    </div>
  );
};

export { MarkdownRenderer };