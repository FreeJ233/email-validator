import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-email', { email });
      setValidationResult(response.data);
    } catch (error) {
      setValidationResult({ error: 'Failed to validate email' });
    }
  };

  return (
    <div className="App">
      <h1>Email Validation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <button type="submit">Validate</button>
      </form>

      {validationResult && (
        <div>
          {validationResult.error ? (
            <p style={{ color: 'red' }}>{validationResult.error}</p>
          ) : (
            <p>{validationResult.status}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
