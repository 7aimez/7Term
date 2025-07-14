import React, { useState, useRef } from 'react';
import { getFS, resetFS } from './filesystem';
import { runCommand } from './commands';

export default function Terminal({ onHTML }) {
  const [lines, setLines] = useState([
    'Welcome to Linux Terminal Web!',
    'Type `help` for commands.'
  ]);
  const [cwd, setCwd] = useState('/');
  const [input, setInput] = useState('');
  const fsRef = useRef(getFS());

  const context = {
    cwd,
    fs: fsRef.current,
    resetFS: () => {
      resetFS();
      fsRef.current = getFS();
      setCwd('/');
    }
  };

  const handleCommand = async (cmd) => {
    const [command, ...args] = cmd.trim().split(' ');
    try {
      if (command === 'help') {
        setLines(ls => [
          ...ls,
          `$ ${cmd}`,
          'Supported commands: ls, cd, cat, write, mkdir, rm, curl, resetfs'
        ]);
        return;
      }
      const out = await runCommand(command, args, context);
      setCwd(context.cwd); // update cwd if changed
      setLines(ls => [...ls, `$ ${cmd}`, out]);
      // Show HTML if output looks like HTML
      if ((command === 'cat' || command === 'curl') && out.trim().startsWith('<')) {
        onHTML(out);
      }
    } catch (err) {
      setLines(ls => [...ls, `$ ${cmd}`, err.message]);
    }
  };

  return (
    <div style={{ background: "#111", color: "#eee", padding: "10px", fontFamily: "monospace" }}>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <div>
        <span>{cwd} $ </span>
        <input
          value={input}
          style={{ background: "#222", color: "#eee", border: "none", outline: "none" }}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
}
