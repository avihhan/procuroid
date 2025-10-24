import { useState } from 'react';
import { 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  MessageSquare,
  Plus
} from 'lucide-react';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const suppliers = [
    {
      id: 1,
      name: 'SteelCorp Industries',
      contact: 'John Smith',
      email: 'john@steelcorp.com',
      phone: '+1 (555) 123-4567',
      location: 'Chicago, IL',
      rating: 4.5,
      totalOrders: 12,
      totalValue: 45000,
      lastOrder: '2024-01-05',
      specialties: ['Steel Materials', 'Construction Supplies'],
      status: 'Active'
    },
    {
      id: 2,
      name: 'MetalWorks Ltd',
      contact: 'Sarah Johnson',
      email: 'sarah@metalworks.com',
      phone: '+1 (555) 234-5678',
      location: 'Detroit, MI',
      rating: 4.2,
      totalOrders: 8,
      totalValue: 28000,
      lastOrder: '2024-01-08',
      specialties: ['Aluminum Products', 'Metal Fabrication'],
      status: 'Active'
    },
    {
      id: 3,
      name: 'SafetyFirst Corp',
      contact: 'Mike Davis',
      email: 'mike@safetyfirst.com',
      phone: '+1 (555) 345-6789',
      location: 'Houston, TX',
      rating: 4.8,
      totalOrders: 15,
      totalValue: 32000,
      lastOrder: '2024-01-03',
      specialties: ['Safety Equipment', 'PPE'],
      status: 'Active'
    },
    {
      id: 4,
      name: 'ToolMaster Ltd',
      contact: 'Lisa Wilson',
      email: 'lisa@toolmaster.com',
      phone: '+1 (555) 456-7890',
      location: 'Phoenix, AZ',
      rating: 4.0,
      totalOrders: 6,
      totalValue: 18000,
      lastOrder: '2023-12-20',
      specialties: ['Tools', 'Hardware'],
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'OfficePro Inc',
      contact: 'David Brown',
      email: 'david@officepro.com',
      phone: '+1 (555) 567-8901',
      location: 'Seattle, WA',
      rating: 4.3,
      totalOrders: 4,
      totalValue: 2500,
      lastOrder: '2023-12-15',
      specialties: ['Office Supplies', 'Stationery'],
      status: 'Active'
    }
  ];

  const orderHistory = {
    1: [
      {
        id: 'ORD-003',
        description: 'Steel Beams - Construction Grade',
        date: '2024-01-05',
        amount: 8500,
        status: 'Delivered'
      },
      {
        id: 'ORD-007',
        description: 'Steel Sheets - Industrial',
        date: '2023-12-15',
        amount: 3200,
        status: 'Delivered'
      },
      {
        id: 'ORD-011',
        description: 'Steel Rods - Grade 6061',
        date: '2023-11-28',
        amount: 1800,
        status: 'Delivered'
      }
    ],
    2: [
      {
        id: 'ORD-002',
        description: 'Aluminum Sheets - Marine Grade',
        date: '2024-01-08',
        amount: 4200,
        status: 'Shipped'
      },
      {
        id: 'ORD-009',
        description: 'Aluminum Tubes - Structural',
        date: '2023-12-20',
        amount: 2800,
        status: 'Delivered'
      }
    ],
    3: [
      {
        id: 'ORD-003',
        description: 'Safety Helmets - Industrial',
        date: '2024-01-03',
        amount: 1850,
        status: 'Delivered'
      },
      {
        id: 'ORD-012',
        description: 'Safety Gloves - Cut Resistant',
        date: '2023-12-10',
        amount: 450,
        status: 'Delivered'
      }
    ]
  };

  const notes = {
    1: [
      {
        id: 1,
        content: 'Excellent quality steel products. Always delivers on time.',
        author: 'John Doe',
        date: '2024-01-05',
        type: 'positive'
      },
      {
        id: 2,
        content: 'Negotiated better pricing for bulk orders. Very responsive.',
        author: 'Jane Smith',
        date: '2023-12-20',
        type: 'neutral'
      }
    ],
    2: [
      {
        id: 1,
        content: 'Good aluminum quality but delivery was delayed by 2 days.',
        author: 'Mike Johnson',
        date: '2024-01-08',
        type: 'neutral'
      }
    ]
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      case 'neutral':
        return 'border-l-gray-500 bg-gray-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships and performance</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Directory */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplier Directory</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedSupplier === supplier.id
                      ? 'border-primary-200 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{supplier.contact}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(supplier.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({supplier.rating})</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                          {supplier.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Detail View */}
        <div className="lg:col-span-2">
          {selectedSupplier ? (
            <div className="space-y-6">
              {(() => {
                const supplier = suppliers.find(s => s.id === selectedSupplier);
                if (!supplier) return null;

                return (
                  <>
                    {/* Supplier Overview */}
                    <div className="card">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{supplier.name}</h2>
                          <p className="text-gray-600">{supplier.contact}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(supplier.status)}`}>
                          {supplier.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{supplier.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-sm font-medium text-gray-900">{supplier.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">{supplier.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Star className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Rating</p>
                            <p className="text-sm font-medium text-gray-900">{supplier.rating}/5.0</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Package className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{supplier.totalOrders}</p>
                          <p className="text-sm text-gray-500">Total Orders</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">${supplier.totalValue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Total Value</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <Calendar className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-gray-900">{supplier.lastOrder}</p>
                          <p className="text-sm text-gray-500">Last Order</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {supplier.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="card">
                      <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                          {['overview', 'orders', 'notes'].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveTab(tab)}
                              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab
                                  ? 'border-primary-500 text-primary-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                          ))}
                        </nav>
                      </div>

                      <div className="mt-6">
                        {activeTab === 'overview' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center">
                                  <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                                  <span className="text-sm font-medium text-blue-900">Performance Trend</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 mt-2">+12%</p>
                                <p className="text-sm text-blue-700">vs last quarter</p>
                              </div>
                              <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                  <Package className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-sm font-medium text-green-900">On-time Delivery</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900 mt-2">94%</p>
                                <p className="text-sm text-green-700">last 12 months</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === 'orders' && (
                          <div className="space-y-4">
                            {orderHistory[selectedSupplier as keyof typeof orderHistory] ? (
                              orderHistory[selectedSupplier as keyof typeof orderHistory].map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{order.id}</h4>
                                    <p className="text-sm text-gray-600">{order.description}</p>
                                    <p className="text-xs text-gray-500">{order.date}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">${order.amount.toLocaleString()}</p>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center py-8">No order history available</p>
                            )}
                          </div>
                        )}

                        {activeTab === 'notes' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900">Internal Notes</h3>
                              <button className="btn-secondary flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Add Note</span>
                              </button>
                            </div>
                            {notes[selectedSupplier as keyof typeof notes] ? (
                              notes[selectedSupplier as keyof typeof notes].map((note) => (
                                <div key={note.id} className={`p-4 border-l-4 rounded-r-lg ${getNoteTypeColor(note.type)}`}>
                                  <p className="text-sm text-gray-900">{note.content}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">By {note.author}</span>
                                    <span className="text-xs text-gray-500">{note.date}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-center py-8">No notes available</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="card">
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Supplier</h3>
                <p className="text-gray-500">Choose a supplier from the directory to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
