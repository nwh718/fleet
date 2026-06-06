const cp = require('child_process');
const fs = require('fs');
try {
  const out = cp.execSync('git log --grep="Command palette: highlight search matches in picker subpages"').toString();
  fs.writeFileSync('git_log_out.txt', out);
} catch (e) {
  fs.writeFileSync('git_log_out.txt', e.toString());
}
