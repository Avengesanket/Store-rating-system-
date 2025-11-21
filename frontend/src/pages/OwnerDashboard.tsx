import { useEffect, useState } from 'react';
import api from '../api/axios'; 
import { ratingsService } from '../services/ratings.service';
import type { Store, Rating } from '../types';
import { Star, Users} from 'lucide-react';

export default function OwnerDashboard() {
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Get My Store
        const storeRes = await api.get<Store>('/stores/my-store');
        const myStore = storeRes.data;
        setStore(myStore);

        // 2. If store exists, get ratings
        if (myStore && myStore.id) {
          const ratingsData = await ratingsService.getByStore(myStore.id);
          setRatings(ratingsData);
        }
      } catch (error) {
        console.error("Error loading owner dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading your dashboard...</div>;

  if (!store) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-700">No Store Assigned</h2>
        <p className="text-gray-500 mt-2">Please contact the System Administrator to have a store assigned to your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
        <p className="text-gray-500">{store.address}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400 flex items-center">
          <div className="p-3 bg-yellow-50 rounded-full mr-4 text-yellow-500"><Star size={28} fill="currentColor" /></div>
          <div>
            <p className="text-gray-500 text-sm">Average Rating</p>
            <p className="text-3xl font-bold">{store.avgRating} <span className="text-sm text-gray-400">/ 5</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600"><Users size={28} /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Reviews</p>
            <p className="text-3xl font-bold">{ratings.length}</p>
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {ratings.length === 0 ? (
            <li className="p-6 text-gray-500 text-center">No ratings yet.</li>
          ) : (
            ratings.map((rating) => (
              <li key={rating.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {rating.user?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{rating.user?.name}</div>
                      <div className="text-sm text-gray-500">{rating.user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                    <span className="text-lg font-bold text-gray-800 mr-1">{rating.value}</span>
                    <Star size={16} className="text-yellow-500" fill="currentColor" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-right">
                  {new Date(rating.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}