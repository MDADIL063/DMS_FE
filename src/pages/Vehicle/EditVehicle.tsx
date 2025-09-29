import { Button, Card, CardContent, CardHeader, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppMessages } from "../../data/app.constant";
import { IVehicleType } from "../../interfaces/vehicle-type.interface";
import { IVehicle, IVehicleImage } from "../../interfaces/vehicle.interface";
import { vehicleSchema } from "../../schemas/vehicle.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { UtilService } from "../../services/util.service";
import { VehicleTypeService } from "../../services/vehicle-type.service";
import { VehicleService } from "../../services/vehicle.service";
import BackButton from "../../shared/components/BackButton";
import ConfirmDialog from "../../shared/components/ConfirmDialog";
import ImageCropper from "../../shared/components/ImageCropper";
import VehicleImage from "./components/VehicleImage";

const initialValues = {
  file: "",
  vehicleNumber: "",
  company: "",
  capacity: "",
  vehicleType: "",
  mfgYear: "",
  chassisNumber: "",
  regNumber: "",
};

const EditVehicle = () => {
  const { id } = useParams();
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{
    imageUrls: string[];
    files: File[] | Blob[];
  }>({ imageUrls: [], files: [] });
  const [vehicleTypes, setVehicleTypes] = useState<IVehicleType[]>([]);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [deleteImageUrl, setDeleteImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<any>(null);
  const notifySvc = new AppNotificationService();
  const vehicleSvc = new VehicleService();
  const utilSvc = new UtilService();
  const vehicleTypeSvc = new VehicleTypeService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: vehicleSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        if (selectedImages?.files?.length) {
          for (const file of selectedImages.files) {
            formData.append("file", file || "");
          }
        }
        formData.append("vehicleNumber", values.vehicleNumber || "");
        formData.append("company", values.company || "");
        formData.append("capacity", values.capacity || "");
        formData.append("vehicleType", values.vehicleType || "");
        formData.append("mfgYear", values.mfgYear ? dayjs(values.mfgYear).toISOString() : "");
        formData.append("chassisNumber", values.chassisNumber || "");
        formData.append("regNumber", values.regNumber || "");
        await vehicleSvc.updateVehicle(id as string, formData);
        notifySvc.showSucces(AppMessages.VEHICLE_ADDED);
        navigate(-1);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    loadVehicleTypes();
    loadVehicle();
  }, []);

  const loadVehicleTypes = async () => {
    try {
      const response = await vehicleTypeSvc.getVehicleTypes({});
      setVehicleTypes(response.data);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const loadVehicle = async () => {
    try {
      const response = await vehicleSvc.getSingleVehicle(id as string);
      setVehicle(response);
      setFieldValue("vehicleNumber", response.vehicleNumber || "");
      setFieldValue("company", response.company || "");
      setFieldValue("capacity", response.capacity || "");
      setFieldValue("vehicleType", response.vehicleType._id || "");
      setFieldValue("mfgYear", response.mfgYear ? dayjs(response.mfgYear) : "");
      setFieldValue("chassisNumber", response.chassisNumber || "");
      setFieldValue("regNumber", response.regNumber || "");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files?.[0] || null;
    const formErrors = await setFieldValue("file", file);
    if (!formErrors?.file && file) {
      setShowCropper(true);
    }
  };

  const onImageCrop = async (file: Blob | null) => {
    if (file) {
      const imgUrl = await utilSvc.convertFileToBase64(file);
      const { imageUrls, files } = { ...selectedImages };
      setSelectedImages({
        imageUrls: [...imageUrls, imgUrl],
        files: [...files, file],
      });
    }
    setShowCropper(false);
    setFieldValue("file", null);
    fileInputRef.current.value = null;
  };

  const deleteImage = (imageUrl: string) => {
    const { imageUrls, files } = { ...selectedImages };
    const index = imageUrls.findIndex((imgUrl) => imgUrl === imageUrl);
    imageUrls.splice(index, 1);
    files.splice(index, 1);
    setSelectedImages({
      imageUrls: [...imageUrls],
      files: [...files],
    });
  };

  const deleteImageFromServer = async (imageId: string) => {
    try {
      await vehicleSvc.deleteVehicleImage(id as string, imageId);
      notifySvc.showSucces(AppMessages.VEHICLE_IMAGE_DELETED);
      const response = await vehicleSvc.getSingleVehicle(id as string);
      setVehicle(response);
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const onConfirmDialogClose = (result: boolean) => {
    const vehicleImage = vehicle?.imageUrls?.find((image) => image.imageUrl === deleteImageUrl);
    if (result && vehicleImage?.id) {
      deleteImageFromServer(vehicleImage.id);
    }
    setDeleteImageUrl(null);
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title="Edit Vehicle" className="card-heading" />
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
                    {showCropper ? <ImageCropper file={values.file} aspectRatio={16 / 9} onCrop={onImageCrop} /> : null}
                  </div>
                  {selectedImages?.imageUrls?.length ? (
                    <div className="col-12 mb-4">
                      <p className="detail-label mb-2">Selected Images</p>
                      <Grid container spacing={2}>
                        {selectedImages.imageUrls.map((imageUrl: string) => (
                          <Grid item xs={12} sm={6} md={6} lg={6} key={imageUrl}>
                            <VehicleImage
                              imageUrl={imageUrl}
                              onDelete={() => {
                                deleteImage(imageUrl);
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  ) : null}
                  {selectedImages?.imageUrls?.length && vehicle?.imageUrls?.length ? (
                    <div className="col-12 mb-3">
                      <Divider />
                    </div>
                  ) : null}

                  {vehicle?.imageUrls?.length ? (
                    <div className="col-12 mb-4">
                      <p className="detail-label mb-2">Uploaded Images</p>
                      <Grid container spacing={2}>
                        {vehicle.imageUrls.map((vehicleImage: IVehicleImage) => (
                          <Grid item xs={12} sm={6} md={6} lg={6} key={vehicleImage.id}>
                            <VehicleImage
                              imageUrl={vehicleImage.imageUrl}
                              onDelete={() => {
                                setDeleteImageUrl(vehicleImage.imageUrl);
                              }}
                            />
                            {deleteImageUrl ? (
                              <ConfirmDialog
                                message={AppMessages.UPLOADED_IMAGE_DELETE_CONFIRM}
                                onClose={(result) => {
                                  onConfirmDialogClose(result);
                                }}
                              />
                            ) : null}
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-8 col-md-6 col-sm-12 col-12">
                <div className="row">
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.vehicleNumber && touched.vehicleNumber ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Vehicle Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.vehicleNumber && touched.vehicleNumber ? true : undefined}
                        type="text"
                        name="vehicleNumber"
                        label="Vehicle Number"
                        value={values.vehicleNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.vehicleNumber && touched.vehicleNumber ? (
                      <p className="text-danger text-sm">{errors.vehicleNumber}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel className={errors.company && touched.company ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                        Vehicle Company
                      </InputLabel>
                      <OutlinedInput
                        error={errors.company && touched.company ? true : undefined}
                        type="text"
                        name="company"
                        label="Vehicle Company"
                        value={values.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.company && touched.company ? (
                      <p className="text-danger text-sm">{errors.company}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.capacity && touched.capacity ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Capacity
                      </InputLabel>
                      <OutlinedInput
                        error={errors.capacity && touched.capacity ? true : undefined}
                        type="text"
                        name="capacity"
                        label="Capacity"
                        value={values.capacity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.capacity && touched.capacity ? (
                      <p className="text-danger text-sm">{errors.capacity}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.vehicleType && touched.vehicleType ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Vehicle Type
                      </InputLabel>
                      <Select
                        name="vehicleType"
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={values.vehicleType}
                        label="Vehicle Type"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {vehicleTypes.map((vehicleType) => (
                          <MenuItem key={vehicleType._id} value={vehicleType._id}>
                            {vehicleType.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.vehicleType && touched.vehicleType ? (
                      <p className="text-danger text-sm">{errors.vehicleType}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="mfgYear"
                          label="Manufacturing Year"
                          views={["year", "month"]}
                          disableFuture={true}
                          value={(values.mfgYear as any) || dayjs()}
                          onChange={(value) => setFieldValue("mfgYear", value, true)}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    {errors.mfgYear && touched.mfgYear ? (
                      <p className="text-danger text-sm">{errors.mfgYear}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-6 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.chassisNumber && touched.chassisNumber ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Chassis Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.chassisNumber && touched.chassisNumber ? true : undefined}
                        type="text"
                        name="chassisNumber"
                        label="Chassis Number"
                        value={values.chassisNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.chassisNumber && touched.chassisNumber ? (
                      <p className="text-danger text-sm">{errors.chassisNumber}</p>
                    ) : (
                      <p className="text-danger text-sm invisible">&nbsp;</p>
                    )}
                  </div>
                  <div className="col-md-12 col-12 mt-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel
                        className={errors.regNumber && touched.regNumber ? "text-danger" : ""}
                        htmlFor="outlined-adornment-password"
                      >
                        Registration Number
                      </InputLabel>
                      <OutlinedInput
                        error={errors.regNumber && touched.regNumber ? true : undefined}
                        type="text"
                        name="regNumber"
                        label="Registration Number"
                        value={values.regNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </FormControl>
                    {errors.regNumber && touched.regNumber ? (
                      <p className="text-danger text-sm">{errors.regNumber}</p>
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

export default EditVehicle;
