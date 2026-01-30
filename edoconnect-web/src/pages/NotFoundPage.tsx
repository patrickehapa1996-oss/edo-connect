import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary mt-6 inline-block">
          Go home
        </Link>
      </div>
    </div>
  );
}
