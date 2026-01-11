import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import Badge from '../components/Badge';
import { fetchGigs } from '../features/gigs/gigsSlice';

export default function GigsPage() {
  const dispatch = useDispatch();

  // ✅ SAFE DEFAULTS (MAIN FIX)
  const gigs = useSelector((s) => s.gigs.items) || [];
  const user = useSelector((s) => s.auth.user);

  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(fetchGigs(''));
  }, [dispatch]);

  // ✅ SAFE useMemo
  const filtered = useMemo(() => {
    return Array.isArray(gigs) ? gigs : [];
  }, [gigs]);

  return (
    <Container>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Open Gigs</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title"
            className="rounded border px-3 py-2"
          />
          <button
            className="rounded bg-gray-900 text-white px-4"
            onClick={() => dispatch(fetchGigs(q))}
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filtered.map((g) => (
          <div key={g._id} className="rounded border bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-lg">{g.title}</h2>
                <p className="text-sm text-gray-600">Budget: ${g.budget}</p>
                <p className="text-sm text-gray-600">
                  Client: {g.ownerId?.name || 'Unknown'}
                </p>
              </div>
              <Badge value={g.status} />
            </div>

            <p className="mt-3 text-gray-800">{g.description}</p>

            <div className="mt-4 flex gap-2">
              {user && user.id !== g.ownerId?._id && (
                <Link
                  className="rounded bg-indigo-600 text-white px-4 py-2"
                  to={`/gigs/${g._id}`}
                >
                  View & Bid
                </Link>
              )}

              {user && user.id === g.ownerId?._id && (
                <Link
                  className="rounded bg-gray-900 text-white px-4 py-2"
                  to={`/gigs/${g._id}/bids`}
                >
                  View Bids
                </Link>
              )}

              {!user && (
                <span className="text-sm text-gray-600">
                  Login to bid or manage gigs.
                </span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-600">No gigs found.</p>
        )}
      </div>
    </Container>
  );
}
