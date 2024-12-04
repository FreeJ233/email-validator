const express = require('express');
const emailVerifier = require('email-verifier');
const app = express();
const port = 5000;

// 中间件解析 JSON 请求体
app.use(express.json());

// 批量验证电子邮件
app.post('/verify-emails', (req, res) => {
  const emails = req.body.emails;

  if (!emails || emails.length === 0) {
    return res.status(400).send({ error: 'Emails are required' });
  }

  // 验证每个电子邮件
  const results = [];
  const verifier = new emailVerifier();

  const verifyEmails = async () => {
    for (const email of emails) {
      try {
        const info = await new Promise((resolve, reject) => {
          verifier.verify(email, (err, info) => {
            if (err) reject(err);
            else resolve(info);
          });
        });
        results.push({ email, status: info.status || 'Unknown' });
      } catch (error) {
        results.push({ email, status: 'Invalid' });
      }
    }

    res.send({ results });
  };

  verifyEmails().catch(err => res.status(500).send({ error: 'Email verification failed' }));
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
