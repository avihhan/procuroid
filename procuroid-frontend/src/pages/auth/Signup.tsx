// src/pages/auth/SignUp.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    
    const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();

 
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    setLoading(false);
    if (error) return setErr(error.message);
    setMsg('Check your email to confirm your account.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Create account</h1>
        {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Email</label>
            <input className="input-field" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label>
            <input className="input-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Already have an account? <Link to="/signin" className="text-primary-600">Sign in</Link></p>
      </div>
    </div>
  );
}