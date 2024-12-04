const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const emailVerifier = require('email-verifier');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 单个邮箱验证接口
app.post('/verify-email', (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: '邮箱地址是必需的' });
  }

  emailVerifier.verify(email, (err, info) => {
    if (err) {
      return res.status(500).json({ message: '验证失败', error: err.message });
    }
    res.json({ email, status: info.result });
  });
});

// 批量邮箱验证接口
app.post('/verify-emails', (req, res) => {
  const emails = req.body.emails;
  if (!emails || emails.length === 0) {
    return res.status(400).json({ message: '邮箱列表不能为空' });
  }

  let verifiedCount = 0;
  const results = [];

  emails.forEach((email) => {
    emailVerifier.verify(email, (err, info) => {
      if (err) {
        results.push({ email, status: '错误', error: err.message });
      } else {
        results.push({ email, status: info.result });
      }
      verifiedCount++;

      if (verifiedCount === emails.length) {
        res.json({ results });
      }
    });
  });
});

// 文件上传和邮箱验证接口
app.post('/upload', upload.single('emailFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '未上传文件' });
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const emails = fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  let verifiedCount = 0;
  const results = [];

  emails.forEach((email) => {
    emailVerifier.verify(email, (err, info) => {
      if (err) {
        results.push({ email, status: '错误', error: err.message });
      } else {
        results.push({ email, status: info.result });
      }
      verifiedCount++;

      if (verifiedCount === emails.length) {
        fs.unlinkSync(filePath); // 处理完文件后删除临时文件
        res.json({ results });
      }
    });
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('邮箱验证服务正在3000端口运行');
});
