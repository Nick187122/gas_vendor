'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  ArrowLeft
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cylinders, setCylinders] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cylindersRes, companiesRes, ordersRes] = await Promise.all([
        fetch('/api/gas-cylinders'),
        fetch('/api/gas-companies'),
        fetch('/api/orders')
      ]);

      if (!cylindersRes.ok || !companiesRes.ok || !ordersRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [cylindersData, companiesData, ordersData] = await Promise.all([
        cylindersRes.json(),
        companiesRes.json(),
        ordersRes.json()
      ]);

      setCylinders(cylindersData.cylinders || []);
      setCompanies(companiesData.companies || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = () => {
    const totalCylinders = cylinders.length;
    const totalStock = cylinders.reduce((sum, c) => sum + c.stock_quantity, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    return {
      totalCylinders,
      totalStock,
      totalOrders,
      pendingOrders,
      totalRevenue
    };
  };

  const stats = getDashboardStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage your gas cylinder business</p>
              </div>
            </div>
            <a 
              href="/" 
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Shop</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'cylinders', label: 'Gas Cylinders', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <DashboardTab stats={stats} orders={orders} />}
        {activeTab === 'cylinders' && (
          <CylindersTab 
            cylinders={cylinders} 
            companies={companies} 
            onRefresh={fetchData} 
          />
        )}
        {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchData} />}
      </div>
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ stats, orders }) {
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCylinders}</p>
            </div>
            <Package className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStock}</p>
            </div>
            <Package className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-12 w-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.company_name} - {order.cylinder_type}
                    </div>
                    <div className="text-sm text-gray-500">{order.size_kg} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Cylinders Tab Component
function CylindersTab({ cylinders, companies, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCylinder, setEditingCylinder] = useState(null);

  const handleEdit = (cylinder) => {
    setEditingCylinder(cylinder);
    setShowForm(true);
  };

  const handleDelete = async (cylinderId) => {
    if (!confirm('Are you sure you want to delete this cylinder?')) return;

    try {
      const response = await fetch(`/api/gas-cylinders/${cylinderId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete cylinder');
      }

      onRefresh();
    } catch (error) {
      console.error('Error deleting cylinder:', error);
      alert('Failed to delete cylinder');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gas Cylinders Management</h2>
        <button
          onClick={() => {
            setEditingCylinder(null);
            setShowForm(true);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Cylinder</span>
        </button>
      </div>

      {/* Cylinders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cylinders.map((cylinder) => (
          <div key={cylinder.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">{cylinder.company_name}</h3>
                <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                  {cylinder.size_kg} kg
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-lg text-gray-900 mb-2">
                {cylinder.cylinder_type}
              </h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-orange-600">₹{cylinder.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-semibold ${cylinder.stock_quantity > 10 ? 'text-green-600' : cylinder.stock_quantity > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {cylinder.stock_quantity}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(cylinder)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cylinder.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <CylinderFormModal
          cylinder={editingCylinder}
          companies={companies}
          onClose={() => {
            setShowForm(false);
            setEditingCylinder(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingCylinder(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      onRefresh();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.company_name} - {order.cylinder_type}
                    </div>
                    <div className="text-sm text-gray-500">{order.size_kg} kg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(status) => {
            updateOrderStatus(selectedOrder.id, status);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

// Cylinder Form Modal Component
function CylinderFormModal({ cylinder, companies, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    company_id: cylinder?.company_id || '',
    cylinder_type: cylinder?.cylinder_type || '',
    size_kg: cylinder?.size_kg || '',
    price: cylinder?.price || '',
    stock_quantity: cylinder?.stock_quantity || '',
    description: cylinder?.description || '',
    image_url: cylinder?.image_url || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = cylinder ? `/api/gas-cylinders/${cylinder.id}` : '/api/gas-cylinders';
      const method = cylinder ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${cylinder ? 'update' : 'create'} cylinder`);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving cylinder:', error);
      setError(`Failed to ${cylinder ? 'update' : 'create'} cylinder`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {cylinder ? 'Edit Cylinder' : 'Add New Cylinder'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <select
                required
                value={formData.company_id}
                onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cylinder Type *
              </label>
              <input
                type="text"
                required
                value={formData.cylinder_type}
                onChange={(e) => setFormData({...formData, cylinder_type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Domestic LPG"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.size_kg}
                onChange={(e) => setFormData({...formData, size_kg: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="14.2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="850.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Product description..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : (cylinder ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Order Details Modal Component
function OrderDetailsModal({ order, onClose, onStatusUpdate }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Order Details #{order.id}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div><strong>Name:</strong> {order.customer_name}</div>
              <div><strong>Phone:</strong> {order.customer_phone}</div>
              <div><strong>Address:</strong> {order.customer_address}</div>
              {order.latitude && order.longitude && (
                <div><strong>Location:</strong> {order.latitude}, {order.longitude}</div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div><strong>Company:</strong> {order.company_name}</div>
              <div><strong>Type:</strong> {order.cylinder_type}</div>
              <div><strong>Size:</strong> {order.size_kg} kg</div>
              <div><strong>Price per unit:</strong> ₹{order.price}</div>
              <div><strong>Quantity:</strong> {order.quantity}</div>
              <div><strong>Total Amount:</strong> ₹{order.total_amount?.toLocaleString()}</div>
            </div>
          </div>

          {/* Order Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Status</h3>
            <div className="flex items-center space-x-4">
              <StatusBadge status={order.status} />
              <div className="text-sm text-gray-500">
                Ordered on {new Date(order.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {order.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          {order.status === 'pending' && (
            <div className="flex space-x-4">
              <button
                onClick={() => onStatusUpdate('confirmed')}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirm Order
              </button>
              <button
                onClick={() => onStatusUpdate('cancelled')}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}

          {order.status === 'confirmed' && (
            <button
              onClick={() => onStatusUpdate('delivered')}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}