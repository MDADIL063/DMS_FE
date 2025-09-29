import * as Yup from "yup";
import { AppMessages } from "../data/app.constant";

const addEditDailyExpenseSchema = Yup.object().shape({
  date: Yup.string().required(AppMessages.REQUIRED),
  vehicle: Yup.string(),
  expenseOnFuel: Yup.number(),
  challan: Yup.number(),
  otherExpenses: Yup.number(),
  remark: Yup.string(),
});

export { addEditDailyExpenseSchema };
