import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { createGig } from '../features/gigs/gigsSlice';

export default function PostGigPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(100);

  async function onSubmit(e) {
    e.preventDefault();
    await dispatch(createGig({ title, description, budget: Number(budget) }));
    navigate('/');
  }

  return (
    <Container>
      <h1 className="text-2xl font-bold">Post a Gig</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-2xl">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Input label="Budget" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} min={0} required />
        <button className="rounded bg-gray-900 text-white px-4 py-2">Create</button>
      </form>
    </Container>
  );
}
