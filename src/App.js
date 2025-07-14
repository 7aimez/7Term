import React, { useState } from 'react';
import Terminal from './Terminal';
import HTMLViewer from './HTMLViewer';

export default function App() {
  const [html, setHtml] = useState('');
  return (
    <div>
      <Terminal onHTML={setHtml} />
      {html && <HTMLViewer html={html} />}
    </div>
  );
}
