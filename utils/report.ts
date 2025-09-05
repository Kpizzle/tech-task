//TODO - this generic report fuction can be used to create reports of the data to 3rd parties

import { StockRow } from './tableSort';

//Given further time I'd also merge the file writing and report functionality into one function - scope creep here?
export async function reporter(rows: StockRow[], title: string): Promise<void> {
  console.log(`\n=== ${title} ===`);
  rows.forEach((row, index) => {
    const value = row.change ?? row.marketCapValue; //check which value exists
    console.log(
      `${index + 1}. Code: ${row.code} CompanyName: ${row.name} Value: ${value}`
    );
  });
}
