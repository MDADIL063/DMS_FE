import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Container } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { UserCredential } from "firebase/auth";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppMessages, BreakPoints } from "../../data/app.constant";
import { IGoogleLoginCredentials, ILoginCredentials } from "../../interfaces/auth.interface";
import { LoginSchema } from "../../schemas/auth.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { AuthService } from "../../services/auth.service";
import { signInWithGooglePopup } from "../../utils/firebase.utils";

const initialValues = {
  userName: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const notifySvc = new AppNotificationService();
  const authSvc = new AuthService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,

    onSubmit: (values) => {
      login(values);
    },
  });

  const login = async (payload: ILoginCredentials) => {
    try {
      await authSvc.login(payload);
      notifySvc.showSucces(AppMessages.LOGIN_SUCCESS);
      navigate("/dashboard");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const loginWithGoogle = async (payload: IGoogleLoginCredentials) => {
    try {
      await authSvc.loginWithGoogle(payload);
      notifySvc.showSucces(AppMessages.LOGIN_SUCCESS);
      navigate("/dashboard");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const signInWithGoogle = async () => {
    try {
      const response: UserCredential = await signInWithGooglePopup();
      if (response?.user) {
        const payload: IGoogleLoginCredentials = {
          name: response.user.displayName || "",
          email: response.user.email || "",
          googleId: response.user.uid,
        };
        loginWithGoogle(payload);
      } else {
        throw new Error(AppMessages.DEFAULT_ERROR);
      }
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="login-container">
      <Container maxWidth={BreakPoints.XS} className="bg-light rounded py-3">
        <>
          <h2 className="text-center text-primary mt-2 heading">Hi, Welcome Back</h2>
          <p className="text-center --bs-secondary-color ">Enter your credentials to continue</p>
          <Button
            variant="outlined"
            color="primary"
            startIcon={
              <img
                alt="google-logo"
                className="h-20-px"
                src="https://firebasestorage.googleapis.com/v0/b/hrs-uat.appspot.com/o/UI%2FGoogle%20Logo.png?alt=media&token=17d8fb7c-cd9f-4f22-983d-79f51741d04e"
              />
            }
            fullWidth
            className="google-signIn-btn"
            onClick={() => signInWithGoogle()}
          >
            Sign In With Google
          </Button>
        </>
        <div className="divide-line">
          <Button disabled variant="outlined" className="--bs-secondary-color">
            OR
          </Button>
        </div>
        <div className="text-center ">
          <p className="h6 mt-4"> Sign in with Email address </p>
        </div>
        <div className="content-center">
          <form onSubmit={handleSubmit}>
            <FormControl variant="outlined" className="mt-2" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password" className={errors.userName && touched.userName ? "text-danger" : ""}>
                Email/Contact No./Username
              </InputLabel>
              <OutlinedInput
                error={errors.userName && touched.userName ? true : undefined}
                type="text"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Email Address/ UserName"
              />
            </FormControl>

            {errors.userName && touched.userName ? <p className="text-danger text-sm">{errors.userName}</p> : null}

            <FormControl fullWidth variant="outlined" className="mt-4">
              <InputLabel htmlFor="outlined-adornment-password" className={errors.password && touched.password ? "text-danger" : ""}>
                Password
              </InputLabel>
              <OutlinedInput
                error={errors.password && touched.password ? true : undefined}
                fullWidth
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            {errors.password && touched.password ? <p className="text-danger text-sm ">{errors.password}</p> : null}
            <div className="d-flex justify-content-end my-3">
              <span className="mt-2 text-primary link">Forgot Password?</span>
            </div>
            <>
              <Button type="submit" fullWidth className="submit-btn font-weight">
                Sign In
              </Button>
            </>
          </form>
          <hr className="border mt-4 " />
        </div>
        <>
          <p className="text-center fw-bold">
            <Link className="text-decoration-none text-primary link" to={"/register"}>
              Don't have an account?
            </Link>
          </p>
        </>
      </Container>
    </div>
  );
};

export default Login;
