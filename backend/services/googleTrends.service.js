import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Python script se Google Trends data fetch karo
const getTrendData = (keyword) => {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, '../scripts/fetchGoogleTrends.py');

    const python = spawn('python', [scriptPath, keyword]);

    let dataBuffer = '';
    let errorBuffer = '';

    // Python script ka output collect karo
    python.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });

    // Python script ka error collect karo
    python.stderr.on('data', (data) => {
      errorBuffer += data.toString();
    });

    // Script complete hone par
    python.on('close', (code) => {
      if (code !== 0) {
        console.error(`Google Trends Python Error: ${errorBuffer}`);
        // Fail hone par null return karo — app crash nahi hoga
        return resolve(null);
      }

      try {
        const parsed = JSON.parse(dataBuffer.trim());
        resolve(parsed);
      } catch (error) {
        console.error(`Google Trends Parse Error: ${error.message}`);
        resolve(null);
      }
    });

    // Timeout — 10 seconds mein response nahi aaya toh null return karo
    setTimeout(() => {
      python.kill();
      console.error('Google Trends Timeout');
      resolve(null);
    }, 10000);
  });
};

export { getTrendData };