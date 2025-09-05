import fs from 'fs';
import path from 'path';
import { StockRow } from './tableSort';

export const saveDataToFile = async (data: StockRow[], fileName: string) => {
  //Checking to see if dir exists && create if needed
  const saveDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
  }

  const lines = data.map((item, index) => {
    const entry = Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join(',');
    return `${index + 1}. ${entry}`;
  });

  const content = lines.join('\n');

  const filePath = path.join(saveDir, `${fileName}.txt`);
  fs.writeFileSync(filePath, content, 'utf-8');
};
