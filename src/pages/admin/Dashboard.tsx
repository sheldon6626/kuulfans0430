export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 font-medium text-sm mb-1">Total Products</h3>
           <div className="text-3xl font-bold text-primary">12</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 font-medium text-sm mb-1">Total Inquiries</h3>
           <div className="text-3xl font-bold text-primary">48</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h3 className="text-gray-500 font-medium text-sm mb-1">Active Posts</h3>
           <div className="text-3xl font-bold text-primary">5</div>
        </div>
      </div>
    </div>
  );
}
