import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Input from '../components/Input';
import { registerUser } from '../features/auth/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((s) => s.auth.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(registerUser({ name, email, password }));
    if (res.meta.requestStatus === 'fulfilled') navigate('/');
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold">Register</h1>
      <form className="mt-6 grid gap-4 max-w-md" onSubmit={onSubmit}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-red-600">{error}</p>}
        <button className="rounded bg-gray-900 text-white px-4 py-2">Create Account</button>
      </form>
    </Container>
  );
}
