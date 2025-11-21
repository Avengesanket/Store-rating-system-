import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Plus, Store as StoreIcon, Users, BarChart, X, Pencil, Trash2 } from 'lucide-react';

import { usersService } from '../services/users.service';
import { storesService } from '../services/stores.service';
import { ratingsService } from '../services/ratings.service';
import { UserRole } from '../types';
import type { User, Store } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores'>('overview');
  
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals State (Create)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  
  // Modals State (Edit)
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  // Fetch Data
  const fetchData = async () => {
    try {
      const [usersData, storesData, ratingsCount] = await Promise.all([
        usersService.getAll(),
        storesService.getAll(),
        ratingsService.getTotalCount(),
      ]);
      setUsers(usersData);
      setStores(storesData);
      setTotalRatings(ratingsCount);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Action Handlers ---

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await usersService.delete(id);
        fetchData(); // Refresh list
      } catch (error) {
        alert('Failed to delete user.');
      }
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this store? All associated ratings will be deleted.')) {
      try {
        await storesService.delete(id);
        fetchData(); // Refresh list
      } catch (error) {
        alert('Failed to delete store.');
      }
    }
  };

  // --- Filtering ---

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">System Administrator</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500 flex items-center">
          <div className="p-3 bg-indigo-100 rounded-full mr-4 text-indigo-600"><Users size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center">
          <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600"><StoreIcon size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Stores</p>
            <p className="text-2xl font-bold">{stores.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full mr-4 text-yellow-600"><BarChart size={24} /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Ratings</p>
            <p className="text-2xl font-bold">{totalRatings}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'users', 'stores'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Search & Add Actions */}
      {activeTab !== 'overview' && (
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <div className="flex space-x-2">
            {activeTab === 'users' && (
              <button onClick={() => setShowAddUserModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Plus size={18} /> Add User
              </button>
            )}
            {activeTab === 'stores' && (
              <button onClick={() => setShowAddStoreModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Plus size={18} /> Add Store
              </button>
            )}
          </div>
        </div>
      )}

      {/* Data Tables */}
      <div className="bg-white shadow rounded-lg overflow-hidden min-h-[300px]">
        
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
           <div className="p-10 text-center text-gray-500">
             <h3 className="text-lg font-medium text-gray-900">Welcome to the Admin Dashboard</h3>
             <p className="mt-2">Manage Users, Stores, and view system statistics.</p>
           </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        user.role === 'store_owner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingUser(user)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit User"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)} 
                      className="text-red-600 hover:text-red-900"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Stores Table */}
        {activeTab === 'stores' && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.owner?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-bold">{store.avgRating}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => setEditingStore(store)} 
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit Store"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteStore(store.id)} 
                      className="text-red-600 hover:text-red-900"
                      title="Delete Store"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modals for Creating and Editing */}
      {showAddUserModal && <UserModal onClose={() => setShowAddUserModal(false)} onSuccess={fetchData} />}
      {editingUser && <UserModal user={editingUser} onClose={() => setEditingUser(null)} onSuccess={fetchData} />}
      
      {showAddStoreModal && <StoreModal users={users} onClose={() => setShowAddStoreModal(false)} onSuccess={fetchData} />}
      {editingStore && <StoreModal store={editingStore} users={users} onClose={() => setEditingStore(null)} onSuccess={fetchData} />}
    </div>
  );
}

// --- REUSABLE MODAL COMPONENTS ---

// 1. User Modal (Handles Add & Edit)
const UserModal = ({ user, onClose, onSuccess }: { user?: User, onClose: () => void, onSuccess: () => void }) => {
  const isEdit = !!user;
  
  // Setup form with default values if editing
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<User & { password?: string }>({
    defaultValues: user ? { ...user } : { name: '', email: '', address: '', role: UserRole.NORMAL_USER, password: '' }
  });

  const onSubmit = async (data: any) => {
    try {
      // If editing and no password provided, don't send empty password string
      if (isEdit && !data.password) delete data.password;
      
      if (isEdit && user) {
        await usersService.update(user.id, data);
      } else {
        // Validate creation (creates require validation usually)
        await usersService.create(data);
      }
      onSuccess();
      onClose();
    } catch (e) { 
      alert('Operation failed. Please check fields.'); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
           <h2 className="text-lg font-bold">{isEdit ? 'Edit User' : 'Add User'}</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register('name', { required: true })} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email', { required: true })} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password {isEdit && '(Leave blank to keep)'}</label>
            <input {...register('password')} type="password" className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input {...register('address')} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select {...register('role')} className="mt-1 w-full border p-2 rounded bg-white">
              <option value="normal_user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
             <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
               {isEdit ? 'Update' : 'Create'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Store Modal (Handles Add & Edit)
const StoreModal = ({ store, users, onClose, onSuccess }: { store?: Store, users: User[], onClose: () => void, onSuccess: () => void }) => {
  const isEdit = !!store;
  const owners = users.filter((u) => u.role === UserRole.STORE_OWNER);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: store ? { ...store, ownerId: store.owner?.id } : { name: '', email: '', address: '', ownerId: '' }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && store) {
        await storesService.update(store.id, data);
      } else {
        await storesService.create(data);
      }
      onSuccess();
      onClose();
    } catch (e) { alert('Operation failed'); }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
           <h2 className="text-lg font-bold">{isEdit ? 'Edit Store' : 'Add Store'}</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input {...register('name', { required: true })} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register('email')} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input {...register('address')} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner</label>
            <select {...register('ownerId')} className="mt-1 w-full border p-2 rounded bg-white">
              <option value="">Select Owner</option>
              {owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
            </select>
            {owners.length === 0 && <p className="text-xs text-orange-500 mt-1">No owners available.</p>}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
             <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
               {isEdit ? 'Update' : 'Create'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};