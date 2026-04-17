import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-32">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <Link to="/" className="bg-brand text-white px-6 py-2 rounded-md">Go Back Home</Link>
    </div>
  );
}