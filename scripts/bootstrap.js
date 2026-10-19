// Expo の土台を用意し、設定を整えるスクリプト（自動化用）。
// 1回目：公式テンプレートから package.json などを作り、必要な部品を入れる。
// 2回目以降：設定（app.json）を整えるだけ。
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: root, stdio: 'inherit' });
};

const DEPS = [
  'react-dom',
  'react-native-web',
  '@expo/metro-runtime',
  '@react-native-async-storage/async-storage',
  'react-native-svg',
  'expo-router',
  'react-native-safe-area-context',
  'react-native-screens',
  'expo-linking',
  'expo-constants',
  'expo-status-bar',
  'expo-image-picker',
  'expo-image-manipulator',
];

if (!fs.existsSync(path.join(root, 'package.json'))) {
  const tmp = path.join(root, '_tmp');
  fs.rmSync(tmp, { recursive: true, force: true });
  run('npx --yes create-expo-app@latest _tmp --template blank-typescript --no-install');
  for (const name of fs.readdirSync(tmp)) {
    if (['App.tsx', 'node_modules', '.git'].includes(name)) continue;
    fs.cpSync(path.join(tmp, name), path.join(root, name), { recursive: true, force: true });
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  run('npm install');
  run(`npx expo install ${DEPS.join(' ')}`);
} else {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const have = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const missing = DEPS.filter((d) => !have[d]);
  if (missing.length) {
    run('npm install');
    run(`npx expo install ${missing.join(' ')}`);
  }
}

// app.json を整える（名前、Web出力、GitHub Pages 用の住所、Expo Router の設定）
const appJsonPath = path.join(root, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const expo = (appJson.expo = appJson.expo || {});
expo.name = 'スクショ係';
expo.slug = 'ippo';
expo.web = { ...(expo.web || {}), output: 'single', bundler: 'metro' };
expo.scheme = expo.scheme || 'screenshot-kakari';
expo.plugins = expo.plugins || [];
if (!expo.plugins.some((p) => (Array.isArray(p) ? p[0] : p) === 'expo-router')) expo.plugins.unshift('expo-router');
const repo = (process.env.GITHUB_REPOSITORY || '').split('/')[1];
if (repo) {
  expo.experiments = { ...(expo.experiments || {}), baseUrl: `/${repo}` };
}
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
console.log('app.json updated');
