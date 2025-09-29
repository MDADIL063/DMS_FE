import * as Yup from "yup";

import { AppDefaults, AppMessages, ImageMimeType } from "../data/app.constant";

const LoginSchema = Yup.object({
  userName: Yup.string().required(AppMessages.REQUIRED),
  password: Yup.string().min(8).required(AppMessages.REQUIRED),
});

const SignUpSchema = Yup.object().shape({
  file: Yup.mixed()
    .nullable()
    .notRequired()
    .test("FILE_SIZE", AppMessages.FILE_SIZE, (value: any) => !value || (value && value?.size <= AppDefaults.MAX_FILE_SIZE))
    .test("FILE_FORMAT", AppMessages.FILE_TYPE, (value: any) => !value || (value && Object.keys(ImageMimeType).includes(value.type))),
  name: Yup.string().required(AppMessages.REQUIRED),
  userName: Yup.string().required(AppMessages.REQUIRED),
  email: Yup.string().email().required(AppMessages.REQUIRED),
  contactNumber: Yup.string().min(10).max(10).required(AppMessages.REQUIRED),
  password: Yup.string()
    .min(8)
    .required(AppMessages.REQUIRED)
    .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password should contain at least one uppercase and lowercase character")
    .matches(/\d/, "Password should contain at least one number")
    .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
});

export { LoginSchema, SignUpSchema };
