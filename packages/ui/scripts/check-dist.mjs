/**
 * Checks what the build published for the tokens, so a broken publish step fails the build:
 *   - every stylesheet in src/tokens/css/ is in dist/tokens/, byte for byte;
 *   - the public entry points @repo/ui/tokens and @repo/ui/tokens/antd have their JS and types;
 *   - nothing built from src/tokens/generators/ reached dist/, since those run at build time only.
 */
import { readdir, readFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcTokens = join(root, 'src', 'tokens');
const distTokens = join(root, 'dist', 'tokens');

const problems = [];

const read = async (path) => {
  try {
    return await readFile(path);
  } catch {
    return undefined;
  }
};

for (const file of await readdir(join(srcTokens, 'css'))) {
  if (!file.endsWith('.css')) continue;
  const published = await read(join(distTokens, file));
  if (!published) problems.push(`missing dist/tokens/${file}`);
  else if (!published.equals(await readFile(join(srcTokens, 'css', file)))) {
    problems.push(`dist/tokens/${file} differs from src/tokens/css/${file}`);
  }
}

for (const entry of ['index', 'antd/index']) {
  for (const extension of ['.js', '.mjs', '.d.ts']) {
    if (!(await read(join(distTokens, `${entry}${extension}`)))) {
      problems.push(`missing dist/tokens/${entry}${extension}`);
    }
  }
}

const generators = (await readdir(join(srcTokens, 'generators')))
  .filter((file) => extname(file) === '.ts')
  .map((file) => basename(file, '.ts'));
const distFiles = await readdir(join(root, 'dist'), { recursive: true, withFileTypes: true });
for (const entry of distFiles) {
  const path = relative(root, join(entry.parentPath, entry.name));
  if (entry.isDirectory() && entry.name === 'generators') problems.push(`generator folder ${path}`);
  if (entry.isFile() && generators.some((name) => entry.name.startsWith(`${name}.`))) {
    if (!entry.name.endsWith('.css')) problems.push(`generator output ${path}`);
  }
}

if (problems.length > 0) {
  console.error(`dist check failed:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`);
  process.exit(1);
}
console.log('dist check passed');
