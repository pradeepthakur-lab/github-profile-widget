const fse = require('fs-extra');
const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');

if(fse.existsSync('dist')){
    fse.removeSync('dist')
}

fse.copySync('src','dist');

minify({
    compressor: terser,
    input: 'src/githubCard.mjs',
    output: 'dist/githubCard.min.mjs',
    callback: function(err, min) {}
});
  
fse.writeFileSync('dist/index.js', "export * from './githubCard.mjs';")