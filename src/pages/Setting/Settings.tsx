import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import { Button, Card, CardContent, CardHeader, FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import { useFormik } from "formik";
import { useEffect } from "react";
import { AppMessages } from "../../data/app.constant";
import { addEditSettingsSchema } from "../../schemas/settings.schema";
import { AppNotificationService } from "../../services/app-notification.service";
import { CommonService } from "../../services/common.service";
import BackButton from "../../shared/components/BackButton";

const initialValues = {
  pricePerKM: "",
};

const Settings = () => {
  const notifySvc = new AppNotificationService();
  const commonSvc = new CommonService();

  const { values, touched, errors, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: addEditSettingsSchema,
    validateOnChange: true,

    onSubmit: async (values) => {
      try {
        await commonSvc.addUpdateSettings(values as any);
        notifySvc.showSucces(AppMessages.SETTINGS_UPDATED);
      } catch (error) {
        notifySvc.showError(error);
      }
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await commonSvc.getSettings();
      setFieldValue("pricePerKM", response?.pricePerKM || "");
    } catch (error) {
      notifySvc.showError(error);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="row my-4">
        <div className="col-12">
          <BackButton />
        </div>
      </div>
      <Card>
        <CardHeader title="Project Settings" className="card-heading" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12 col-sm-12 col-12 mt-4">
                <FormControl variant="outlined" fullWidth>
                  <InputLabel
                    className={errors.pricePerKM && touched.pricePerKM ? "text-danger" : ""}
                    htmlFor="outlined-adornment-password"
                  >
                    Price Per KM
                  </InputLabel>
                  <OutlinedInput
                    error={errors.pricePerKM && touched.pricePerKM ? true : undefined}
                    type="number"
                    name="pricePerKM"
                    label="Price Per KM"
                    value={values.pricePerKM}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    startAdornment={
                      <InputAdornment position="start">
                        <CurrencyRupeeTwoToneIcon fontSize="small" />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.pricePerKM && touched.pricePerKM ? (
                  <p className="text-danger text-sm">{errors.pricePerKM}</p>
                ) : (
                  <p className="text-danger text-sm invisible">&nbsp;</p>
                )}
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12"></div>
                  <div className="col-md-3 col-12 mt-2">
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
