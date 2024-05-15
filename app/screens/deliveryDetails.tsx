import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import * as Location from 'expo-location';

const DELIVERY_DETAILS_KEY = '@delivery_details';

const DeliveryDetails = () => {
  const [location, setNewLocation] = useState(Object);
  const [newAddress, setNewAddress] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [region, setRegion] = useState<Region>({
    latitude: 10.3099,
    longitude: 123.8931,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permission");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setNewLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      updateAddress(latitude, longitude);
    };

    getPermissionAndLocation();
  }, []);

  const updateAddress = async (latitude: number, longitude: number) => {
    let address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address.length > 0) {
      const { street, city, subregion, country, postalCode } = address[0];
      setNewAddress(`${street}, ${city}, ${subregion}, ${country}, ${postalCode}`);
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    setRegion(region);
    updateAddress(region.latitude, region.longitude);
  };

  const handleMarkerDragEnd = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
    updateAddress(latitude, longitude);
  };

  const handleSave = async () => {
    const details = {
      address: newAddress,
      description: newDescription,
      latitude: region.latitude,
      longitude: region.longitude,
    };
    await AsyncStorage.setItem(DELIVERY_DETAILS_KEY, JSON.stringify(details));
    router.replace('/screens/checkOut');
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={region}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        showsUserLocation
        showsBuildings
        mapPadding={{top: 0, right: 0, left: 0, bottom: 230}}
        ref={mapRef}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          draggable
          onDragEnd={handleMarkerDragEnd}
        />
      </MapView>
      <BottomSheet snapPoints={['1%', '30%']} index={0}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Street / House number"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Note to rider - e.g. landmark"
              value={newDescription}
              onChangeText={setNewDescription}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save and continue</Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default DeliveryDetails;

const styles = StyleSheet.create({
  sheetContainer: {
    padding: 16,
  },
  map: {
    width: '100%',
    height: '100%',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: Colors.onebrown,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
