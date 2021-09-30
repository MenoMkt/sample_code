

import fs from 'fs'

// BOM付きCSV生成 先頭に`\uFEFF`をつける
const csvText = `\uFEFFUser name,Password,Access key ID,Secret access key\n`


fs.writeFileSync('./csvWithBom.csv', csvText);
