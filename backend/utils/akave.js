const { exec } = require('child_process');
const fs = require('fs').promises;
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const { setTimeout } = require('timers/promises');
require('dotenv').config();

const uploadToAkave = async (bucketName, filePath, encryptedBuffer) => {
  try {
    await fs.writeFile(filePath, encryptedBuffer);
    console.log('File written to:', filePath);

    const cmd = `akavecli ipc file upload ${bucketName} ${filePath} --node-address=${process.env.AKAVE_NODE_ADDRESS} --private-key "${process.env.AKAVE_PRIVATE_KEY}"`;
    console.log('Executing command:', cmd);

    const stdout = await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        console.log('Upload stdout:', stdout);
        console.log('Upload stderr:', stderr || 'No stderr');
        if (error && !stdout.includes('File uploaded successfully')) {
          console.error('Exec error:', error.message);
          reject(new Error(`Akave upload failed: ${stderr || error.message}`));
        } else {
          resolve(stdout.trim());
        }
      });
    });

    return stdout;
  } catch (error) {
    console.error('UploadToAkave error:', error.stack);
    throw error;
  }
};

const downloadFromAkave = async (bucketName, fileName) => {
  console.log('Running downloadFromAkave - v10', { bucketName, fileName });
  if (!bucketName || !fileName) {
    throw new Error(`Invalid input: bucketName=${bucketName}, fileName=${fileName}`);
  }
  const tempDir = path.resolve('./temp');
  console.log('Temp dir:', tempDir);
  const cmd = `akavecli ipc file download ${bucketName} ${fileName} ${tempDir} --node-address=${process.env.AKAVE_NODE_ADDRESS} --private-key "${process.env.AKAVE_PRIVATE_KEY}"`;
  console.log('Executing command:', cmd);
  let stdout, stderr;
  try {
    console.log('Before execPromise');
    const result = await execPromise(cmd);
    console.log('After execPromise', result);
    stdout = result.stdout;
    stderr = result.stderr;
  } catch (execError) {
    console.error('execPromise error:', execError.stack);
    throw execError;
  }
  console.log('Download stdout:', stdout);
  console.log('Download stderr:', stderr);
  if (stderr && !stderr.includes('File downloaded successfully')) {
    console.error('Download failed with stderr:', stderr);
    throw new Error(`Akave download failed: ${stderr}`);
  }
  await setTimeout(2000);
  const downloadedPath = path.join(tempDir, fileName);
  console.log('Computed path:', downloadedPath);
  const stats = await fs.stat(downloadedPath);
  console.log('File stats:', stats);
  const buffer = await fs.readFile(downloadedPath);
  console.log('File read, size:', buffer.length);
  await fs.unlink(downloadedPath).catch(err => console.warn('Delete failed:', err.message));
  console.log('File deleted');
  return buffer;
};

const createBucket = async (bucketName) => {
  const cmd = `akavecli ipc bucket create ${bucketName} --node-address=${process.env.AKAVE_NODE_ADDRESS} --private-key "${process.env.AKAVE_PRIVATE_KEY}"`;
  console.log('Executing create bucket command:', cmd);
  await execPromise(cmd);
};

module.exports = { uploadToAkave, downloadFromAkave, createBucket };