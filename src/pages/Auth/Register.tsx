import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Container } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useRef, useState } from "react";
import { AppMessages, BreakPoints } from "../../data/app.constant";

import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { IRegisterUser } from "../../interfaces/auth.interface";
import { SignUpSchema } from "../../schemas/auth.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { AuthService } from "../../services/auth.service";
import ImageCropper from "../../shared/components/ImageCropper";

const initialValues = {
  file: "",
  name: "",
  userName: "",
  email: "",
  contactNumber: "",
  password: "",
};

const Register = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const authSvc = new AuthService();
  const notifySvc = new AppNotificationService();

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: SignUpSchema,
    validateOnChange: true,

    onSubmit: async (values: IRegisterUser) => {
      try {
        const formData = new FormData();
        if (values.file) {
          formData.append("file", values.file || "");
        }
        formData.append("contactNumber", values.contactNumber || "");
        formData.append("email", values.email || "");
        formData.append("name", values.name || "");
        formData.append("password", values.password || "");
        formData.append("userName", values.userName || "");
        await authSvc.register(formData);
        notifySvc.showSucces(AppMessages.REGISTER_SUCCESS);
        navigate("/login");
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  const handleFileChange = async (event: any) => {
    const file = event?.target?.files?.[0] || null;
    const formErrors = await setFieldValue("file", file);
    if (!formErrors?.file && file) {
      setShowCropper(true);
    }
  };

  const onImageCrop = (file: Blob | null) => {
    if (!file) {
      fileInputRef.current.value = file;
    }
    setFieldValue("file", file);
    setShowCropper(false);
  };

  return (
    <div className="register-container">
      <Container maxWidth={BreakPoints.XS} className="bg-light rounded py-3">
        <>
          <h2 className="text-center text-primary heading">Sign Up</h2>
          <p className="text-center --bs-secondary-color ">Enter your credentials to continue</p>
        </>
        {showCropper ? <ImageCropper file={values.file} aspectRatio={1 / 1} onCrop={onImageCrop} /> : null}

        <div className="justify-content-center">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-12">
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
                {errors.file && touched.file ? <p className="text-danger text-sm">{errors.file}</p> : null}
              </div>
              <div className="col-lg-6 col-md-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel className={errors.name && touched.name ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                    Enter Your Name
                  </InputLabel>
                  <OutlinedInput
                    error={errors.name && touched.name ? true : undefined}
                    type="text"
                    name="name"
                    label="Enter Your Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                {errors.name && touched.name ? <p className="text-danger text-sm">{errors.name}</p> : null}
              </div>
              <div className="col-lg-6 col-md-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel className={errors.userName && touched.userName ? "text-danger" : ""} htmlFor="outlined-adornment-password">
                    Username
                  </InputLabel>
                  <OutlinedInput
                    error={errors.userName && touched.userName ? true : undefined}
                    type="text"
                    name="userName"
                    label="UserName"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
                {errors.userName && touched.userName ? <p className="text-danger text-sm">{errors.userName}</p> : null}
              </div>
              <div className="col-lg-6 col-md-12">
                <FormControl variant="outlined" fullWidth className="mt-4">
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
                {errors.email && touched.email ? <p className="text-danger text-sm">{errors.email}</p> : null}
              </div>
              <div className="col-lg-6 col-md-12">
                <FormControl variant="outlined" fullWidth className="mt-4">
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
                {errors.contactNumber && touched.contactNumber ? <p className="text-danger text-sm">{errors.contactNumber}</p> : null}
              </div>
              <div className="col-lg-12">
                <FormControl fullWidth variant="outlined" className="mt-4">
                  <InputLabel className={errors.password && touched.password ? "text-danger" : ""} htmlFor="outlined-adornment-password">
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
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                {errors.password && touched.password ? <p className="text-danger text-sm">{errors.password}</p> : null}
              </div>
              <div className="col-lg-12">
                <Button type="submit" fullWidth className="submit-btn font-weight mt-4">
                  Sign Up
                </Button>
              </div>
            </div>
          </form>
          <hr className="mt-4 border" />
        </div>
        <>
          <p className="text-center link">
            <Link className="text-decoration-none text-primary" to={"/login"}>
              Already have an account?
            </Link>
          </p>
        </>
      </Container>
    </div>
  );
};

export default Register;
