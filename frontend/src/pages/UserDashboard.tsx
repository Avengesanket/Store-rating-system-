export default function UserDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stores</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </div>

      {/* Search Bar [cite: 45] */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search stores by Name or Address..." 
          className="w-full p-3 border rounded shadow-sm"
        />
      </div>

      {/* Store List [cite: 46-50] */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mock Store Card */}
        <div className="bg-white border rounded shadow p-4">
          <h3 className="font-bold text-lg">Tech Store Pune</h3>
          <p className="text-gray-600 text-sm mb-2">123 MG Road, Pune</p>
          <div className="flex justify-between items-center mt-4">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
              Avg Rating: 4.5 ★
            </span>
            <button className="text-blue-600 hover:underline">Rate Store</button>
          </div>
        </div>
      </div>
    </div>
  );
}