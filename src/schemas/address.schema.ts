import * as Yup from "yup";
import { AppMessages } from "../data/app.constant";

const addEditAddressSchema = Yup.object().shape({
  name: Yup.string().required(AppMessages.REQUIRED),
  flatNo: Yup.string(),
  streetName: Yup.string().required(AppMessages.REQUIRED),
  area: Yup.string().required(AppMessages.REQUIRED),
  pincode: Yup.number().required(AppMessages.REQUIRED),
  city: Yup.string().required(AppMessages.REQUIRED),
  state: Yup.string().required(AppMessages.REQUIRED),
  lat: Yup.number(),
  lng: Yup.number(),
});

export { addEditAddressSchema };
