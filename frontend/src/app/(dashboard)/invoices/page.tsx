import Link from 'next/link';

export default function InvoicesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage all your invoices</p>
        </div>
        <Link href="/invoices/new" className="btn-primary">
          + Create Invoice
        </Link>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No invoices yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first invoice to get started
          </p>
          <Link href="/invoices/new" className="btn-primary">
            Create Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
