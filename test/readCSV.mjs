export function readCSV(filePath) {
    return new Promise((resolve, reject) => {
      const data = [];
      if (!fs.existsSync(filePath)) {
        return resolve(data);
      }
  
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true, trim: true }))
        .on('error', error => reject(error))
        .on('data', row => {
          data.push(row);
        })
        .on('end', () => {
          resolve(data);
        });
    });
  }