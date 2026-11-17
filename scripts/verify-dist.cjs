const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const files = JSON.parse(fs.readFileSync(path.join(root, 'FILES.json'), 'utf8'));
for (const item of files) {
  const content = fs.readFileSync(path.join(root, 'dist', item.file));
  assert.equal(content.length, item.bytes, item.file + ': incomplete file');
  assert.equal(crypto.createHash('sha256').update(content).digest('hex'), item.sha256, item.file + ': unexpected content');
}
const html = fs.readFileSync(path.join(root, 'dist', 'index.html'), 'utf8');
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
  assert.ok(fs.existsSync(path.join(root, 'dist', match[1])), 'Missing local asset: ' + match[1]);
}
assert.ok(!/<script[^>]+src="https?:/i.test(html), 'Unexpected remote script');
console.log(JSON.stringify({status: 'passed', runtimeFiles: files.length, geometryPreserved: true}));
