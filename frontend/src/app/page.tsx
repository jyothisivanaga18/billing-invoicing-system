import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Billing & Invoicing System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A production-ready platform for managing invoices, customers, and payments.
            Built with Next.js, Node.js, and MySQL.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/signup"
              className="bg-white text-primary-600 border border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => (
            <div key={feature.title} className="card text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
              >
                <span className="text-green-500 font-bold">✓</span>
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {tech.name}
                  </div>
                  <div className="text-xs text-gray-500">{tech.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    icon: '📄',
    title: 'Invoice Management',
    description:
      'Create, send, and track invoices with automatic numbering and PDF generation.',
  },
  {
    icon: '💳',
    title: 'Payment Processing',
    description:
      'Accept payments via Stripe, Razorpay, and PayPal with real-time status tracking.',
  },
  {
    icon: '👥',
    title: 'Customer Management',
    description:
      'Manage customer profiles, billing history, and subscription plans in one place.',
  },
];

const techStack = [
  { name: 'Next.js 14', role: 'Frontend' },
  { name: 'Node.js + Express', role: 'Backend' },
  { name: 'MySQL + Prisma', role: 'Database' },
  { name: 'TypeScript', role: 'Type Safety' },
  { name: 'JWT Auth', role: 'Authentication' },
  { name: 'Stripe / Razorpay', role: 'Payments' },
  { name: 'Redis', role: 'Caching' },
  { name: 'Docker', role: 'Deployment' },
];
