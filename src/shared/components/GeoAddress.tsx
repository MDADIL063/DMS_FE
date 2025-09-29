import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { IAddress, IGeoAddress } from "../../interfaces/address.interface";
import { UtilService } from "../../services/util.service";
import GeoMap from "./GeoMap";

interface IProps {
  address?: IAddress | null;
  geoAddressChange: (address: IGeoAddress) => void;
}

const GeoAddress = ({ address, geoAddressChange }: IProps) => {
  const utilSvc = new UtilService();
  const [fullAddress, setFullAddress] = useState<string>("");
  const [showInitialMap, setShowInitialMap] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState({ lat: 19.086022922443416, lng: 72.90804243684849 });
  const [geoAddress, setGeoAddress] = useState<IGeoAddress>({
    flatNo: "",
    streetName: "",
    pincode: 0,
    area: "",
    city: "",
    state: "",
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (address) {
      setFullAddress(utilSvc.getFullAddress(address));
      setGeoAddress({
        flatNo: address.flatNo,
        streetName: address.streetName,
        pincode: address.pincode,
        area: address.area,
        city: address.city,
        state: address.state,
        lat: address.lat as number,
        lng: address.lng as number,
      });
      if (address.lat && address.lng) {
        setMapCenter({
          lat: address.lat,
          lng: address.lng,
        });
      }
    }
    setTimeout(() => {
      setShowInitialMap(true);
    }, 500);
  }, [address]);

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    options: {
      componentRestrictions: { country: "in" },
      types: ["address"],
    },
    onPlaceSelected: (places) => {
      const { formatted_address, geometry, address_components } = places;
      const lat = geometry?.location?.lat() || 0;
      const lng = geometry?.location?.lng() || 0;

      setFullAddress(formatted_address || "");

      setMapCenter({ lat: 0, lng: 0 });
      setTimeout(() => {
        setMapCenter({ lat, lng });
      }, 0);

      const newAddress: IGeoAddress = {
        flatNo: "",
        streetName: "",
        pincode: 0,
        area: "",
        city: "",
        state: "",
        lat,
        lng,
      };

      address_components?.forEach((component: any) => {
        const type = component.types[0];
        const value = component.long_name || "";

        switch (type) {
          case "street_number":
            newAddress.flatNo = value;
            break;
          case "route":
            newAddress.streetName = value;
            break;
          case "sublocality_level_1":
            newAddress.area = value;
            break;
          case "locality":
            newAddress.city = value;
            break;
          case "administrative_area_level_1":
            newAddress.state = value;
            break;
          case "postal_code":
            newAddress.pincode = value;
            break;
        }
      });

      setGeoAddress(newAddress);
      geoAddressChange(newAddress);
    },
  });
  return (
    <div className="row">
      <div className="col-12 mb-4">
        <FormControl fullWidth>
          <InputLabel>Search Address</InputLabel>
          <OutlinedInput
            inputRef={ref}
            type="search"
            name="search"
            label="Search Address"
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            fullWidth
          />
        </FormControl>
      </div>
      <div className="col-12">
        {showInitialMap && mapCenter.lat && mapCenter.lng ? (
          <GeoMap
            lat={mapCenter.lat}
            lng={mapCenter.lng}
            height={utilSvc.isMobile() ? "250px" : "375px"}
            latLngChange={(lat, lng) => {
              const newAddress = { ...geoAddress, lat, lng };
              setGeoAddress(newAddress);
              geoAddressChange(newAddress);
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default GeoAddress;
