const path = require('path');

module.exports = {
    entry:"./src/js/entry.js", //主模块
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    }
};