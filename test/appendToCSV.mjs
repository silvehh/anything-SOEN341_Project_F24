import fs from 'fs'; // Import the file system module
import csv from 'fast-csv'; // Import the fast-csv module

/**
 * Appends data to a CSV file, writing headers if the file is new or empty.
 * Handles empty headers gracefully by not including them.
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
      writeHeaders = headers.length > 0; // Write headers only if they are provided
    }

    // Create a write stream with append mode
    const ws = fs.createWriteStream(filePath, { flags: 'a' });

    // Create a CSV stream
    const csvStream = csv.format({
      headers: writeHeaders ? headers : false, // Write headers if required
      includeEndRowDelimiter: true,
    });

    // Handle the CSV writing process
    csvStream
      .pipe(ws)
      .on('finish', resolve) // Resolve the promise on success
      .on('error', error => {
        console.error('Error writing to CSV file:', error);
        reject(error); // Reject the promise on error
      });

    csvStream.write(data); // Write the data
    csvStream.end(); // End the stream
  });
}
