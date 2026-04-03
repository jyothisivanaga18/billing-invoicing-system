import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here&apos;s an overview of your billing activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`text-3xl p-3 rounded-full ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
            <p className={`text-sm mt-3 ${stat.changeColor}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link key={action.title} href={action.href}>
            <div className="card hover:shadow-md transition-shadow cursor-pointer border-l-4 border-primary-500">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const stats = [
  {
    label: 'Total Revenue',
    value: '$0.00',
    icon: '💰',
    bgColor: 'bg-green-100',
    change: 'No payments yet',
    changeColor: 'text-gray-500',
  },
  {
    label: 'Pending Invoices',
    value: '0',
    icon: '📄',
    bgColor: 'bg-blue-100',
    change: 'No pending invoices',
    changeColor: 'text-gray-500',
  },
  {
    label: 'Total Customers',
    value: '0',
    icon: '👥',
    bgColor: 'bg-purple-100',
    change: 'No customers yet',
    changeColor: 'text-gray-500',
  },
  {
    label: 'Overdue',
    value: '0',
    icon: '⚠️',
    bgColor: 'bg-red-100',
    change: 'No overdue invoices',
    changeColor: 'text-gray-500',
  },
];

const quickActions = [
  {
    title: 'Create Invoice',
    description: 'Generate a new invoice for a customer',
    icon: '➕',
    href: '/invoices/new',
  },
  {
    title: 'Add Customer',
    description: 'Add a new customer to your database',
    icon: '👤',
    href: '/customers/new',
  },
  {
    title: 'View Payments',
    description: 'Check your recent payment history',
    icon: '💳',
    href: '/payments',
  },
];
