// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#ff8fab" },   // rosado pastel
    secondary: { main: "#a5b4fc" }, // lila pastel
    background: { default: "transparent", paper: "rgba(255,255,255,0.10)" },
    text: { primary: "#fff" },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Quicksand", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255,255,255,.22)",
          backdropFilter: "blur(8px) saturate(120%)",
          boxShadow: "0 10px 30px rgba(0,0,0,.22)",
          backgroundImage: "linear-gradient(rgba(255,255,255,.06), rgba(255,255,255,.04))",
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
  },
});

export default theme;
