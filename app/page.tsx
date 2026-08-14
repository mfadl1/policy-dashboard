'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Settings, AlertCircle, X, Save, Pencil, Layers, AlertTriangle, History, ChevronDown, ChevronUp, Power } from 'lucide-react';

// --- Mock Data ---
const initialPolicies = [
  {
    id: "aeacad59-fa78-4ac6-a177-48b20047d834",
    resource: "event",
    details: { name: "GP Travel Organism", product: "PRODUCT_GOPAY", publisher: "gopay" },
    action: { type: "DEACTIVATE" },
    status: "ACTIVE",
    isEditable: false
  },
  {
    id: "beacad59-fa78-4ac6-a177-48b20047d835",
    resource: "topic",
    details: { name: "clickstream-risktelemetry-log", publisher: "gojek" },
    action: { type: "DEACTIVATE" },
    status: "INACTIVE"
  },
  {
    id: "ceacad59-fa78-4ac6-a177-48b20047d836",
    resource: "global",
    details: {},
    action: { type: "DROP", conditionType: "timestamp_threshold", threshold: { past: "60d" } },
    status: "ACTIVE"
  },
  {
    id: "deacad59-fa78-4ac6-a177-48b20047d837",
    resource: "publisher",
    details: { publisher: "gojek" },
    action: { type: "DEDUPLICATION", conditionType: "ttl_threshold", threshold: { ttl: "24h" } },
    status: "ACTIVE",
    isEditable: false
  },
  {
    id: "eeacad59-fa78-4ac6-a177-48b20047d838",
    resource: "event",
    details: { name: "Dismissed Split bill - Pay to sabriya", product: "PRODUCT_GOPAY", publisher: "gopay" },
    action: { type: "OVERRIDE_TS", conditions: { past: "30d" } },
    status: "ACTIVE"
  },
  {
    id: "feacad59-fa78-4ac6-a177-48b20047d839",
    resource: "global",
    details: { publisher: "gobiz" },
    action: { type: "OVERRIDE_TS", conditions: { future: "2h" } },
    status: "INACTIVE"
  },
  {
    id: "geacad59-fa78-4ac6-a177-48b20047d840",
    resource: "topic",
    details: { name: "clickstream-order-log", publisher: "gojek" },
    action: { type: "DROP", conditionType: "timestamp_threshold", threshold: { past: "7d" } },
    status: "ACTIVE"
  },
  {
    id: "heacad59-fa78-4ac6-a177-48b20047d841",
    resource: "event",
    details: { name: "Courier Connect Started", product: "PRODUCT_GOPAY", publisher: "gopay" },
    action: { type: "DROP", conditionType: "timestamp_threshold", threshold: { past: "1h" } },
    status: "ACTIVE",
    isEditable: false
  },
  {
    id: "ieacad59-fa78-4ac6-a177-48b20047d842",
    resource: "publisher",
    details: { publisher: "gopay" },
    action: { type: "DEDUPLICATION", conditionType: "ttl_threshold", threshold: { ttl: "12h" } },
    status: "ACTIVE"
  },
  {
    id: "jeacad59-fa78-4ac6-a177-48b20047d843",
    resource: "event",
    details: { name: "GP SSL Validation Error", product: "PRODUCT_GOPAY", publisher: "gopay" },
    action: { type: "OVERRIDE_TS", conditions: { past: "14d", future: "12h" } },
    status: "ACTIVE"
  },
  {
    id: "keacad59-fa78-4ac6-a177-48b20047d844",
    resource: "topic",
    details: { name: "clickstream-adcard-log", publisher: "web_gofood" },
    action: { type: "DROP", conditionType: "timestamp_threshold", threshold: { past: "14d" } },
    status: "ACTIVE"
  },
  {
    id: "leacad59-fa78-4ac6-a177-48b20047d845",
    resource: "topic",
    details: { name: "clickstream-applifecycle-log", publisher: "mokapos" },
    action: { type: "DEACTIVATE" },
    status: "ACTIVE"
  },
  {
    id: "meacad59-fa78-4ac6-a177-48b20047d846",
    resource: "event",
    details: { name: "Push ", product: "PRODUCT_GOPAY", publisher: "gopay" },
    action: { type: "DROP", conditionType: "timestamp_threshold", threshold: { past: "48h" } },
    status: "ACTIVE"
  },
  {
    id: "neacad59-fa78-4ac6-a177-48b20047d847",
    resource: "publisher",
    details: { publisher: "gobiz" },
    action: { type: "DEDUPLICATION", conditionType: "ttl_threshold", threshold: { ttl: "48h" } },
    status: "ACTIVE"
  }
];

const publishers = [
    "email_consumer", "email_driver", "email_merchant", "gobiz", "gojek", "gopartner", 
    "gopay", "gopay_container", "gopay_merchant", "mokapos", "service_gojek", 
    "service_gopartner", "service_gopay_merchant", "service_gtf_paylater", "sg_gojek", 
    "toko_kapital", "web_gobiz", "web_gocare", "web_gocorp_zeus", "web_gofinance", 
    "web_gofood", "web_gomart", "web_gopay", "web_gopay_bonsai", "web_gtf_paylater", 
    "web_kejog", "web_midtrans_dashboard", "web_mokapos", "web_nexus", "web_risk", 
    "web_snap", "web_tiktokshop", "web_transport", "web_trip_tracker"
];

