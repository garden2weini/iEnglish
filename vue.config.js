const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
//const webpack = require('webpack')

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    // copy cloud functions to mp-wexin
                    from: path.join(__dirname, 'cloudfunctions'),
                    to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'cloudfunctions')
                }
            ])
        ]
    }
    /*
    ,
    // NOTE: 尝试解决如下问题--Cannot read property 'call' of undefined
    configureWebpack: {
            plugins: [
                new webpack.ProvidePlugin({
                    //chunks: ['manifest', 'vendor', pathname],
                    chunks: ['manifest', 'vendor'],
                    chunksSortMode: 'manual',
                })
            ]
        }
    */
}