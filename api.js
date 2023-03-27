const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2/promise');
const cors = require("cors");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');
const os = require('os');
var config = require('./config.json');

const app = express();
const port = 3003;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const pool = mysql.createPool({
  host: config.DATABASE_HOST,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());

app.listen(3003, function () {
    console.log("App listening on port 3003!");
  });

app.post('/videoUpload', upload.single('file'), async (req, res) => {
  try {
    const tmpDir = os.tmpdir();
    const inputFile = req.file.path;
    const outputFile = path.join(tmpDir, 'lowres_' + req.file.filename);
    
    const command = ffmpeg(inputFile)
      .videoCodec('libx264')
      .audioCodec('libmp3lame')
      .outputOptions([
        '-vf scale=320:-1',
        '-threads 0',
        '-preset veryfast',
        '-crf 28',
        '-movflags faststart'
      ])
      .output(outputFile);

    await new Promise((resolve, reject) => {
      command.on('end', resolve);
      command.on('error', reject);
      command.run();
    });

    const fileContent = fs.readFileSync(outputFile);
    const fileName = 'lowres_' + req.file.originalname;
    
    const connection = await pool.getConnection();
    const result = await connection.query('INSERT INTO videofiles (name, file) VALUES (?, ?)', [fileName, fileContent]);
    connection.release();

    console.log(result);
    res.send('File uploaded and stored in database successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('File upload and database storage failed!');
  }
});

app.get('/videos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT name FROM videofiles');
    connection.release();
    const fileNames = rows.map(row => row.name);
    res.send(fileNames);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve file names from database');
  }
});

app.get('/playVideo/:name', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT file FROM videofiles WHERE name = ?', [req.params.name]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).send('File not found');
    }
    res.send(rows[0].file);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to retrieve file from database');
  }
});