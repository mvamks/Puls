const { execSync } = require('child_process');
const fs = require('fs-extra');

const distPath = './dist';
const tmpPath = '../dist_temp';

// Очистить временную папку (создать заново)
fs.removeSync(tmpPath);
fs.mkdirSync(tmpPath);

// Копируем dist во временную папку (чтобы не запутаться)
fs.copySync(distPath, tmpPath);

// Сохраняем текущую ветку
const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

try {
  // Переключаемся на gh-pages
  execSync('git checkout gh-pages');

  // Удаляем всё, кроме .git
  const files = fs.readdirSync('.');
  files.forEach(file => {
    if (file !== '.git' && file !== 'node_modules') fs.removeSync(file);
  });

  // Копируем из временной папки в корень
  fs.copySync(tmpPath, '.');

  // Добавляем, коммитим и пушим
  execSync('git add .');
  execSync('git commit -m "Deploy: обновление сайта из gulp dist"');
  execSync('git push origin gh-pages');

  console.log('Деплой успешно выполнен!');
} catch (error) {
  console.error('Ошибка деплоя:', error);
} finally {
  // Возвращаемся на исходную ветку
  execSync(`git checkout ${currentBranch}`);
}