import { useDispatch, useSelector } from 'react-redux';
import Container from '../components/Container';
import { clearNotifications } from '../features/notifications/notificationsSlice';

export default function NotificationsPage() {
  const items = useSelector((s) => s.notifications.items);
  const dispatch = useDispatch();

  return (
    <Container>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button className="rounded bg-gray-900 text-white px-4 py-2" onClick={() => dispatch(clearNotifications())}>
          Clear
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((n) => (
          <div key={n.id} className="rounded border bg-white p-4">
            <p className="font-medium">{n.message}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-600">No notifications.</p>}
      </div>
    </Container>
  );
}
