import {
  listDir, readFile, writeFile, makeDir, removeFile, getFS
} from './filesystem';

// Commands implementation
export async function runCommand(cmd, args, context) {
  const fs = context.fs;
  switch (cmd) {
    case 'ls':
      return listDir(context.cwd, fs).join('  ');
    case 'cd':
      if (args[0] === '/') context.cwd = '/';
      else {
        const newPath = context.cwd === '/' ? `/${args[0]}` : `${context.cwd}/${args[0]}`;
        if (!listDir(newPath, fs)) throw new Error('No such directory');
        context.cwd = newPath;
      }
      return '';
    case 'cat':
      return readFile(context.cwd === '/' ? `/${args[0]}` : `${context.cwd}/${args[0]}`, fs);
    case 'write':
      writeFile(context.cwd === '/' ? `/${args[0]}` : `${context.cwd}/${args[0]}`, args.slice(1).join(' '), fs);
      return 'File written';
    case 'mkdir':
      makeDir(context.cwd === '/' ? `/${args[0]}` : `${context.cwd}/${args[0]}`, fs);
      return 'Directory created';
    case 'rm':
      removeFile(context.cwd === '/' ? `/${args[0]}` : `${context.cwd}/${args[0]}`, fs);
      return 'Removed';
    case 'curl':
      const url = args[0];
      if (!url) throw new Error('Usage: curl <url>');
      const resp = await fetch(url);
      return await resp.text();
    case 'resetfs':
      context.resetFS();
      context.fs = getFS();
      context.cwd = '/';
      return 'Filesystem reset';
    default:
      throw new Error('Command not found');
  }
}
