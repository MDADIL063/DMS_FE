import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ede7f6",
      main: "#673ab7",
    },
    secondary: {
      main: "#1e88e5",
    },
    text: {
      primary: "#121926",
    },
  },
  typography: {
    fontFamily: "Roboto",
  },
  shape: {
    borderRadius: 4,
  },
});

export default theme;
