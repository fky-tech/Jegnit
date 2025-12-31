import { X, User, Phone, MapPin, CreditCard, DollarSign, Package, Copy, Check, Globe, Maximize2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Conditional Leaflet imports to avoid SSR errors
let L: any;
let icon: any = null;

if (typeof window !== 'undefined') {
    L = require('leaflet');
    icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });
}

interface OrderDetailsModalProps {
    order: any;
    onClose: () => void;
    getStatusInfo: (status: string) => any;
}

export default function OrderDetailsModal({ order, onClose, getStatusInfo }: OrderDetailsModalProps) {
    const { addNotification } = useNotification();
    const [showMap, setShowMap] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mapFullscreen, setMapFullscreen] = useState(false);

    // Google Maps States
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const [googleError, setGoogleError] = useState(false);
    const googleMapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showMap && order.latitude && order.longitude) {
            const loadGoogleMaps = async () => {
                try {
                    // Ensure we are in the browser
                    if (typeof window === 'undefined') return;

                    // Check if already loaded and ready
                    if (window.google?.maps) {
                        setIsGoogleLoaded(true);
                        // Initialize map immediately if ref is ready
                        if (googleMapRef.current) {
                            try {
                                const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                                const map = new Map(googleMapRef.current, {
                                    center: { lat: order.latitude, lng: order.longitude },
                                    zoom: 15,
                                    mapId: "ORDER_VIEW_MAP",
                                    disableDefaultUI: true,
                                    zoomControl: true
                                });

                                new AdvancedMarkerElement({
                                    map,
                                    position: { lat: order.latitude, lng: order.longitude },
                                    title: "Delivery Location",
                                });
                            } catch (error) {
                                console.error("Error initializing map:", error);
                                setGoogleError(true);
                            }
                        }
                        return;
                    }

                    // Check if script already exists in document
                    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
                    if (existingScript) {
                        // Script exists, wait for google object
                        const waitForGoogle = setInterval(() => {
                            if (window.google?.maps) {
                                clearInterval(waitForGoogle);
                                setIsGoogleLoaded(true);
                            }
                        }, 100);
                        return;
                    }

                    // Direct script injection
                    const script = document.createElement('script');
                    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`;
                    script.async = true;
                    script.defer = true;

                    script.onload = () => {
                        // Poll until google.maps is available
                        const checkGoogle = setInterval(() => {
                            if (window.google?.maps) {
                                clearInterval(checkGoogle);
                                setIsGoogleLoaded(true);
                            }
                        }, 50);

                        // Timeout after 10 seconds
                        setTimeout(() => {
                            clearInterval(checkGoogle);
                            if (!window.google?.maps) {
                                console.error("Google Maps failed to initialize");
                                setGoogleError(true);
                            }
                        }, 10000);
                    };

                    script.onerror = () => {
                        console.error("Failed to load Google Maps script");
                        setGoogleError(true);
                    };

                    document.head.appendChild(script);
                } catch (e) {
                    console.error("Google Maps load error:", e);
                    setGoogleError(true);
                }
            };
            loadGoogleMaps();
        }
    }, [showMap, order.latitude, order.longitude]);

    // Initialize map when Google Maps becomes available
    useEffect(() => {
        const initMap = async () => {
            if (!isGoogleLoaded || !window.google?.maps || !googleMapRef.current || !showMap) return;
            if (!order.latitude || !order.longitude) return;

            try {
                const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                const map = new Map(googleMapRef.current, {
                    center: { lat: order.latitude, lng: order.longitude },
                    zoom: 15,
                    mapId: "ORDER_VIEW_MAP",
                    disableDefaultUI: true,
                    zoomControl: true
                });

                new AdvancedMarkerElement({
                    map,
                    position: { lat: order.latitude, lng: order.longitude },
                    title: "Delivery Location",
                });
            } catch (error) {
                console.error("Error initializing map:", error);
                setGoogleError(true);
            }
        };

        initMap();
    }, [isGoogleLoaded, showMap, order.latitude, order.longitude, mapFullscreen]);

    if (!order) return null;

    const hasCoords = order.latitude && order.longitude;

    const handleCopy = () => {
        navigator.clipboard.writeText(order.customer_address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePhoneCopy = () => {
        navigator.clipboard.writeText(order.customer_phone);
        addNotification('Phone number copied!', 'success');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity" />
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 mt-16 md:mt-0">
                {/* Modal Header */}
                <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">Order Details</h3>
                        <p className="text-xs text-gray-400 font-mono tracking-widest mt-1">ID: #{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3" /> Customer Information
                            </h4>
                            <div className="space-y-3 text-black">
                                <p className="font-bold text-gray-900">{order.customer_name}</p>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-3.5 h-3.5" /> {order.customer_phone}
                                    <button onClick={handlePhoneCopy} className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-[#ff6a00]" title="Copy Phone">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </p>

                                <div className="group relative">
                                    <button
                                        onClick={() => hasCoords && setShowMap(!showMap)}
                                        className={`w-full text-left p-3 rounded-xl border transition-all ${hasCoords
                                            ? 'border-orange-100 bg-orange-50/30 hover:bg-orange-50 hover:border-orange-200 cursor-pointer shadow-sm active:scale-[0.99]'
                                            : 'border-gray-100 bg-gray-50/30 cursor-default'
                                            }`}
                                    >
                                        <div className="flex items-start gap-2 text-sm pr-8">
                                            <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${hasCoords ? 'text-[#ff6a00]' : 'text-gray-400'}`} />
                                            <span className={`${hasCoords ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                {order.customer_address}
                                            </span>
                                        </div>
                                        {hasCoords && (
                                            <div className="mt-2 flex items-center gap-1.5 font-bold">
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#ff6a00] text-white rounded-full animate-in fade-in slide-in-from-left-2 flex items-center gap-1">
                                                    {isGoogleLoaded && !googleError && <Globe className="w-2.5 h-2.5" />}
                                                    {showMap ? 'Close Map' : 'View on Map'}
                                                </span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Copy Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                                        className="absolute top-3 right-3 p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-[#ff6a00] hover:border-[#ff6a00]/30 transition-all z-10 active:scale-90"
                                        title="Copy Address"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>

                                {showMap && hasCoords && (
                                    <>
                                        {mapFullscreen ? createPortal(
                                            <div className="fixed inset-0 z-[99999] bg-white w-screen h-screen flex flex-col">
                                                <div className="relative w-full h-full flex-1">
                                                    {isGoogleLoaded && !googleError ? (
                                                        <div ref={googleMapRef} className="w-full h-full" style={{ minHeight: '100vh' }} />
                                                    ) : (
                                                        <MapContainer
                                                            center={[order.latitude, order.longitude]}
                                                            zoom={15}
                                                            scrollWheelZoom={true}
                                                            style={{ height: '100vh', width: '100vw' }}
                                                        >
                                                            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                                            <Marker position={[order.latitude, order.longitude]} icon={icon!} />
                                                        </MapContainer>
                                                    )}
                                                    <button
                                                        onClick={() => setMapFullscreen(false)}
                                                        className="absolute top-4 right-4 z-[10000] p-3 bg-white/95 rounded-xl shadow-2xl border border-gray-200 hover:bg-gray-50 transition-all font-bold text-gray-700 flex items-center gap-2"
                                                    >
                                                        <X className="w-5 h-5" /> Close Fullscreen
                                                    </button>
                                                </div>
                                            </div>,
                                            document.body
                                        ) : (
                                            <div className="h-48 w-full rounded-xl overflow-hidden border border-[#ff6a00]/20 animate-in fade-in zoom-in-95 shadow-lg relative">
                                                {isGoogleLoaded && !googleError ? (
                                                    <div ref={googleMapRef} className="w-full h-full" />
                                                ) : (
                                                    <MapContainer
                                                        center={[order.latitude, order.longitude]}
                                                        zoom={15}
                                                        scrollWheelZoom={true}
                                                        style={{ height: '100%', width: '100%' }}
                                                    >
                                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                                                        <Marker position={[order.latitude, order.longitude]} icon={icon!} />
                                                    </MapContainer>
                                                )}
                                                <button
                                                    onClick={() => setMapFullscreen(true)}
                                                    className="absolute top-2 right-2 z-[1000] p-2 bg-white/95 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
                                                    title="Fullscreen"
                                                >
                                                    <Maximize2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Order Meta */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="w-3 h-3" /> Payment & Status
                            </h4>
                            <div className="space-y-2 text-black">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Method:</span>
                                    <span className="text-sm font-bold uppercase">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getStatusInfo(order.status).color}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Date:</span>
                                    <span className="text-sm font-bold">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Items List */}
                    < div className="space-y-4 mb-8" >
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Package className="w-3 h-3" /> Order Items
                        </h4>
                        <div className="border border-gray-100 rounded-2xl overflow-hidden text-black">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Product</th>
                                        <th className="px-4 py-3 text-center">Size/Color</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items?.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 font-bold text-gray-900">
                                                {item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span className="text-[10px] font-black bg-gray-100 px-1.5 py-0.5 rounded uppercase">{item.size}</span>
                                                    {item.color && (
                                                        <span className="text-[10px] font-black bg-orange-100 text-[#ff6a00] px-1.5 py-0.5 rounded uppercase">{item.color}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold">
                                                ETB {(item.price * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div >

                    {/* Summary */}
                    <div className="bg-gray-50 p-6 rounded-2xl space-y-3 text-black">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>ETB {(order.fees?.subtotal ?? (order.total - (order.fees?.shipping ?? 0))).toFixed(2)}</span>
                        </div>
                        {order.fees?.shipping > 0 && (
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery Fee</span>
                                <span>ETB {order.fees.shipping.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-black text-gray-900 border-t border-gray-200 pt-3 mt-3">
                            <span className="flex items-center gap-2 uppercase tracking-widest"><DollarSign className="w-5 h-5 text-[#ff6a00]" /> Total</span>
                            <span className="text-[#ff6a00]">ETB {(order.total || order.fees?.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                < div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end" >
                    <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        Close
                    </button>
                </div >
            </div >
        </div >
    );
}