const topics = [
    "clickstream-adcard-log", "clickstream-adcardevent-log", "clickstream-apihealth-log",
    "clickstream-appattributes-log", "clickstream-apphealth-log", "clickstream-applifecycle-log",
    "clickstream-appuninstall-log", "clickstream-callinginfo-log", "clickstream-changepayment-log",
    "clickstream-chat-log", "clickstream-component-log", "clickstream-estimate-log",
    "clickstream-experimentrun-log", "clickstream-inboxinfo-log", "clickstream-localization-log",
    "clickstream-miniapp-log", "clickstream-navic-log", "clickstream-notificationinfo-log",
    "clickstream-order-log", "clickstream-page-log", "clickstream-pubsubhealth-log",
    "clickstream-ratinginfo-log", "clickstream-risktelemetry-log", "clickstream-s4health-log",
    "clickstream-savedaddress-log", "clickstream-shufflecardv2-log", "clickstream-snippetinfo-log",
    "clickstream-trace-log", "clickstream-transaction-log", "clickstream-upsell-log",
    "clickstream-useraccount-log"
];

const productValues = [
    "PRODUCT_CVSDK", "PRODUCT_GOPAY", "PRODUCT_CRYPTO", "PRODUCT_TAGIHAN", 
    "PRODUCT_LOGINSDK", "PRODUCT_INSURANCE_PLATFORM", "PRODUCT_VEHICLE_FINANCE", 
    "PRODUCT_GENERIC", "PRODUCT_UNSPECIFIED"
];

const eventNames = [
    "GP Travel Organism", "GP Red Badge Viewed", "GP-PlayIntegrity Network Call Failure",
    "GP Transport Organism", "GP Network Error Spin the Wheel", "Dismissed Split bill - Pay to Fauzan Ricky a",
    "Dismissed Split bill - Pay to sabriya", "GP SSL Key Failure", "GP SSL Success Event",
    "Dismissed Pokemon Go Powered by Google Play", "Courier Connect Started", "Mqtt Disconnect",
    "GP SSL Validation Error", "GP Widget Learning Device Selector Clicked", "GP Widget Learning Share Button Clicked",
    "Play Integrity Error", "GP Widget Learning Page Viewed", "GP Widget Tutorial Page Viewed",
    "Dismissed QRIS Cashback Guaranteed", "Push ", "Dismissed 💎WDP MURAAAH"
];

const generatePolicyName = (p) => {
    let typeName = p.action.type.replace('_', ' ');
    typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase();
    
    if (p.action.type === 'OVERRIDE_TS') {
        typeName = 'Override Timestamp';
    } else if (p.action.type === 'DEACTIVATE') {
        typeName = 'Disable';
    }

    let levelName = p.resource.charAt(0).toUpperCase() + p.resource.slice(1).toLowerCase();

    if (p.resource === 'global') return `${typeName} ${levelName}`;
    if (p.resource === 'topic') return `${typeName} ${levelName}: ${p.details.name}`;
    if (p.resource === 'publisher') return `${typeName} ${levelName}: ${p.details.publisher}`;
    if (p.resource === 'event') return `${typeName} ${levelName}: ${p.details.publisher}-${p.details.product}-${p.details.name}`;
    return 'Unknown Policy';
};

