const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// DB 연결 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

// 평균 계산 후 등급 반환
function getGrade(avg) {
  if (avg >= 90) return 'A';
  if (avg >= 80) return 'B';
  if (avg >= 70) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

// 서버 연결 확인
app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('서버 실행 중: 3000'));
