import { Button, Card, CardContent, CardHeader, FormControl, OutlinedInput } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppMessages } from "../../data/app.constant";
import { IUser } from "../../interfaces/user.interface";
import { addDriverSchema, editDriverSchema } from "../../schemas/driver.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { DriverService } from "../../services/driver.service";
import { UtilService } from "../../services/util.service";
import BackButton from "../../shared/components/BackButton";
import AvatarImage from "../../shared/components/Common/AvatarImage";
import ImageCropper from "../../shared/components/ImageCropper";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const initialValues = {
  file: "",
  name: "",
  userName: "",
  email: "",
  contactNumber: "",
  licenseNumber: "",
  licenseExpiryDate: "",
  password: "",
};

const AddEditDriver = () => {
  const [driver, setDriver] = useState<IUser | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<any>(null);
  const notifySvc = new AppNotificationService();
  const driverSvc = new DriverService();
  const utilSvc = new UtilService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: id ? editDriverSchema : addDriverSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        if (values.file) {
          formData.append("file", values.file || "");
        }
        formData.append("contactNumber", values.contactNumber || "");
        formData.append("email", values.email || "");
        formData.append("name", values.name || "");
        formData.append("userName", values.userName || "");
        formData.append("licenseNumber", values.licenseNumber || "");
        formData.append("licenseExpiryDate", values.licenseExpiryDate || "");

        if (id) {
          await driverSvc.updateDriver(id, formData);
          notifySvc.showSucces(AppMessages.DRIVER_UPDATED);
        } else {
          formData.append("password", values.password || "");
          await driverSvc.addDriver(formData);
          notifySvc.showSucces(AppMessages.DRIVER_ADDED);
        }
        navigate(-1);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    if (id) {
      loadDriver();
    }
  }, []);

  const loadDriver = async () => {
    try {
      const response = await driverSvc.getSingleDriver(id as string);
      setDriver(response);
      setImageUrl(response?.imageUrl || null);
      setFieldValue("contactNumber", response.contactNumber || "");
      setFieldValue("email", response.email || "");
      setFieldValue("name", response.name || "");
      setFieldValue("userName", response.userName || "");
      setFieldValue("licenseNumber", response.licenseNumber || "");
      setFieldValue("licenseExpiryDate", response.licenseExpiryDate || "");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files?.[0] || null;
    const formErrors = await setFieldValue("file", file);
    if (!formErrors?.file && file) {
      setShowCropper(true);
    } else {
      setImageUrl(driver?.imageUrl || null);
    }
  };

  const onImageCrop = async (file: Blob | null) => {
    if (!file) {
      fileInputRef.current.value = file;
      setImageUrl(driver?.imageUrl || null);
    } else {
      const imgUrl = await utilSvc.convertFileToBase64(file);
      setImageUrl(imgUrl || null);
    }
    setFieldValue("file", file);
    setShowCropper(false);
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title={id ? "Edit Driver" : "Add Driver"} className="card-heading" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                <div className="row">
                  <div className="col-12">
                    <FormControl fullWidth variant="outlined" className="mt-4">
                      <OutlinedInput
                        inputRef={fileInputRef}
                        fullWidth
                        name="file"
                        onChange={(event: any) => handleFileChange(event)}
                        onBlur={handleBlur}
                        type="file"
                        label=""
                      />
                    </FormControl>
                    {errors.file && touched.file ? (
                      <p className="text-danger text-sm">{errors.file}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                    {showCropper ? <ImageCropper file={values.file} aspectRatio={1 / 1} onCrop={onImageCrop} /> : null}
                  </div>
                  <div className="col-12 align-center my-4">
                    <AvatarImage imageUrl={imageUrl} height={180} width={180} />
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-6 col-sm-12 col-12">
                <div className="row">
                  <div className="col-md-6 col-12 mt-4">
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
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.userName && touched.userName ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Username
                      </InputLabel>
                      <OutlinedInput
                        error={errors.userName && touched.userName ? true : undefined}
                        type="text"
                        name="userName"
                        label="Username"
                        value={values.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.userName && touched.userName ? (
                      <p className="text-danger text-sm">{errors.userName}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.email && touched.email ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Email
                      </InputLabel>
                      <OutlinedInput
                        error={errors.email && touched.email ? true : undefined}
                        type="text"
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.email && touched.email ? (
                      <p className="text-danger text-sm">{errors.email}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.contactNumber && touched.contactNumber ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Contact Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.contactNumber && touched.contactNumber ? true : undefined}
                        type="number"
                        name="contactNumber"
                        label="Contact Number"
                        value={values.contactNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.contactNumber && touched.contactNumber ? (
                      <p className="text-danger text-sm">{errors.contactNumber}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className={`${id ? "col-md-12" : "col-md-6"} col-12 mt-4`}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.licenseNumber && touched.licenseNumber ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        License Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.licenseNumber && touched.licenseNumber ? true : undefined}
                        type="text"
                        name="licenseNumber"
                        label="License Number"
                        value={values.licenseNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.licenseNumber && touched.licenseNumber ? (
                      <p className="text-danger text-sm">{errors.licenseNumber}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  {!id ? (
                    <div className="col-md-6 col-12 mt-4">
                      <FormControl fullWidth variant="outlined">
                        <InputLabel
                          className={errors.password && touched.password ? "text-danger" : ""}
                          htmlFor="outlined-adornment-password"
                        >
                          Password
                        </InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={errors.password && touched.password ? true : undefined}
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          id="outlined-adornment-password"
                          type="text"
                          label="Password"
                        />
                      </FormControl>
                      {errors.password && touched.password ? (
                        <p className="text-danger text-sm">{errors.password}</p>
                      ) : (
                        <p className="text-danger text-sm invisible">&nbsp;</p>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="col-md-6 col-12 mt-4">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="License Expiry Date"
                      value={values.licenseExpiryDate ? dayjs(values.licenseExpiryDate) : null}
                      onChange={(newValue) => {
                        const formatted = newValue ? newValue.format("YYYY-MM-DD") : "";
                        setFieldValue("licenseExpiryDate", formatted);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(errors.licenseExpiryDate && touched.licenseExpiryDate),
                          helperText: touched.licenseExpiryDate && errors.licenseExpiryDate,
                        },
                      }}
                    />
                  </LocalizationProvider>
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

export default AddEditDriver;
