import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Import the theme
import 'prismjs/components/prism-javascript'; // Load the language

const CodeHighlight = (escapedCode) => {

  // Add a custom span to highlight just the `escapedCode`
  const highlightedCode = code.replace(
    `${escapedCode}`,
    '<span class="token highlight">${escapedCode}</span>'
  );

  useEffect(() => {
    // Re-highlight after rendering
    Prism.highlightAll();
  }, []);

  return (
    <pre className="language-javascript">
      <code
        dangerouslySetInnerHTML={{
          __html: highlightedCode,
        }}
      />
    </pre>
  );
};

export default CodeHighlight