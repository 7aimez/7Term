// Virtual filesystem using browser localStorage

const FS_KEY = 'terminal_fs';

function loadFS() {
  const fs = localStorage.getItem(FS_KEY);
  if (fs) return JSON.parse(fs);
  // Initial structure
  return {
    '/': { type: 'dir', children: {} },
  };
}

function saveFS(fs) {
  localStorage.setItem(FS_KEY, JSON.stringify(fs));
}

function getNode(path, fs) {
  const parts = path.split('/').filter(Boolean);
  let node = fs['/'];
  for (const part of parts) {
    if (node.type !== 'dir' || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

export function listDir(path, fs) {
  const node = getNode(path, fs);
  if (!node || node.type !== 'dir') throw new Error('Not a directory');
  return Object.keys(node.children);
}

export function readFile(path, fs) {
  const node = getNode(path, fs);
  if (!node || node.type !== 'file') throw new Error('Not a file');
  return node.content;
}

export function writeFile(path, content, fs) {
  const parts = path.split('/').filter(Boolean);
  let node = fs['/'];
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!node.children[part]) node.children[part] = { type: 'dir', children: {} };
    node = node.children[part];
  }
  node.children[parts.at(-1)] = { type: 'file', content };
  saveFS(fs);
}

export function makeDir(path, fs) {
  const parts = path.split('/').filter(Boolean);
  let node = fs['/'];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!node.children[part]) node.children[part] = { type: 'dir', children: {} };
    node = node.children[part];
  }
  saveFS(fs);
}

export function removeFile(path, fs) {
  const parts = path.split('/').filter(Boolean);
  let node = fs['/'];
  for (let i = 0; i < parts.length - 1; i++) {
    node = node.children[parts[i]];
    if (!node) return;
  }
  delete node.children[parts.at(-1)];
  saveFS(fs);
}

export function resetFS() {
  localStorage.removeItem(FS_KEY);
}

export function getFS() {
  return loadFS();
}
