import React from 'react';

export default function HTMLViewer({ html }) {
  return (
    <div style={{ border: '1px solid #ccc', marginTop: 10 }}>
      <h3>HTML Output</h3>
      <iframe
        title="HTML Preview"
        srcDoc={html}
        sandbox="allow-scripts"
        style={{ width: '100%', height: '300px', border: 'none' }}
      />
    </div>
  );
}
