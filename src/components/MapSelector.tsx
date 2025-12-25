'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Maximize2, MapPin, Globe } from 'lucide-react';

// Fix for default Leaflet icons
const icon: any = typeof window !== 'undefined' ? L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
}) : null;

interface MapSelectorProps {
    onLocationSelect: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
}

// --- LEAFLET FALLBACK COMPONENTS ---
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number, address: string) => void }) {
    const [position, setPosition] = useState<L.LatLng | null>(null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            reverseGeocode(e.latlng.lat, e.latlng.lng);
        },
    });

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            const address = data.display_name || `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            onLocationSelect(lat, lng, address);
        } catch (error) {
            console.error('Geocoding error:', error);
            onLocationSelect(lat, lng, `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    };

    return position === null ? null : (
        <Marker position={position} icon={icon as any} />
    );
}



// --- MAIN MAP SELECTOR ---
export default function MapSelector({ onLocationSelect, initialLat = 9.0333, initialLng = 38.7500 }: MapSelectorProps) {
    const [mounted, setMounted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([initialLat, initialLng]);

    // Google Maps States
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const [googleError, setGoogleError] = useState(false);
    const googleMapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<google.maps.Map | null>(null);
    const markerInstance = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);



    useEffect(() => {
        setMounted(true);
        const loadGoogleMaps = async () => {
            try {
                // Ensure we are in the browser
                if (typeof window === 'undefined') return;

                // Check if already loaded
                if (window.google?.maps) {
                    setIsGoogleLoaded(true);
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

                // Direct script injection - simpler and more reliable
                const script = document.createElement('script');
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
                script.async = true;
                script.defer = true;

                script.onload = () => {
                    // Poll until google.maps is available (usually immediate after onload)
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
    }, []);

    const initGoogleMap = useCallback(async () => {
        if (!googleMapRef.current || !isGoogleLoaded || !window.google?.maps) return;

        try {
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

            const map = new Map(googleMapRef.current, {
                center: { lat: mapCenter[0], lng: mapCenter[1] },
                zoom: 15,
                mapId: "DEMO_MAP_ID",
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            });

            mapInstance.current = map;

            map.addListener("click", async (e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    await updateMarker(lat, lng);
                    await reverseGeocodeGoogle(lat, lng);
                }
            });
        } catch (error) {
            console.error("Error initializing Google Map:", error);
            setGoogleError(true);
        }
    }, [isGoogleLoaded, mapCenter]);

    useEffect(() => {
        if (isGoogleLoaded && !googleError) {
            initGoogleMap();
        }
    }, [isGoogleLoaded, googleError, initGoogleMap, isFullscreen]);

    const updateMarker = async (lat: number, lng: number) => {
        if (!mapInstance.current || !window.google?.maps) return;

        try {
            if (markerInstance.current) {
                markerInstance.current.position = { lat, lng };
            } else {
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
                markerInstance.current = new AdvancedMarkerElement({
                    map: mapInstance.current,
                    position: { lat, lng },
                    title: "Delivery Location",
                });
            }
            mapInstance.current.panTo({ lat, lng });
        } catch (error) {
            console.error("Error updating marker:", error);
        }
    };

    const reverseGeocodeGoogle = async (lat: number, lng: number) => {
        if (!window.google?.maps) return;
        try {
            const { Geocoder } = await google.maps.importLibrary("geocoding") as google.maps.GeocodingLibrary;
            const geocoder = new Geocoder();
            const response = await geocoder.geocode({ location: { lat, lng } });
            if (response.results[0]) {
                onLocationSelect(lat, lng, response.results[0].formatted_address);
            }
        } catch (e) {
            console.error("Geocoding failed:", e);
            onLocationSelect(lat, lng, `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    };

    // const handleSearch = async () => {
    //     if (!searchQuery.trim()) return;
    //     setIsSearching(true);

    //     if (isGoogleLoaded && !googleError && window.google?.maps) {
    //         try {
    //             const { PlacesService, PlacesServiceStatus } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

    //             const service = new PlacesService(document.createElement('div'));
    //             service.findPlaceFromQuery({
    //                 query: searchQuery,
    //                 fields: ['geometry', 'formatted_address']
    //             }, (results, status) => {
    //                 if (status === PlacesServiceStatus.OK && results && results[0].geometry?.location) {
    //                     const lat = results[0].geometry.location.lat();
    //                     const lng = results[0].geometry.location.lng();
    //                     setMapCenter([lat, lng]);
    //                     updateMarker(lat, lng);
    //                     onLocationSelect(lat, lng, results[0].formatted_address || '');
    //                 }
    //                 setIsSearching(false);
    //             });
    //         } catch (error) {
    //             console.error("Google Search Error:", error);
    //             setIsSearching(false);
    //         }
    //     } else {
    //         // Leaflet Fallback Search
    //         try {
    //             const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&viewbox=${currentBounds}&bounded=0&addressdetails=1&limit=5`);
    //             const data = await res.json();
    //             if (data && data.length > 0) {
    //                 const bestMatch = data[0];
    //                 const { lat, lon } = bestMatch;
    //                 const newLat = parseFloat(lat);
    //                 const newLng = parseFloat(lon);
    //                 setMapCenter([newLat, newLng]);
    //                 onLocationSelect(newLat, newLng, bestMatch.display_name);
    //             }
    //         } catch (error) {
    //             console.error('Search error:', error);
    //         } finally {
    //             setIsSearching(false);
    //         }
    //     }
    // };

    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isFullscreen]);

    if (!mounted) return <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl" />;

    const MapUI = (
        <div
            className={`transition-all duration-300 ${isFullscreen
                ? 'fixed inset-0 z-[99999] bg-white h-screen w-screen p-0'
                : 'relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm z-[10]'
                }`}
        >
            {/* Provider Badge */}
            <div className={`absolute left-4 z-[1001] bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 transition-all ${isFullscreen ? 'top-24' : 'top-20'}`}>
                {isGoogleLoaded && !googleError ? (
                    <><Globe className="w-3 h-3 text-blue-500" /><span className="text-[10px] font-bold text-gray-600">Google Maps</span></>
                ) : (
                    <><MapPin className="w-3 h-3 text-orange-500" /><span className="text-[10px] font-bold text-gray-600">Leaflet (Fallback)</span></>
                )}
            </div>



            <div className="w-full h-full">
                {isGoogleLoaded && !googleError ? (
                    <div ref={googleMapRef} className="w-full h-full" />
                ) : (
                    <MapContainer
                        center={mapCenter}
                        zoom={14}
                        scrollWheelZoom={true}
                        className="h-full w-full"
                        key={`${mapCenter[0]}-${mapCenter[1]}-${isFullscreen}`}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <LocationMarker onLocationSelect={onLocationSelect} />
                    </MapContainer>
                )}
            </div>

            {/* Controls */}
            <div className={`absolute right-4 z-[1000] flex flex-col gap-2 transition-all ${isFullscreen ? 'top-8' : 'top-4'}`}>
                <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className={`p-3 bg-white/95 backdrop-blur rounded-xl shadow-2xl border border-gray-200 hover:bg-gray-50 transition-all text-gray-700 font-bold active:scale-90 ${isFullscreen ? 'bg-orange-50 ring-2 ring-[#ff6a00]' : ''}`}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                    <Maximize2 className={`w-5 h-5 ${isFullscreen ? 'text-[#ff6a00]' : ''}`} />
                </button>
            </div>

            <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-2 pointer-events-none transition-all ${isFullscreen ? 'scale-110 opacity-100' : 'opacity-90'}`}>
                <MapPin className="w-4 h-4 text-[#ff6a00] flex-shrink-0" />
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest whitespace-nowrap">
                    Click anywhere to set delivery pin
                </span>
            </div>

            {isFullscreen && (
                <button
                    type="button"
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-8 left-1/2 -translate-x-1/2 z-[1001] bg-gray-900/10 hover:bg-gray-900/20 text-[10px] font-bold text-gray-700 px-4 py-2 rounded-full backdrop-blur-md transition-all border border-black/5 hover:scale-105 active:scale-95"
                >
                    Close Fullscreen
                </button>
            )}
        </div>
    );

    if (isFullscreen) {
        return createPortal(MapUI, document.body);
    }

    return MapUI;
}
