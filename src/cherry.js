/**
 * @file start commander, entry file
 * @author zhangpeng53
 */

const wpconfig = require('../webpack.config');
const webpack = require('webpack');
const walkmd = require('./walkmd');
const sh = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const parseNav = require('./parseNav');

const node_modules = path.resolve(__dirname, '../node_modules');
const wpconfigPath = path.resolve(__dirname, '../webpack.config.js');


function parseWPConfig(config, isProduction) {
    let res = wpconfig(isProduction);
    if (config.setWebpackConfig) {
        res = config.setWebpackConfig(res);
    }
    return res;
}

function before(config) {

    let src;
    let dist = path.resolve(__dirname, '../theme');

    // 如果是默认主题则使用theme_default
    if (config.theme == 'default' || !config.theme) {
        src = path.resolve(__dirname, '../theme_default');
    } else {
        src = path.resolve(process.cwd(), config.theme);
    }
    sh(`rm -rf ${dist}`);
    sh(`cp -R ${src} ${dist}`);
    config.theme = dist;

    //创建临时文件夹
    const tmp  = config.theme + '/tmp';
    if (fs.existsSync(tmp)) sh(`rm -rf ${tmp}`);
    fs.mkdirSync(tmp);

    if (config.nav && config.nav.length) parseNav(config);
};

exports.build = config => {
    before(config);

    walkmd(config, () => {
        const site = path.resolve(process.cwd(), 'site');
        sh(`rm -rf ${site}`);
        
        const compiler = webpack(parseWPConfig(config, true));
            compiler.run((err, stats) => {
            // console.log(stats);
        });
    });
}

exports.dev = config => {
    before(config);

    walkmd(config, () => {
       
         // const server = new webdevServer(compiler, wpconfig.devServer);
        // server.listen(wpconfig.devServer.port, "localhost", ()=> {
        //     console.log('====start-dev-server====');
        // });

        // TODO
        // const db = require("./tmp/__md__");

        const server = require('./server');
        const wpConfig = parseWPConfig(config, false);
        server(config, wpConfig);
        // sh(`${node_modules}/.bin/webpack-dev-server --config ${wpconfigPath}`);
    });
}