import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [emails, setEmails] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 将电子邮件列表转换为数组
    const emailList = emails.split('\n').map(email => email.trim()).filter(email => email);

    if (emailList.length === 0) {
      setValidationResult({ error: 'No emails provided' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-emails', { emails: emailList });
      setValidationResult(response.data);
    } catch (error) {
      setValidationResult({ error: 'Failed to validate emails' });
    }
  };

  return (
    <div className="App">
      <h1>Batch Email Validation</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter emails separated by new lines"
          rows="10"
          cols="30"
          required
        />
        <button type="submit">Validate Emails</button>
      </form>

      {validationResult && (
        <div>
          {validationResult.error ? (
            <p style={{ color: 'red' }}>{validationResult.error}</p>
          ) : (
            <ul>
              {validationResult.results.map((result, index) => (
                <li key={index}>
                  {result.email}: {result.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
