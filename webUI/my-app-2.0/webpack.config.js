/* eslint-disable strict */
let webpack = require('webpack');
let path = require('path');
let consolidate = require('consolidate');
const WebpackShellPlugin = require('webpack-shell-plugin');
//let publicPath = 'http://localhost:3000';
let hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

let devConfig = {
    entry: {
        person: ['./UI/person', hotMiddlewareScript],
        cdc: ['./UI/cdc', hotMiddlewareScript],
        index: ['./UI/index', hotMiddlewareScript],
        hospital: ['./UI/hospital', hotMiddlewareScript]
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, './public'),
        //publicPath: './dist/',  // 配置生成css输出路径
    },
    devtool: 'eval-source-map',
    devServer: {
        host: '0.0.0.0',
        port: '3000',
        contentBase: './public/*',
        hot: true,
        before: function(app, passport) {
            app.engine('html', consolidate.ejs);
            app.set('view engine', 'html');
            app.set('views', path.resolve(__dirname, './views'));
            //app.use('/css',express.static(__dirname + './css'));

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            require('./routes')(app);
            /*if(process.env.BE === 'mock'){
                require('./UI/server/mock')(app);
                console.log('using mock backend');
            }
            else{
                require('./UI/server/routes')(app);
            }*/
        }
    },
    module: {
        rules: [{
            test: /\.(png|jpg)$/,
            use: 'url-loader?limit=8192&context=client&name=[path][name].[ext]'
        }, {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader?sourceMap',
                'resolve-url-loader',
                'sass-loader?sourceMap'
            ]
        },{
            test: /\.jsx?$/,
            loader: ['babel-loader']
        },{
            test: /\.css$/,
                use: [
                     {
                         loader: 'style-loader'  // 可以把css放在页面上
                     },
                     {
                         loader: 'css-loader'    // 放在后面的先被解析
                     }
                ]
        }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new WebpackShellPlugin(
            {
                onBuildExit: ['echo npm run test']
            }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = devConfig;