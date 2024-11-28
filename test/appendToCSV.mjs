import fs from 'fs'; 
import csv from 'fast-csv'; 

/**
 
 * @param {string} filePath - Path to the CSV file.
 * @param {Object} data - The data object to append to the CSV.
 * @param {Array<string>} headers - The headers for the CSV file.
 * @returns {Promise<void>} - A promise that resolves when the data is appended.
 */
export function appendToCSV(filePath, data, headers) {
  return new Promise((resolve, reject) => {
    let writeHeaders = false;

    // Check if the file exists or is empty
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      writeHeaders = headers.length > 0; 
    }

    // Create a write stream with append mode
    const ws = fs.createWriteStream(filePath, { flags: 'a' });

    // Create a CSV stream
    const csvStream = csv.format({
      headers: writeHeaders ? headers : false, 
      includeEndRowDelimiter: true,
    });

    // Handle the CSV writing process
    csvStream
      .pipe(ws)
      .on('finish', resolve) 
      .on('error', error => {
        console.error('Error writing to CSV file:', error);
        reject(error); 
      });

    csvStream.write(data); // Write the data
    csvStream.end(); // End the stream
  });
}
