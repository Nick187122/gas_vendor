'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Phone, MapPin, Flame, Filter, Search } from 'lucide-react';

export default function HomePage() {
  const [cylinders, setCylinders] = useState([]);
  const [filteredCylinders, setFilteredCylinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCylinder, setSelectedCylinder] = useState(null);

  useEffect(() => {
    fetchCylinders();
  }, []);

  useEffect(() => {
    filterCylinders();
  }, [cylinders, selectedCompany, selectedType, searchTerm]);

  const fetchCylinders = async () => {
    try {
      const response = await fetch('/api/gas-cylinders');
      if (!response.ok) {
        throw new Error(`Failed to fetch cylinders: ${response.status}`);
      }
      const data = await response.json();
      setCylinders(data.cylinders || []);
    } catch (error) {
      console.error('Error fetching cylinders:', error);
      setError('Failed to load gas cylinders');
    } finally {
      setLoading(false);
    }
  };

  const filterCylinders = () => {
    let filtered = cylinders.filter(cylinder => cylinder.stock_quantity > 0);
    
    if (selectedCompany) {
      filtered = filtered.filter(cylinder => cylinder.company_name === selectedCompany);
    }
    
    if (selectedType) {
      filtered = filtered.filter(cylinder => cylinder.cylinder_type === selectedType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cylinder => 
        cylinder.company_name.toLowerCase().includes(term) ||
        cylinder.cylinder_type.toLowerCase().includes(term) ||
        cylinder.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredCylinders(filtered);
  };

  const getUniqueCompanies = () => {
    return [...new Set(cylinders.map(c => c.company_name))].filter(Boolean);
  };

  const getUniqueTypes = () => {
    return [...new Set(cylinders.map(c => c.cylinder_type))].filter(Boolean);
  };

  const handleOrderClick = (cylinder) => {
    setSelectedCylinder(cylinder);
    setShowOrderForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gas cylinders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <button 
            onClick={fetchCylinders}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-3 rounded-full">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">GasCylinder Shop</h1>
                <p className="text-gray-600">Your trusted gas cylinder supplier</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/admin" 
                className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Admin Panel
              </a>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-5 w-5" />
                <span className="font-medium">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Products</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cylinders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Company Filter */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Companies</option>
              {getUniqueCompanies().map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCompany('');
                setSelectedType('');
                setSearchTerm('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCylinders.map((cylinder) => (
            <div key={cylinder.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Company Logo/Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{cylinder.company_name}</h3>
                  <div className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                    {cylinder.size_kg} kg
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {cylinder.image_url ? (
                  <img 
                    src={cylinder.image_url} 
                    alt={cylinder.cylinder_type}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Flame className="h-16 w-16 mx-auto mb-2" />
                    <p>Gas Cylinder</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h4 className="font-semibold text-lg text-gray-900 mb-2">
                  {cylinder.cylinder_type}
                </h4>
                
                {cylinder.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {cylinder.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{cylinder.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock: {cylinder.stock_quantity}
                  </div>
                </div>

                <button
                  onClick={() => handleOrderClick(cylinder)}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCylinders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Flame className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No cylinders found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && selectedCylinder && (
        <OrderFormModal 
          cylinder={selectedCylinder}
          onClose={() => {
            setShowOrderForm(false);
            setSelectedCylinder(null);
          }}
        />
      )}
    </div>
  );
}

// Order Form Modal Component
function OrderFormModal({ cylinder, onClose }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    quantity: 1,
    notes: ''
  });
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        cylinder_id: cylinder.id,
        latitude: location?.lat || null,
        longitude: location?.lng || null
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`Failed to place order: ${response.status}`);
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cylinder.price * formData.quantity;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
          <p className="text-gray-600">We'll contact you soon to confirm your order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Place Order</h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="mt-2">
            <p className="text-orange-100">{cylinder.company_name} - {cylinder.cylinder_type}</p>
            <p className="text-orange-100">{cylinder.size_kg} kg - ₹{cylinder.price}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.customer_phone}
                onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Address *
            </label>
            <textarea
              required
              rows={3}
              value={formData.customer_address}
              onChange={(e) => setFormData({...formData, customer_address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter your complete delivery address"
            />
          </div>

          {/* Location Picker */}
          <LocationPicker onLocationSelect={setLocation} />

          {/* Quantity and Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <select
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {[...Array(Math.min(cylinder.stock_quantity, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <div className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-2xl font-bold text-orange-600">
                ₹{totalAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Any special instructions or requirements"
            />
          </div>

          {/* Submit Button */}
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
              className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Location Picker Component
function LocationPicker({ onLocationSelect }) {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    setShowMap(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Location (Optional)
      </label>
      
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setShowMap(true)}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <MapPin className="h-4 w-4" />
          <span>{selectedLocation ? 'Update Location' : 'Select Location'}</span>
        </button>
        
        {selectedLocation && (
          <button
            type="button"
            onClick={() => {
              setSelectedLocation(null);
              onLocationSelect(null);
            }}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {selectedLocation && (
        <div className="mt-2 text-sm text-gray-600">
          📍 Location selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </div>
      )}

      {showMap && (
        <MapModal 
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
}

// Map Modal Component
function MapModal({ onLocationSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Select Delivery Location</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 p-4">
          <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg mb-2">Interactive Map</p>
              <p className="text-sm mb-4">Click on the map to select your delivery location</p>
              <button
                onClick={() => onLocationSelect({ lat: 28.6139, lng: 77.2090 })}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Use Sample Location (Delhi)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}