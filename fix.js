const fs = require('fs');
let code = fs.readFileSync('frontend.html', 'utf8');
code = code.replace(/url\('\.\/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg))'\)/g, 'url(\'./all photos/$1\')');
code = code.replace(/src="\.\/([a-zA-Z0-9_-]+\.(?:png|jpg|jpeg))"/g, 'src="./all photos/$1"');
fs.writeFileSync('frontend.html', code);
