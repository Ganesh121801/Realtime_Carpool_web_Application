import React, { useState, useEffect, useContext, useRef } from 'react';
import { LoadScript, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { SocketContext } from '../context/SocketContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 19.0760,
  lng: 72.8777
};

// Move SVG paths outside but create the full icon objects after map loads
const carSvgPath = "M17.402,0H5.643C2.526,0,0,2.526,0,5.643v6.714C0,15.474,2.526,18,5.643,18h11.759C20.517,18,23,15.474,23,12.357V5.643 C23,2.526,20.517,0,17.402,0z M8.21,13.18c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25 S8.9,13.18,8.21,13.18z M14.83,13.18c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25 S15.52,13.18,14.83,13.18z M20.5,8.18h-2.08c-0.31-0.75-1.04-1.25-1.87-1.25h-7c-0.83,0-1.56,0.5-1.87,1.25H5.5 c-0.28,0-0.5-0.22-0.5-0.5V6.43c0-0.28,0.22-0.5,0.5-0.5h15c0.28,0,0.5,0.22,0.5,0.5v1.25C21,7.96,20.78,8.18,20.5,8.18z";

const userSvgPath = "M12 0c-4.42 0-8 3.58-8 8 0 5.5 8 13 8 13s8-7.5 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z";

const LiveTracking = ({ pickup, destination, showRoute, isCaptain, ride }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [directions, setDirections] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [otherPartyLocation, setOtherPartyLocation] = useState(null);
  const [icons, setIcons] = useState(null);
  const { socket } = useContext(SocketContext);
  const mapRef = useRef(null);

  // Initialize icons after map loads
  useEffect(() => {
    if (window.google && mapLoaded) {
      setIcons({
        car: {
          path: carSvgPath,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#000000",
          scale: 1.5,
          anchor: new window.google.maps.Point(11.5, 9)
        },
        user: {
          path: userSvgPath,
          fillColor: "#DB4437",
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: "#000000",
          scale: 1.5,
          anchor: new window.google.maps.Point(12, 21)
        }
      });
    }
  }, [mapLoaded]);

  // Modified geolocation tracking with better options and error handling
  useEffect(() => {
    if (navigator.geolocation && ride) {
      // First get initial position with high accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(newPosition);
          
          // Emit initial location
          socket.emit('location-update', {
            rideId: ride._id,
            userType: isCaptain ? 'captain' : 'user',
            location: newPosition
          });
        },
        (error) => {
          console.warn('Error getting initial position:', error);
          // Fallback to pickup location if can't get current position
          if (pickup) {
            setCurrentPosition(pickup);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );

      // Then start watching position with more relaxed options
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(newPosition);

          socket.emit('location-update', {
            rideId: ride._id,
            userType: isCaptain ? 'captain' : 'user',
            location: newPosition
          });
        },
        (error) => {
          console.warn('Watch position error:', error);
        },
        {
          enableHighAccuracy: false, // Less strict accuracy for continuous updates
          timeout: 15000,
          maximumAge: 10000 // Allow cached positions up to 10 seconds old
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [ride, isCaptain, socket, pickup]);

  // Listen for other party's location updates
  useEffect(() => {
    if (socket && ride) {
      socket.on('location-updated', (data) => {
        if (data.rideId === ride._id && 
            ((isCaptain && data.userType === 'user') || 
             (!isCaptain && data.userType === 'captain'))) {
          setOtherPartyLocation(data.location);
        }
      });

      return () => {
        socket.off('location-updated');
      };
    }
  }, [socket, ride, isCaptain]);

  // Calculate route when needed
  useEffect(() => {
    if (showRoute && pickup && destination && window.google && mapLoaded) {
      const directionsService = new window.google.maps.DirectionsService();

      // Ensure we have valid coordinates
      if (!pickup.lat || !destination.lat) {
        console.error('Invalid coordinates');
        return;
      }

      directionsService.route(
        {
          origin: new window.google.maps.LatLng(pickup.lat, pickup.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [pickup, destination, showRoute, mapLoaded]);

  // Modify map center behavior
  useEffect(() => {
    if (currentPosition && currentPosition.lat) {
      const map = mapRef.current;
      if (map) {
        map.panTo(currentPosition);
      }
    }
  }, [currentPosition]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
        onLoad={(map) => {
          setMapLoaded(true);
          mapRef.current = map;
        }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy' // Makes the map more mobile-friendly
        }}
      >
        {/* Only render markers when icons are initialized */}
        {icons && (
          <>
            {/* Current position marker */}
            <Marker
              position={currentPosition}
              icon={isCaptain ? icons.car : icons.user}
            />

            {/* Other party's location marker */}
            {otherPartyLocation && (
              <Marker
                position={otherPartyLocation}
                icon={!isCaptain ? icons.car : icons.user}
              />
            )}
          </>
        )}

        {/* Pickup and destination markers */}
        {showRoute && pickup && pickup.lat && (
          <Marker
            position={{ lat: pickup.lat, lng: pickup.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }}
          />
        )}

        {showRoute && destination && destination.lat && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;