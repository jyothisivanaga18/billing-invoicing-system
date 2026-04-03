export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-1">Track all payment transactions</p>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No payments yet
          </h3>
          <p className="text-gray-500">
            Payments will appear here once customers pay their invoices
          </p>
        </div>
      </div>
    </div>
  );
}
