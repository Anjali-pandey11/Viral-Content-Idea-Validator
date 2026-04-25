import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Python script se data fetch karo
const fetchFromPython = (keyword) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../scripts/fetchGoogleTrends.py');

    const python = spawn('py', [scriptPath, keyword]);

    let dataBuffer = '';
    let errorBuffer = '';

    python.stdout.on('data', (data) => {
      dataBuffer += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorBuffer += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        // reject karo — catch mein jayega
        return reject(new Error(errorBuffer));
      }

      try {
        const parsed = JSON.parse(dataBuffer.trim());
        resolve(parsed);
      } catch (error) {
        reject(new Error('Parse failed'));
      }
    });

    setTimeout(() => {
      python.kill();
      // reject karo — catch mein jayega
      reject(new Error('Timeout'));
    }, 30000);
  });
};

// Ye function claude.service.js use karega
const getTrendData = async (keyword) => {
  try {
    // Real data fetch karne ki koshish karo
    const result = await fetchFromPython(keyword);
    return result; // ✅ Real data mila
  } catch (error) {
    // Fail hone par null return karo silently
    console.error(`Google Trends unavailable: ${error.message}`);
    return null; // ✅ null return — app crash nahi hoga
  }
};

export { getTrendData };