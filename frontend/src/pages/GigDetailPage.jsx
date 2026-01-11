import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { api } from '../lib/api';
import { createBid } from '../features/bids/bidsSlice';

export default function GigDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [gig, setGig] = useState(null);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(100);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/api/gigs/${id}`);
      setGig(data.gig);
    })();
  }, [id]);

  async function onBid(e) {
    e.preventDefault();
    await dispatch(createBid({ gigId: id, message, price: Number(price) }));
    setMessage('');
  }

  if (!gig) return <Container>Loading...</Container>;

  return (
    <Container>
      <h1 className="text-2xl font-bold">{gig.title}</h1>
      <p className="text-gray-700 mt-1">Budget: ${gig.budget}</p>
      <p className="mt-4">{gig.description}</p>

      {user && user.id !== gig.ownerId?._id && (
        <div className="mt-8 max-w-2xl">
          <h2 className="text-xl font-semibold">Place a Bid</h2>
          <form className="mt-4 grid gap-3" onSubmit={onBid}>
            <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
            <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} required />
            <button className="rounded bg-indigo-600 text-white px-4 py-2">Submit Bid</button>
          </form>
        </div>
      )}

      {!user && <p className="mt-6 text-gray-600">Login to bid.</p>}
    </Container>
  );
}
