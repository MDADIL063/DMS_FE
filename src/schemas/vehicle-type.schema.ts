import * as Yup from "yup";

import { AppMessages } from "../data/app.constant";

const AddEditVehicleTypeSchema = Yup.object({
  name: Yup.string().required(AppMessages.REQUIRED),
});

export { AddEditVehicleTypeSchema };
