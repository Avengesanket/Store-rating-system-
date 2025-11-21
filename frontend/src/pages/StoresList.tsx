import { useEffect, useState } from 'react';
import { storesService } from '../services/stores.service';
import type { Store } from '../types';
import { Search, Star, MapPin } from 'lucide-react';
import RatingModal from '../components/RatingModal'; 

export default function StoresList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for the Rating Modal
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const fetchStores = async () => {
    try {
      const data = await storesService.getAll();
      setStores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Search Logic (Client-side for responsiveness)
  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore Stores</h1>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search stores by name or address..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="text-center py-10">Loading stores...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
                    <Star size={14} className="mr-1 fill-current" />
                    {store.avgRating > 0 ? Number(store.avgRating).toFixed(1) : '-'}
                  </div>
                </div>
                <div className="flex items-start text-gray-500 mt-2 text-sm">
                  <MapPin size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                  <span>{store.address}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedStore(store)}
                  className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors flex items-center justify-center"
                >
                  <Star size={18} className="mr-2" />
                  {/* Logic to show 'Edit Rating' vs 'Rate Store' could go here if we pre-fetched user ratings */}
                  Rate Store
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <RatingModal 
          store={selectedStore} 
          onClose={() => setSelectedStore(null)} 
          onSuccess={fetchStores} // Refresh list to update Avg Rating
        />
      )}
    </div>
  );
}