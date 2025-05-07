import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-white/70 mb-6">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link 
        href="/" 
        className="bg-primary px-4 py-2 rounded-full text-sm font-bold hover:bg-primary/90 inline-block"
      >
        Back to Home
      </Link>
    </div>
  );
} 