const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// DB 연결 풀 생성
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

// 학생 등록
app.post('/students', async (req, res) => {
  const name = req.body.name;
  const student_number = req.body.student_number;
  const [result] = await pool.query(
    'INSERT INTO students (name, student_number) VALUES (?, ?)',
    [name, student_number]
  );
  res.json({ id: result.insertId, name: name, student_number: student_number });
});

// 전체 학생 + 평균/등급 조회
app.get('/students', async (req, res) => {
  const [students] = await pool.query('SELECT * FROM students');
  const result = [];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const [scores] = await pool.query(
      'SELECT score FROM scores WHERE student_id = ?',
      [student.id]
    );

    let avg = 0;
    if (scores.length > 0) {
      let total = 0;
      for (let j = 0; j < scores.length; j++) {
        total += scores[j].score;
      }
      avg = total / scores.length;
    }

    result.push({
      id: student.id,
      name: student.name,
      student_number: student.student_number,
      average: avg.toFixed(1),
      grade: getGrade(avg)
    });
  }

  res.json(result);
});

// 특정 학생 조회
app.get('/students/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query(
    'SELECT * FROM students WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ message: '학생 없음' });
  }
  res.json(rows[0]);
});

// 학생 정보 수정
app.put('/students/:id', async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const student_number = req.body.student_number;
  await pool.query(
    'UPDATE students SET name = ?, student_number = ? WHERE id = ?',
    [name, student_number, id]
  );
  res.json({ message: '수정 완료' });
});

// 학생 삭제
app.delete('/students/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM students WHERE id = ?', [id]);
  res.json({ message: '삭제 완료' });
});

// 점수 입력
app.post('/scores', async (req, res) => {
  const student_id = req.body.student_id;
  const subject = req.body.subject;
  const score = req.body.score;
  const [result] = await pool.query(
    'INSERT INTO scores (student_id, subject, score) VALUES (?, ?, ?)',
    [student_id, subject, score]
  );
  res.json({ id: result.insertId, student_id: student_id, subject: subject, score: score });
});

// 점수 수정
app.put('/scores/:id', async (req, res) => {
  const id = req.params.id;
  const score = req.body.score;
  await pool.query(
    'UPDATE scores SET score = ? WHERE id = ?',
    [score, id]
  );
  res.json({ message: '점수 수정 완료' });
});

// 점수 삭제
app.delete('/scores/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM scores WHERE id = ?', [id]);
  res.json({ message: '점수 삭제 완료' });
});

// 서버 연결 확인
app.get('/health', async (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('서버 실행 중: 3000'));
