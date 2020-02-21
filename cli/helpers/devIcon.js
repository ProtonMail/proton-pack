const sharp = require('sharp');

const DEV_TEXT = Buffer.from(`
<svg height="200" width="200">
  <rect y="0" width="130" height="55" fill="red" rx="15" />
  <text x="2" y="50" font-family="Arial, Helvetica, sans-serif" font-size="60px" fill="white">DEV</text>
</svg>
`);

const getDevIcon = (logoPath) => {
    return (
        sharp(logoPath, { density: 900 })
            .resize(200, 200)
            /*
        .modulate({
            brightness: 2
        })
        */
            .composite([
                {
                    input: DEV_TEXT,
                    blend: 'over'
                }
            ])
            .png()
            .toBuffer()
    );
};

module.exports = getDevIcon;
