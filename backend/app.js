const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const emailVerifier = require('email-verifier');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 允许跨域请求（如果前后端分离）
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 路由：验证单个邮箱地址
app.post('/verify-email', (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: '邮箱地址不能为空' });
  }

  emailVerifier.verify(email, (err, info) => {
    if (err) {
      return res.status(500).json({ message: '验证失败', error: err.message });
    }
    res.json({ email, status: info.result });
  });
});

// 路由：批量验证邮箱
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

// 路由：上传txt文件并验证邮箱
app.post('/upload', upload.single('emailFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有文件上传' });
  }

  const filePath = path.join(__dirname, req.file.path);
  const fileContent = fs.readFileSync(filePath, 'utf8');

  const emails = fileContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0); // 去除空行

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
        fs.unlinkSync(filePath); // 删除临时上传文件
        res.json({ results });
      }
    });
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('邮箱验证服务已启动，监听端口 3000');
});
