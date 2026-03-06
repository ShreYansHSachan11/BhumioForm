import { useState, FormEvent } from 'react';
import { useSubmission } from './useSubmission';
import './App.css';

export default function App() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const { state, error, submit, reset } = useSubmission();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !amount) return;
    
    await submit({
      email,
      amount: parseFloat(amount)
    });
  };

  const handleReset = () => {
    setEmail('');
    setAmount('');
    reset();
  };

  const isDisabled = state === 'pending' || state === 'success';

  return (
    <div className="container">
      <h1>Payment Form</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isDisabled}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isDisabled}
            required
          />
        </div>

        <button type="submit" disabled={isDisabled} className="submit-btn">
          {state === 'pending' ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {state === 'pending' && (
        <div className="status pending">
          <div className="spinner"></div>
          <p>Submitting your request...</p>
        </div>
      )}

      {state === 'success' && (
        <div className="status success">
          <p>✓ Submission successful!</p>
          <button onClick={handleReset} className="reset-btn">Submit Another</button>
        </div>
      )}

      {state === 'error' && error && (
        <div className="status error">
          <p>✗ {error}</p>
          <button onClick={handleReset} className="reset-btn">Try Again</button>
        </div>
      )}
    </div>
  );
}
