const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const original = {window: {}};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'vendor/chx3-cad.js'), 'utf8'), original);
const model = original.window.MineGuardCAD;
const metadata = {...model, parts: []};
const chunks = [];
let current = [], size = 0;
for (const part of model.parts) {
  const bytes = Buffer.byteLength(JSON.stringify(part));
  if (current.length && size + bytes > 600000) {chunks.push(current); current = []; size = 0;}
  current.push(part); size += bytes;
}
if (current.length) chunks.push(current);
const names = ['vendor/chx3-cad.meta.js'];
fs.writeFileSync(path.join(dist, names[0]), '/* Original CAD metadata; geometry is loaded by the following local script fragments. */\nwindow.MineGuardCAD=' + JSON.stringify(metadata) + ';\n');
chunks.forEach((parts, index) => {
  const name = 'vendor/chx3-cad.part-' + String(index + 1).padStart(2, '0') + '.js';
  names.push(name);
  const count = chunks.slice(0, index + 1).reduce((sum, chunk) => sum + chunk.length, 0);
  const progress = '正在载入机械臂细节 · ' + count + ' / ' + model.parts.length;
  fs.writeFileSync(path.join(dist, name), '/* Lossless CAD fragment ' + (index + 1) + '/' + chunks.length + '. */\n(()=>{window.MineGuardCAD.parts.push(...' + JSON.stringify(parts) + ');if(typeof document!=="undefined"){const hint=document.querySelector("#loading > span:last-child");if(hint)hint.textContent=' + JSON.stringify(progress) + ';}})();\n');
});
const packed = {window: {}};
for (const name of names) vm.runInNewContext(fs.readFileSync(path.join(dist, name), 'utf8'), packed);
assert.equal(JSON.stringify(packed.window.MineGuardCAD), JSON.stringify(model), 'Packing must preserve every property and geometry value');
assert.equal(packed.window.MineGuardCAD.parts.length, 99);
const indexPath = path.join(dist, 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');
const tags = '<!-- CAD-PACK:start -->' + names.map(name => '<script defer src="./' + name + '"></script>').join('') + '<!-- CAD-PACK:end -->';
const replacement = /<!-- CAD-PACK:start -->[\s\S]*?<!-- CAD-PACK:end -->|<script defer src="\.\/vendor\/chx3-cad\.js"><\/script>/;
assert.ok(replacement.test(html), 'CAD loader insertion point missing');
fs.writeFileSync(indexPath, html.replace(replacement, tags));
fs.writeFileSync(path.join(dist, '.nojekyll'), '\n');
function list(directory, prefix = '') {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? list(path.join(directory, entry.name), prefix + entry.name + '/') : [prefix + entry.name]);
}
const manifest = list(dist).sort().map(file => {
  const content = fs.readFileSync(path.join(dist, file));
  return {file, bytes: content.length, sha256: crypto.createHash('sha256').update(content).digest('hex')};
});
fs.writeFileSync(path.join(root, 'FILES.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({status: 'passed', lossless: true, cadParts: model.parts.length, cadTriangles: model.triangleCount, chunks: chunks.length, largestChunkBytes: Math.max(...names.map(name => fs.statSync(path.join(dist, name)).size)), files: manifest.length}));
