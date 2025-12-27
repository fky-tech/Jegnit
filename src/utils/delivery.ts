
export const ADDIS_ABABA_CENTER = { lat: 9.005401, lng: 38.763611 };
export const ADDIS_ABABA_RADIUS_KM = 15;
export const DISTANCE_STEP_KM = 35;
export const STEP_FEE = 50;
export const MAX_DISTANCE_KM = 300;

export interface DeliveryFeeResult {
    distanceKm: number;
    deliveryFee: number;
    zone: 'inside_addis' | 'outside_addis';
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

export function calculateDeliveryFee(userLat: number, userLng: number): DeliveryFeeResult {
    const distance = calculateDistanceKm(ADDIS_ABABA_CENTER.lat, ADDIS_ABABA_CENTER.lng, userLat, userLng);

    if (distance <= ADDIS_ABABA_RADIUS_KM) {
        return {
            distanceKm: distance,
            deliveryFee: 0,
            zone: 'inside_addis'
        };
    }

    const clampedDistance = Math.min(distance, MAX_DISTANCE_KM);
    const chargeableDistance = clampedDistance - ADDIS_ABABA_RADIUS_KM;
    const bands = Math.ceil(chargeableDistance / DISTANCE_STEP_KM);
    const fee = bands * STEP_FEE;

    return {
        distanceKm: distance,
        deliveryFee: fee,
        zone: 'outside_addis'
    };
}