const formatConfig = (action) => {
    if (action.type === 'DEACTIVATE') return <span className="text-gray-400 italic">No configuration</span>;
    if (action.type === 'DEDUPLICATION') {
         const ttl = action.threshold?.ttl || action.ttl;
         return <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">TTL: {ttl}</span>;
    }
    
    const parts = [];
    if (action.threshold?.past || action.conditions?.past) {
        parts.push(`Past > ${action.threshold?.past || action.conditions?.past}`);
    }
    if (action.threshold?.future || action.conditions?.future) {
        parts.push(`Future > ${action.threshold?.future || action.conditions?.future}`);
    }
    
    if (parts.length === 0) return <span className="text-gray-400 italic">No limits set</span>;
    
    return (
        <div className="flex flex-col space-y-1">
            {parts.map((p, i) => (
                 <span key={i} className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs inline-block w-max border border-gray-200">
                    {p}
                 </span>
            ))}
        </div>
    );
};

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', icon: Icon, onClick, disabled, type = "button" }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "border border-transparent text-white bg-[#00a550] hover:bg-[#008f45] focus:ring-[#00a550]",
    secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[#00a550]",
    danger: "border border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]}`}>
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

const TooltipWrapper = ({ children, content }) => {
    if (!content) return <>{children}</>;
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-[200px] bg-gray-900 text-white text-xs rounded py-1 px-2 z-50 text-center shadow-lg whitespace-normal leading-tight">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};

const AuditHistoryModal = ({ policy, onClose }) => {
    const mockHistory = [
        {
            id: 1,
            date: "August 13, 2026",
            action: "Update",
            time: "09:47 AM",
            user: "user@gojek.com",
            diffs: [
                 { field: "action.threshold.past", old: "7d", new: "14d" }
            ]
        },
        {
            id: 2,
            date: "August 10, 2026",
            action: "Update",
            time: "08:10 PM",
            user: "siddhanta.rath@gojek.com",
            diffs: [
                { field: "action.type", old: "DROP", new: null }
            ]
        }
    ];

    const [expandedRows, setExpandedRows] = useState({ 1: true, 2: true });

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
            
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-4xl flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center text-gray-900">
                        <History className="w-6 h-6 mr-3 text-[#00a550]" />
                        <h3 className="text-xl font-semibold" id="modal-title">Audit History</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
                    <p className="text-sm text-gray-500 mb-1 font-medium">Viewing history for:</p>
                    <p className="text-base font-semibold text-gray-900">{generatePolicyName(policy)}</p>
                </div>

                <div className="px-6 py-6 overflow-y-auto bg-white flex-1">
                    <div className="space-y-8">
                        {mockHistory.map((item, index) => (
                            <div key={item.id}>
                                <h4 className="text-base font-bold text-gray-900 mb-4">{item.date}</h4>
                                <div className="relative">
                                    {index !== mockHistory.length - 1 && (
                                        <div className="absolute top-6 left-[9px] -ml-px h-[calc(100%+1.5rem)] w-0.5 bg-gray-200" aria-hidden="true"></div>
                                    )}
                                    
                                    <div className="relative flex items-start space-x-4">
                                        <div className="mt-1">
                                            <div className="h-5 w-5 bg-white rounded-full border-2 border-[#00a550] flex items-center justify-center"></div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <button onClick={() => toggleRow(item.id)} className="flex items-center hover:text-gray-700 focus:outline-none group">
                                                     {expandedRows[item.id] ? <ChevronUp className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" /> : <ChevronDown className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700" />}
                                                    <span className="font-medium text-gray-700 text-base">{item.action}</span>
                                                </button>
                                                <span className="mx-2 text-gray-400">•</span>
                                                <span className="text-base">{item.time}</span>
                                                <span className="mx-2 text-gray-400">•</span>
                                                <span className="text-base">{item.user}</span>
                                            </div>

                                            {expandedRows[item.id] && (
                                                <div className="mt-3 border border-gray-200 rounded-lg bg-white overflow-hidden p-5 shadow-sm">
                                                    {item.diffs.map((diff, dIdx) => (
                                                        <div key={dIdx} className={`${dIdx > 0 ? 'mt-4' : ''}`}>
                                                            <div className="text-sm font-medium text-gray-700 mb-3">
                                                                {diff.field}
                                                            </div>
                                                            <div className="space-y-1 font-mono text-sm">
                                                                {diff.old && (
                                                                    <div className="bg-red-50 text-red-700 px-4 py-2.5 rounded flex items-center">
                                                                        <span className="w-8 shrink-0 text-red-500 font-bold select-none text-base">-</span>
                                                                        <span>{diff.old}</span>
                                                                    </div>
                                                                )}
                                                                {diff.new && (
                                                                    <div className="bg-green-50 text-[#00a550] px-4 py-2.5 rounded flex items-center">
                                                                        <span className="w-8 shrink-0 text-[#00a550] font-bold select-none text-base">+</span>
                                                                        <span>{diff.new}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white px-6 py-4 border-t border-gray-200 flex flex-row-reverse shrink-0 rounded-b-lg">
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function App() {
  const [policies, setPolicies] = useState(initialPolicies);
  
  const getRouteInfo = () => {
      if (typeof window === 'undefined') return { page: 'list', id: null };
      const hash = window.location.hash;
      if (hash === '#/create') return { page: 'form', id: null };
      if (hash.startsWith('#/edit/')) return { page: 'form', id: hash.replace('#/edit/', '') };
      return { page: 'list', id: null };
  };

  const [routeInfo, setRouteInfo] = useState(getRouteInfo());
  const currentPage = routeInfo.page;
  const editingPolicyId = routeInfo.id;
  const editingPolicy = policies.find(p => p.id === editingPolicyId) || null;

  useEffect(() => {
      const handleHashChange = () => setRouteInfo(getRouteInfo());
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    try {
        const channel = new BroadcastChannel('policy_sync_channel');
        
        channel.onmessage = (event) => {
            if (event.data.type === 'SYNC_STATE') {
                setPolicies(event.data.payload);
            }
            if (event.data.type === 'REQUEST_STATE') {
                channel.postMessage({ type: 'SYNC_STATE', payload: policies });
            }
        };

        channel.postMessage({ type: 'REQUEST_STATE' });
        
        return () => channel.close();
    } catch (e) {
        console.warn("BroadcastChannel not supported in this environment.", e);
    }
  }, [policies]);
  
  const handleToggleStatus = (id) => {
      setPolicies(currentPolicies => {
          const newPolicies = currentPolicies.map(p => 
              p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p
          );
          try {
              const channel = new BroadcastChannel('policy_sync_channel');
              channel.postMessage({ type: 'SYNC_STATE', payload: newPolicies });
              channel.close();
          } catch(e) {}
          return newPolicies;
      });
  };

  const handleSave = (policyData) => {
      setPolicies(currentPolicies => {
          let newPolicies;
          if (editingPolicy) {
              newPolicies = currentPolicies.map(p => p.id === editingPolicy.id ? { ...policyData, id: p.id, status: p.status } : p);
          } else {
              newPolicies = [...currentPolicies, { ...policyData, id: crypto.randomUUID(), status: 'ACTIVE' }];
          }
          
          try {
              const channel = new BroadcastChannel('policy_sync_channel');
              channel.postMessage({ type: 'SYNC_STATE', payload: newPolicies });
              channel.close();
          } catch(e) {}
          return newPolicies;
      });
      window.location.hash = '';
  };

  const navigateToCreate = () => {
      const createUrl = `${window.location.origin}${window.location.pathname}#/create`;
      window.open(createUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Platform Governance</h1>
            </div>
            <div className="flex items-center space-x-4">
               <Badge variant="blue">Admin only</Badge>
               <div className="h-8 w-8 rounded-full bg-[#00a550] flex items-center justify-center text-white font-bold text-sm">
                 PC
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
          {currentPage === 'list' ? (
            <PolicyList 
              policies={policies} 
              onToggleStatus={handleToggleStatus}
              onCreateClick={navigateToCreate}
            />
          ) : (
            <PolicyForm 
              key={editingPolicy ? editingPolicy.id : 'new'}
              initialData={editingPolicy} 
              onSave={handleSave} 
              onCancel={() => window.location.hash = ''} 
            />
          )}
        </main>
      </div>
    </div>
  );
}

function PolicyList({ policies, onToggleStatus, onCreateClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterResource, setFilterResource] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [statusTogglePolicy, setStatusTogglePolicy] = useState(null);
  const [viewingAuditFor, setViewingAuditFor] = useState(null);
  const itemsPerPage = 5;

  const filteredPolicies = policies.filter(p => {
    const policyName = generatePolicyName(p);
    const matchesSearch = policyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || p.action.type === filterType;
    const matchesResource = filterResource === 'All' || p.resource === filterResource.toLowerCase();
    const matchesStatus = filterStatus === 'All' || (p.status || 'ACTIVE') === filterStatus;
    return matchesSearch && matchesType && matchesResource && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const paginatedPolicies = filteredPolicies.slice((currentPageNum - 1) * itemsPerPage, currentPageNum * itemsPerPage);

  const activeCount = policies.filter(p => p.status === 'ACTIVE').length;
  const inactiveCount = policies.length - activeCount;
  
  const getSubBreakdown = (type) => {
      const filtered = policies.filter(p => p.action.type === type);
      const total = filtered.length;
      if (total === 0) return null;
      const counts = { global: 0, topic: 0, event: 0, publisher: 0 };
      filtered.forEach(p => counts[p.resource]++);
      return (
          <div className="flex flex-col gap-2 text-sm">
              {Object.entries(counts).map(([k, v]) => v > 0 && (
                  <div key={k} className="flex items-center justify-between gap-3"><span className="text-gray-500 capitalize">{k}</span><span className="font-semibold text-gray-800">{v}</span></div>
              ))}
          </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Governance Policies</h2>
            <p className="text-sm text-gray-500 mt-1">Manage rules for data ingestion, deduplication, and overriding.</p>
        </div>
        <Button icon={Plus} onClick={onCreateClick}>Create Policy</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
          <span className="text-6xl font-bold text-[#00a550]">{policies.length}</span>
          <span className="mt-4 text-2xl font-medium text-gray-500">Total</span>
        </div>

        <div className="flex h-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex w-1/2 flex-col items-center justify-center border-r border-gray-200 px-3 text-center">
            <span className="text-6xl font-bold text-[#00a550]">{policies.filter(p => p.action.type === 'DEACTIVATE').length}</span>
            <span className="mt-4 text-xl font-medium text-gray-500">Disable</span>
          </div>
          <div className="flex w-1/2 flex-col justify-center gap-3 px-4">
            {getSubBreakdown('DEACTIVATE')}
          </div>
        </div>

        <div className="flex h-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex w-1/2 flex-col items-center justify-center border-r border-gray-200 px-3 text-center">
            <span className="text-6xl font-bold text-[#00a550]">{policies.filter(p => p.action.type === 'DROP').length}</span>
            <span className="mt-4 text-xl font-medium text-gray-500">Drop</span>
          </div>
          <div className="flex w-1/2 flex-col justify-center gap-3 px-4">
            {getSubBreakdown('DROP')}
          </div>
        </div>

        <div className="flex h-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex w-1/2 flex-col items-center justify-center border-r border-gray-200 px-3 text-center">
            <span className="text-6xl font-bold text-[#00a550]">{policies.filter(p => p.action.type === 'OVERRIDE_TS').length}</span>
            <span className="mt-4 text-xl font-medium leading-tight text-gray-500">Override<br />Timestamp</span>
          </div>
          <div className="flex w-1/2 flex-col justify-center gap-3 px-4">
            {getSubBreakdown('OVERRIDE_TS')}
          </div>
        </div>

        <div className="flex h-52 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
          <span className="text-6xl font-bold text-[#00a550]">{policies.filter(p => p.action.type === 'DEDUPLICATION').length}</span>
          <span className="mt-4 text-xl font-medium text-gray-500">Deduplication</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-t-lg border-b border-gray-200 shadow-sm flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 relative rounded-md shadow-sm min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-[#00a550] focus:border-[#00a550] block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border bg-white"
            placeholder="Search by generated policy name..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPageNum(1);}}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2 shrink-0">
            <select 
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm rounded-md border bg-white"
                value={filterType}
                onChange={(e) => {setFilterType(e.target.value); setCurrentPageNum(1);}}
            >
                <option value="All">All Types</option>
                <option value="DEACTIVATE">Disable</option>
                <option value="DROP">Drop</option>
                <option value="OVERRIDE_TS">Override Timestamp</option>
                <option value="DEDUPLICATION">Deduplication</option>
            </select>

            <select 
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm rounded-md border bg-white"
                value={filterResource}
                onChange={(e) => {setFilterResource(e.target.value); setCurrentPageNum(1);}}
            >
                <option value="All">All Scopes</option>
                <option value="Event">Specific Event</option>
                <option value="Topic">Kafka Topic</option>
                <option value="Global">Global</option>
                <option value="Publisher">Publisher</option>
            </select>
            
            <select 
                className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00a550] focus:border-[#00a550] sm:text-sm rounded-md border bg-white"
                value={filterStatus}
                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPageNum(1);}}
            >
                <option value="All">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
            </select>
        </div>
      </div>

      {}
      <div className="bg-white shadow-sm rounded-b-lg border border-gray-200 border-t-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level (Resource)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configuration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPolicies.length > 0 ? (
                paginatedPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 max-w-xs break-words whitespace-normal" title={generatePolicyName(policy)}>
                          <button onClick={() => setViewingAuditFor(policy)} className="hover:text-[#00a550] hover:underline text-left outline-none">
                              {generatePolicyName(policy)}
                          </button>
                      </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-700">{policy.resource}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">
                        {policy.action.type === 'OVERRIDE_TS' ? 'Override Timestamp' : 
                         policy.action.type === 'DEACTIVATE' ? 'Disable' : 
                         policy.action.type.charAt(0) + policy.action.type.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-600 font-medium">{formatConfig(policy.action)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={policy.status === 'ACTIVE' ? 'success' : 'default'}>
                        {policy.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-3">
                        <TooltipWrapper content="View Audit History">
                            <button onClick={() => setViewingAuditFor(policy)} className="text-gray-400 hover:text-blue-600 transition-colors">
                                <History className="w-4 h-4" />
                            </button>
                        </TooltipWrapper>

                        <TooltipWrapper content={policy.isEditable === false ? "Only @clickstream-support team is able edit or modify this policy." : "Edit Policy"}>
                            <div className="inline-flex items-center space-x-3 ml-2">
                                <a 
                                    href={policy.isEditable === false ? undefined : `#/edit/${policy.id}`}
                                    target={policy.isEditable === false ? undefined : "_blank"}
                                    rel="noreferrer"
                                    className={`transition-colors flex items-center ${policy.isEditable === false ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-blue-600'}`} 
                                    onClick={(e) => { if(policy.isEditable === false) e.preventDefault(); }}
                                >
                                    <Pencil className="w-4 h-4" />
                                </a>
                                
                                <button 
                                    onClick={() => policy.isEditable !== false && setStatusTogglePolicy(policy)} 
                                    className={`transition-colors ${policy.isEditable === false ? 'text-gray-300 cursor-not-allowed' : (policy.status === 'ACTIVE' ? 'text-[#00a550] hover:text-red-600' : 'text-gray-400 hover:text-[#00a550]')}`} 
                                    disabled={policy.isEditable === false}
                                >
                                    <Power className="w-4 h-4" />
                                </button>
                            </div>
                        </TooltipWrapper>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p>No policies found matching your filters.</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPageNum - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPageNum * itemsPerPage, filteredPolicies.length)}</span> of <span className="font-medium">{filteredPolicies.length}</span> results
                </p>
                </div>
                <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => setCurrentPageNum(p => Math.max(1, p - 1))}
                        disabled={currentPageNum === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPageNum(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPageNum === i + 1 ? 'z-10 bg-green-50 border-[#00a550] text-[#00a550]' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPageNum(p => Math.min(totalPages, p + 1))}
                        disabled={currentPageNum === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                </nav>
                </div>
            </div>
            </div>
        )}
      </div>

      {statusTogglePolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setStatusTogglePolicy(null)}></div>
              
              <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg border border-gray-200 flex flex-col max-h-[90vh]">
                  
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                      <div className="sm:flex sm:items-start">
                          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${statusTogglePolicy.status === 'ACTIVE' ? 'bg-red-100' : 'bg-green-100'}`}>
                              <Power className={`h-6 w-6 ${statusTogglePolicy.status === 'ACTIVE' ? 'text-red-600' : 'text-[#00a550]'}`} aria-hidden="true" />
                          </div>
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                  {statusTogglePolicy.status === 'ACTIVE' ? 'Disable Policy' : 'Activate Policy'}
                              </h3>
                              <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                      Are you sure you want to {statusTogglePolicy.status === 'ACTIVE' ? 'disable' : 'enable'} the policy <span className="font-semibold text-gray-700">{generatePolicyName(statusTogglePolicy)}</span>? 
                                      {statusTogglePolicy.status === 'ACTIVE' ? ' It will stop evaluating incoming events until enabled again.' : ' It will begin evaluating events immediately.'}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse space-x-2 space-x-reverse border-t border-gray-100 shrink-0">
                      <Button variant={statusTogglePolicy.status === 'ACTIVE' ? 'danger' : 'primary'} onClick={() => { onToggleStatus(statusTogglePolicy.id); setStatusTogglePolicy(null); }}>
                          {statusTogglePolicy.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="secondary" onClick={() => setStatusTogglePolicy(null)}>
                          Cancel
                      </Button>
                  </div>
              </div>
          </div>
      )}

      {viewingAuditFor && (
          <AuditHistoryModal policy={viewingAuditFor} onClose={() => setViewingAuditFor(null)} />
      )}
    </div>
  );
}

function PolicyForm({ initialData, onSave, onCancel }) {
    const isEdit = !!initialData;
    const isEditable = initialData ? initialData.isEditable !== false : true;

    const [ruleType, setRuleType] = useState(initialData?.action?.type || 'OVERRIDE_TS');
    
    // Step 1: Scope
    const [resourceLevel, setResourceLevel] = useState(initialData?.resource || '');
    const scopeComplete = isEdit || !!resourceLevel;
    
    // Step 2: Resource Details
    const [selectedPublisher, setSelectedPublisher] = useState(initialData?.details?.publisher || '');
    const [selectedTopic, setSelectedTopic] = useState(initialData?.resource === 'topic' ? initialData.details.name : '');
    const [selectedProduct, setSelectedProduct] = useState(initialData?.details?.product || '');
    const [selectedEventName, setSelectedEventName] = useState(initialData?.resource === 'event' ? initialData.details.name : '');

    // Step 3: Thresholds
    const [pastUnit, setPastUnit] = useState(initialData?.action?.threshold?.past?.slice(-1) || initialData?.action?.conditions?.past?.slice(-1) || 'h');
    const [pastValue, setPastValue] = useState(initialData?.action?.threshold?.past?.slice(0, -1) || initialData?.action?.conditions?.past?.slice(0, -1) || '2');
    const [usePast, setUsePast] = useState(!!(initialData?.action?.threshold?.past || initialData?.action?.conditions?.past));
    
    const [futureUnit, setFutureUnit] = useState(initialData?.action?.threshold?.future?.slice(-1) || initialData?.action?.conditions?.future?.slice(-1) || 'h');
    const [futureValue, setFutureValue] = useState(initialData?.action?.threshold?.future?.slice(0, -1) || initialData?.action?.conditions?.future?.slice(0, -1) || '2');
    const [useFuture, setUseFuture] = useState(!!(initialData?.action?.threshold?.future || initialData?.action?.conditions?.future) || (!isEdit && ruleType === 'OVERRIDE_TS'));
    
    const [dedupTtl, setDedupTtl] = useState(initialData?.action?.type === 'DEDUPLICATION' ? (initialData.action.threshold?.ttl || initialData.action.ttl || '24h') : '24h');

    // Progressive Disclosure Validation: Is Step 2 complete?
    const isStep2Complete = () => {
        if (resourceLevel === 'global') return true;
        if (resourceLevel === 'publisher') return !!selectedPublisher;
        if (resourceLevel === 'topic') return !!selectedTopic;
        if (resourceLevel === 'event') return !!selectedPublisher && !!selectedProduct && !!selectedEventName;
        return false;
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        let details = {};
        if (resourceLevel === 'publisher') {
            details = { publisher: selectedPublisher };
        } else if (resourceLevel === 'topic') {
            details = { name: selectedTopic };
        } else if (resourceLevel === 'event') {
            details = { name: selectedEventName, product: selectedProduct, publisher: selectedPublisher };
        }

        let action = { type: ruleType };
        
        if (ruleType === 'DROP') {
            action.conditionType = "timestamp_threshold";
            action.threshold = {};
            if (usePast) action.threshold.past = `${pastValue}${pastUnit}`;
            if (useFuture) action.threshold.future = `${futureValue}${futureUnit}`;
        } else if (ruleType === 'OVERRIDE_TS') {
            action.conditions = {};
            if (usePast) action.conditions.past = `${pastValue}${pastUnit}`;
            if (useFuture) action.conditions.future = `${futureValue}${futureUnit}`;
        } else if (ruleType === 'DEDUPLICATION') {
             action.conditionType = "ttl_threshold";
             action.threshold = { ttl: dedupTtl };
        }

        onSave({ resource: resourceLevel, details, action });
    };

    const ruleTypeInfo = {
        DROP: { title: 'Drop Events', desc: 'Discard events that match specific timestamp conditions.' },
        OVERRIDE_TS: { title: 'Override Event Timestamp with Arrival Time', desc: 'Replace unreliable client timestamps with server-side arrival time. Original preserved in event.original_timestamp.' },
        DEDUPLICATION: { title: 'Event Deduplication', desc: 'Prevent duplicate events from being processed based on a TTL.' },
        DEACTIVATE: { title: 'Disable Event Ingestion', desc: 'Stop processing and drop all events for the selected scope.' },
    };

    return (
        <div className="max-w-4xl mx-auto p-2 sm:p-6 md:p-8">
            {!isEditable && (
                <div className="mb-6 flex items-center text-amber-600 bg-amber-50 px-4 py-3 rounded-md border border-amber-200">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <div>
                        <h4 className="text-sm font-bold">Read-Only View</h4>
                        <p className="text-sm mt-0.5">You do not have permission to edit this policy. Only the @clickstream-support team can modify it.</p>
                    </div>
                </div>
            )}

            {/* Rule Type Tabs Navigation */}
            <div className="flex items-end border-b border-gray-200 mb-6 space-x-1 overflow-x-auto">
                {[
                    { id: 'DROP', label: 'Drop', icon: <AlertCircle className="w-4 h-4 mr-2" /> },
                    { id: 'OVERRIDE_TS', label: 'Override Timestamp', icon: <Settings className="w-4 h-4 mr-2" /> },
                    { id: 'DEACTIVATE', label: 'Disable', icon: <X className="w-4 h-4 mr-2" /> },
                    { id: 'DEDUPLICATION', label: 'Deduplication', icon: <Layers className="w-4 h-4 mr-2" /> }
                ].map((tab) => {
                    const isActive = ruleType === tab.id;
                    const isTabDisabled = isEdit && !isActive;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            disabled={isTabDisabled}
                            onClick={() => {
                                if (isTabDisabled) return;
                                setRuleType(tab.id);
                                if (tab.id === 'DEACTIVATE' && resourceLevel === 'global') setResourceLevel('topic');
                                if (tab.id === 'DEDUPLICATION' && resourceLevel !== 'publisher') setResourceLevel('publisher');
                            }}
                            className={`flex items-center px-4 py-2 rounded-t-lg border-t border-l border-r font-medium text-sm transition-colors whitespace-nowrap ${isActive ? 'bg-white border-gray-200 text-[#00a550] shadow-[0_-2px_0_0_#00a550] translate-y-[1px]' : 'bg-gray-50 border-transparent text-gray-500 border-b-gray-200'} ${isTabDisabled ? 'opacity-40 cursor-not-allowed' : (!isActive ? 'hover:bg-gray-100 hover:text-gray-700' : '')}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Form Card */}
            <form onSubmit={handleSave} className="bg-white shadow rounded-lg border border-gray-200 p-6 md:p-8">
                <div className="mb-10 border-b border-gray-100 pb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{ruleTypeInfo[ruleType].title}</h2>
                    <p className="text-gray-500 text-sm">{ruleTypeInfo[ruleType].desc}</p>
                </div>

                <fieldset disabled={!isEditable} className={!isEditable ? 'opacity-70' : ''}>
                    
                    {/* 1. Scope Selection */}
                    <div className="mb-10">
                        <h3 className="text-sm font-bold text-gray-900 mb-5">1. Scope</h3>
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                            {['global', 'publisher', 'topic', 'event'].map((level) => {
                                const labels = { global: 'All Events (Global)', publisher: 'Publisher Level', topic: 'Kafka Topic', event: 'Specific Event' };
                                const isDeactivateGlobal = ruleType === 'DEACTIVATE' && level === 'global';
                                const isDedupNonPublisher = ruleType === 'DEDUPLICATION' && level !== 'publisher';
                                // Lock the scope if editing
                                const isDisabled = isEdit || isDeactivateGlobal || isDedupNonPublisher || !isEditable;

                                return (
                                    <label key={level} className={`flex items-center ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group'}`}>
                                        <input
                                            type="radio"
                                            name="resourceLevel"
                                            value={level}
                                            checked={resourceLevel === level}
                                            disabled={isDisabled}
                                            onChange={(e) => {
                                                setResourceLevel(e.target.value);
                                                setSelectedPublisher('');
                                                setSelectedTopic('');
                                                setSelectedProduct('');
                                                setSelectedEventName('');
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:cursor-not-allowed cursor-pointer"
                                        />
                                        <span className={`ml-2 text-sm ${resourceLevel === level ? 'text-gray-900' : 'text-gray-600'} group-hover:text-gray-900 transition-colors`}>
                                            {labels[level]}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Resource Details */}
                    {resourceLevel !== 'global' && (
                        <fieldset disabled={!scopeComplete} className={`mb-10 transition-opacity duration-300 ${!scopeComplete ? 'opacity-40 select-none' : ''}`}>
                            <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center">
                                2. Resource Details
                            </h3>
                            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50/50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    
                                    {['event', 'publisher'].includes(resourceLevel) && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Publisher Name <span className="text-red-500">*</span></label>
                                            <select 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                                value={selectedPublisher}
                                                onChange={(e) => {
                                                    setSelectedPublisher(e.target.value);
                                                    setSelectedProduct('');
                                                    setSelectedEventName('');
                                                }}
                                                // Lock if editing
                                                disabled={isEdit || !isEditable}
                                                required
                                            >
                                                <option value="" disabled>Select a publisher</option>
                                                {publishers.map(pub => <option key={pub} value={pub}>{pub}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {resourceLevel === 'topic' && (
                                        <div className="md:col-span-2 lg:col-span-3 max-w-2xl">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kafka Topic <span className="text-red-500">*</span></label>
                                            <select 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                                value={selectedTopic}
                                                onChange={(e) => setSelectedTopic(e.target.value)}
                                                // Lock if editing
                                                disabled={isEdit || !isEditable}
                                                required
                                            >
                                                <option value="" disabled>Select a topic</option>
                                                {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    )}

                                    {resourceLevel === 'event' && (
                                        <>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 transition-colors ${!selectedPublisher && !isEdit ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    Product <span className="text-red-500">*</span>
                                                </label>
                                                <select 
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                                    value={selectedProduct}
                                                    onChange={(e) => {
                                                        setSelectedProduct(e.target.value);
                                                        setSelectedEventName('');
                                                    }}
                                                    // Lock if editing, OR disable until publisher is selected
                                                    disabled={isEdit || !selectedPublisher || !isEditable}
                                                    required
                                                >
                                                    <option value="" disabled>Select a product</option>
                                                    {productValues.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium mb-1 transition-colors ${!selectedProduct && !isEdit ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    Event Name <span className="text-red-500">*</span>
                                                </label>
                                                <select 
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                                    value={selectedEventName}
                                                    onChange={(e) => setSelectedEventName(e.target.value)}
                                                    // Lock if editing, OR disable until product is selected
                                                    disabled={isEdit || !selectedProduct || !isEditable}
                                                    required
                                                >
                                                    <option value="" disabled>Select an event</option>
                                                    {eventNames.map(en => <option key={en} value={en}>{en}</option>)}
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </fieldset>
                    )}

                    {/* 3. Configuration */}
                    {ruleType !== 'DEACTIVATE' && (
                        <div className="mb-10">
                            <h3 className={`text-sm font-bold mb-5 transition-colors ${isStep2Complete() ? 'text-gray-900' : 'text-gray-400'}`}>
                                {resourceLevel === 'global' ? '2' : '3'}. {ruleType === 'DEDUPLICATION' ? 'Deduplication Settings' : 'Override Conditions (select all that apply)'}
                            </h3>
                            
                            {/* Disabled entirely if Step 2 is incomplete */}
                            <fieldset disabled={!isStep2Complete()} className={`space-y-5 transition-opacity duration-300 ${!isStep2Complete() ? 'opacity-40 select-none' : ''}`}>
                                
                                {['DROP', 'OVERRIDE_TS'].includes(ruleType) && (
                                    <>
                                        <label className={`flex items-start ${isStep2Complete() ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input type="checkbox" checked={useFuture} onChange={(e) => setUseFuture(e.target.checked)} className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${isStep2Complete() ? 'cursor-pointer' : 'cursor-not-allowed'}`} />
                                            </div>
                                            <div className="ml-3 text-sm flex-1">
                                                <span className={`font-medium ${isStep2Complete() ? 'text-gray-700' : 'text-gray-500'}`}>Timestamp is in the future beyond...</span>
                                                {useFuture && (
                                                    <div className="mt-3 flex items-center space-x-2">
                                                        <input 
                                                            type="number" min="1" required={useFuture}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100" 
                                                            value={futureValue} onChange={e => setFutureValue(e.target.value)} 
                                                        />
                                                        <select 
                                                            className="block w-28 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border bg-white disabled:bg-gray-100"
                                                            value={futureUnit} onChange={e => setFutureUnit(e.target.value)}
                                                        >
                                                            <option value="m">Minutes</option>
                                                            <option value="h">hours</option>
                                                            <option value="d">days</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        <label className={`flex items-start ${isStep2Complete() ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input type="checkbox" checked={usePast} onChange={(e) => setUsePast(e.target.checked)} className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${isStep2Complete() ? 'cursor-pointer' : 'cursor-not-allowed'}`} />
                                            </div>
                                            <div className="ml-3 text-sm flex-1">
                                                <span className={`font-medium ${isStep2Complete() ? 'text-gray-700' : 'text-gray-500'}`}>Timestamp is in the past beyond...</span>
                                                {usePast && (
                                                    <div className="mt-3 flex items-center space-x-2">
                                                        <input 
                                                            type="number" min="1" required={usePast}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100" 
                                                            value={pastValue} onChange={e => setPastValue(e.target.value)} 
                                                        />
                                                        <select 
                                                            className="block w-28 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border bg-white disabled:bg-gray-100"
                                                            value={pastUnit} onChange={e => setPastUnit(e.target.value)}
                                                        >
                                                            <option value="m">Minutes</option>
                                                            <option value="h">hours</option>
                                                            <option value="d">days</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </>
                                )}

                                {ruleType === 'DEDUPLICATION' && (
                                    <div className="max-w-md">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time-To-Live (TTL)</label>
                                        <div className="flex rounded-md shadow-sm">
                                            <input 
                                                type="text" 
                                                required
                                                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2 border disabled:bg-gray-100" 
                                                placeholder="e.g. 24h, 30m"
                                                value={dedupTtl}
                                                onChange={e => setDedupTtl(e.target.value)} 
                                            />
                                            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                duration
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">Duration to retain event IDs for duplicate checking.</p>
                                    </div>
                                )}
                            </fieldset>
                        </div>
                    )}
                </fieldset>
                
                {/* Form Actions */}
                <div className="mt-12 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        {isEditable ? 'Discard' : 'Close'}
                    </button>
                    {isEditable && (
                        <button 
                            type="submit" 
                            disabled={!isStep2Complete()}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00a550] hover:bg-[#008f45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a550] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isEdit ? 'Save Changes' : 'Publish Changes'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
