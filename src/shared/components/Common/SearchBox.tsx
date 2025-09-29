import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { FormikErrors } from "formik";

interface IProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>;
  values: any;
}

const SearchBox = ({ values, setFieldValue }: IProps) => {
  return (
    <FormControl variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-search">
        Search
      </InputLabel>
      <OutlinedInput
        size="small"
        name="q"
        id="outlined-adornment-search"
        type="search"
        label="Search"
        value={values.q}
        fullWidth
        onChange={async (e) => {
          setFieldValue("q", e.target.value);
          await setFieldValue("page", 0);
          await setFieldValue("limit", values.limit);
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchTwoToneIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchBox;
