
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// Define hub location data type
interface HubLocation {
  id: number;
  name: string;
  type: string;
  coordinates: [number, number]; // [latitude, longitude]
  services: string[];
  hours: string;
}

// Create a custom icon for markers
const createCustomIcon = () => {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-6 h-6 bg-nektech-orange text-white rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const HubsMap = () => {
  const { t } = useTranslation();
  
  const [hubLocations, setHubLocations] = useState<HubLocation[]>([
    {
      id: 1,
      name: t('hubsMap.locations.delhi.name'),
      type: t('hubsMap.locations.delhi.type'),
      coordinates: [28.7041, 77.1025],
      services: [
        t('hubsMap.services.payments'), 
        t('hubsMap.services.training'), 
        t('hubsMap.services.photography'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.fullDay')
    },
    {
      id: 2,
      name: t('hubsMap.locations.mumbai.name'),
      type: t('hubsMap.locations.general.communityCenter'),
      coordinates: [19.0760, 72.8777],
      services: [
        t('hubsMap.services.payments'), 
        t('hubsMap.services.training'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.fullDay')
    },
    {
      id: 3,
      name: t('hubsMap.locations.jaipur.name'),
      type: t('hubsMap.locations.general.communityCenter'),
      coordinates: [26.9124, 75.7873],
      services: [
        t('hubsMap.services.training'), 
        t('hubsMap.services.photography'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.fullDay')
    },
    {
      id: 4,
      name: t('hubsMap.locations.lucknow.name'),
      type: t('hubsMap.locations.general.communityCenter'),
      coordinates: [26.8467, 80.9462],
      services: [
        t('hubsMap.services.payments'), 
        t('hubsMap.services.training'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.reducedDay')
    },
    {
      id: 5,
      name: t('hubsMap.locations.bangalore.name'),
      type: t('hubsMap.locations.general.communityCenter'),
      coordinates: [12.9716, 77.5946],
      services: [
        t('hubsMap.services.payments'), 
        t('hubsMap.services.training'), 
        t('hubsMap.services.photography'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.fullDay')
    },
    {
      id: 6,
      name: t('hubsMap.locations.chennai.name'),
      type: t('hubsMap.locations.general.communityCenter'),
      coordinates: [13.0827, 80.2707],
      services: [
        t('hubsMap.services.training'), 
        t('hubsMap.services.shipping')
      ],
      hours: t('hubsMap.hours.fullDay')
    }
  ]);

  useEffect(() => {
    // Fix Leaflet icon issues in production builds
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Calculate center of India
  const indiaCenter: [number, number] = [23.5937, 78.9629];
  const customIcon = createCustomIcon();

  return (
    <MapContainer 
      center={indiaCenter} 
      zoom={5} 
      style={{ height: '400px', width: '100%', borderRadius: '0.5rem' }}
      className="z-10"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {hubLocations.map(hub => (
        <Marker 
          key={hub.id} 
          position={hub.coordinates as L.LatLngExpression}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-medium">{hub.name}</h3>
              <p className="text-xs text-muted-foreground">{hub.type}</p>
              <p className="text-xs mt-2">{t('hubsMap.popup.services')}: {hub.services.join(", ")}</p>
              <p className="text-xs mt-1">{hub.hours}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default HubsMap;
