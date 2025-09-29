import { Button, Card, CardContent, CardHeader, FormControl, OutlinedInput } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppMessages } from "../../data/app.constant";
import { IAddress } from "../../interfaces/address.interface";
import { addEditAddressSchema } from "../../schemas/address.schema";
import { AddressService } from "../../services/address.service";
import { AppNotificationService } from "../../services/app-notification.service";
import BackButton from "../../shared/components/BackButton";
import GeoAddress from "../../shared/components/GeoAddress";

const initialValues = {
  name: "",
  flatNo: "",
  streetName: "",
  area: "",
  pincode: "",
  city: "",
  state: "",
  lat: "",
  lng: "",
};

const AddEditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notifySvc = new AppNotificationService();
  const addressSvc = new AddressService();
  const [address, setAddress] = useState<IAddress | null>(null);

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    validationSchema: addEditAddressSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        if (id) {
          await addressSvc.updateAddress(id, values);
          notifySvc.showSucces(AppMessages.ADDRESS_UPDATED);
        } else {
          await addressSvc.addAddress(values);
          notifySvc.showSucces(AppMessages.ADDRESS_ADDED);
        }
        navigate(-1);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    if (id) {
      loadAddress();
    }
  }, []);

  const loadAddress = async () => {
    try {
      const response = await addressSvc.getSingleAddress(id as string);
      setAddress(response);
      setFieldValue("name", response.name || "");
      setFieldValue("flatNo", response.flatNo || "");
      setFieldValue("streetName", response.streetName || "");
      setFieldValue("area", response.area || "");
      setFieldValue("pincode", response.pincode || "");
      setFieldValue("city", response.city || "");
      setFieldValue("state", response.state || "");
      setFieldValue("lat", response.lat || "");
      setFieldValue("lng", response.lng || "");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const geoAddressChange = async (address: any) => {
    Object.keys(address).forEach(async (key) => {
      await setFieldValue(key, address[key] || "");
    });
    setTimeout(() => {
      Object.keys(address).forEach(async (key) => {
        await setFieldValue(key, address[key] || "");
      });
    }, 100);
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title={id ? "Edit Address" : "Add Address"} className="card-heading" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-5 col-md-6 col-sm-12 col-12 mb-4">
                <div className="row">
                  <div className="col-12">
                    <GeoAddress geoAddressChange={geoAddressChange} address={address} />
                  </div>
                </div>
              </div>
              <div className="col-lg-7 col-md-6 col-sm-12 col-12">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.name && touched.name ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Name
                      </InputLabel>
                      <OutlinedInput
                        error={errors.name && touched.name ? true : undefined}
                        type="text"
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.name && touched.name ? (
                      <p className="text-danger text-sm">{errors.name}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.flatNo && touched.flatNo ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        House/Godown Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.flatNo && touched.flatNo ? true : undefined}
                        type="text"
                        name="flatNo"
                        label="House/Godown Number"
                        value={values.flatNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.flatNo && touched.flatNo ? (
                      <p className="text-danger text-sm">{errors.flatNo}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.streetName && touched.streetName ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Street Name
                      </InputLabel>
                      <OutlinedInput
                        error={errors.streetName && touched.streetName ? true : undefined}
                        type="text"
                        name="streetName"
                        label="Street Name"
                        value={values.streetName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.streetName && touched.streetName ? (
                      <p className="text-danger text-sm">{errors.streetName}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.area && touched.area ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Area
                      </InputLabel>
                      <OutlinedInput
                        error={errors.area && touched.area ? true : undefined}
                        type="text"
                        name="area"
                        label="Area"
                        value={values.area}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.area && touched.area ? (
                      <p className="text-danger text-sm">{errors.area}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.pincode && touched.pincode ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Pincode
                      </InputLabel>
                      <OutlinedInput
                        error={errors.pincode && touched.pincode ? true : undefined}
                        type="number"
                        name="pincode"
                        label="Pincode"
                        value={values.pincode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.pincode && touched.pincode ? (
                      <p className="text-danger text-sm">{errors.pincode}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.city && touched.city ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        City
                      </InputLabel>
                      <OutlinedInput
                        error={errors.city && touched.city ? true : undefined}
                        type="text"
                        name="city"
                        label="City"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.city && touched.city ? (
                      <p className="text-danger text-sm">{errors.city}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.state && touched.state ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        State
                      </InputLabel>
                      <OutlinedInput
                        error={errors.state && touched.state ? true : undefined}
                        type="text"
                        name="state"
                        label="State"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.state && touched.state ? (
                      <p className="text-danger text-sm">{errors.state}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.lat && touched.lat ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Latitude
                      </InputLabel>
                      <OutlinedInput
                        error={errors.lat && touched.lat ? true : undefined}
                        type="number"
                        name="lat"
                        label="Latitude"
                        value={values.lat}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                    </FormControl>
                    {errors.lat && touched.lat ? (
                      <p className="text-danger text-sm">{errors.lat}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.lng && touched.lng ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Longitude
                      </InputLabel>
                      <OutlinedInput
                        error={errors.lng && touched.lng ? true : undefined}
                        type="number"
                        name="lng"
                        label="Longitude"
                        value={values.lng}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
                      />
                    </FormControl>
                    {errors.lng && touched.lng ? (
                      <p className="text-danger text-sm">{errors.lng}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12"></div>
              <div className="col-md-3 col-12 mt-2">
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEditAddress;
