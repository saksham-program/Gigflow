import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import Badge from '../components/Badge';
import { fetchBidsForGig, hireBid } from '../features/bids/bidsSlice';

export default function BidsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { gig, items, error } = useSelector((s) => s.bids);

  useEffect(() => {
    dispatch(fetchBidsForGig(id));
  }, [dispatch, id]);

  return (
    <Container>
      <h1 className="text-2xl font-bold">Bids</h1>
      {gig && (
        <p className="text-gray-600 mt-1">
          Gig: <span className="font-medium">{gig.title}</span>
        </p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-6 grid gap-3">
        {items.map((b) => (
          <div key={b._id} className="rounded border bg-white p-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{b.freelancerId?.name}</p>
                <Badge value={b.status} />
              </div>
              <p className="text-sm text-gray-600">Price: ${b.price}</p>
              <p className="mt-2">{b.message}</p>
            </div>

            <div className="flex flex-col gap-2">
              {gig?.status === 'open' && b.status === 'pending' && (
                <button
                  className="rounded bg-emerald-600 text-white px-4 py-2"
                  onClick={() => dispatch(hireBid(b._id))}
                >
                  Hire
                </button>
              )}
              {gig?.status === 'assigned' && <span className="text-sm text-gray-600">Assigned</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-600">No bids yet.</p>}
      </div>
    </Container>
  );
}
