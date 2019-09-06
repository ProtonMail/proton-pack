const LIMIT = 10000;
const DESIGN_SYSTEM_ICONS_SVG = 'sprite-icons.svg';
const DESIGN_SYSTEM_CSS_SVG = 'sprite-for-css-only.svg';

module.exports = () => [
    {
        oneOf: [
            {
                test: new RegExp(`${DESIGN_SYSTEM_ICONS_SVG}$`),
                use: [
                    {
                        loader: 'svg-inline-loader'
                    }
                ]
            },
            {
                test: /\.(bmp|png|jpg|jpeg|gif|svg)$/,
                loader: 'url-loader',
                exclude: new RegExp(`${DESIGN_SYSTEM_CSS_SVG}`),
                options: {
                    limit: LIMIT,
                    name: 'assets/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(bmp|png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
];
