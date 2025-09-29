import * as Yup from "yup";
import { AppMessages } from "../data/app.constant";

const addEditSettingsSchema = Yup.object().shape({
  pricePerKM: Yup.number().required(AppMessages.REQUIRED),
});

export { addEditSettingsSchema };
