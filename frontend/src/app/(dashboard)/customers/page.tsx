import Link from 'next/link';

export default function CustomersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Link href="/customers/new" className="btn-primary">
          + Add Customer
        </Link>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No customers yet
          </h3>
          <p className="text-gray-500 mb-4">
            Add your first customer to start sending invoices
          </p>
          <Link href="/customers/new" className="btn-primary">
            Add Customer
          </Link>
        </div>
      </div>
    </div>
  );
}
