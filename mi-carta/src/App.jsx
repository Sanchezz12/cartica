// src/App.jsx
import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  CssBaseline, Container, Box, Paper, Stack, Typography, Chip,
  Divider, IconButton, Tooltip, Switch, FormControlLabel
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";

import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/700.css";
import "@fontsource/caveat/700.css";

import Carta from "./components/Carta";
import Mapa2 from "./components/Mapa2";
import "./index.css";

// Tema pastel con texto legible
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#ff8fab" },
    secondary: { main: "#a5b4fc" },
    background: { default: "transparent", paper: "rgba(255,255,255,0.10)" },
    text: { primary: "#2d2a3a" },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Quicksand", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
    h1: { fontWeight: 800 }, h2: { fontWeight: 700 }, h5: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          color: "#2d2a3a",
          border: "1px solid rgba(255,255,255,.22)",
          backdropFilter: "blur(8px) saturate(120%)",
          boxShadow: "0 10px 30px rgba(0,0,0,.22)",
          backgroundImage: "linear-gradient(rgba(255,255,255,.06), rgba(255,255,255,.04))",
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
  },
});

export default function App() {
  const [usePonyo, setUsePonyo] = useState(true);

  // ✅ ruta segura a public/ incluso en subcarpetas (GitHub Pages, etc.)
  const ponyoURL = `${import.meta.env.BASE_URL}ponyo.png`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Fondo: Ponyo desde /public o gradiente pastel */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          ...(usePonyo
            ? {
                background: `url("${ponyoURL}") center/cover no-repeat fixed`,
                transform: "scale(1.02)",
              }
            : {
                background:
                  "linear-gradient(180deg, rgba(255,240,244,0.9) 0%, rgba(231,240,255,0.92) 100%)",
              }),
        }}
      />
      {/* Velo (un poco más claro para que se vea la foto) */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: usePonyo
            ? `radial-gradient(1100px 520px at 80% 10%, rgba(255,255,255,.10), transparent 60%),
               linear-gradient(to bottom, rgba(12,12,20,.28), rgba(12,12,20,.38))`
            : `radial-gradient(800px 400px at 85% 10%, rgba(255,255,255,.14), transparent 60%)`,
          backdropFilter: "blur(2px) saturate(110%)",
        }}
      />

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CakeRoundedIcon />
                <Typography component="h1" variant="h4" sx={{ fontWeight: 800, letterSpacing: ".3px" }}>
                  Feliz cumpleaños, mi niña
                </Typography>
                <FavoriteRoundedIcon />
              </Stack>

              {/* Toggle Ponyo/Pastel */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={usePonyo ? "Usando fondo Ponyo" : "Usando fondo pastel"}>
                  <PhotoRoundedIcon />
                </Tooltip>
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={usePonyo}
                      onChange={() => setUsePonyo((v) => !v)}
                    />
                  }
                  label={usePonyo ? "Ponyo" : "Pastel"}
                  sx={{ m: 0 }}
                />
              </Stack>
            </Stack>

            <Typography variant="body2" sx={{ opacity: .9, mt: 0.5 }}>
              23 lugares de nuestros lugares y miles de recuerdos
            </Typography>
          </Paper>

          {/* Carta */}
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontFamily: '"Caveat", cursive', fontSize: { xs: 28, md: 32 } }}
            >
              Cartita para ti ✍️
            </Typography>
            <Divider sx={{ my: 1.5, opacity: .3 }} />
            <Carta />
          </Paper>

          {/* Mapa */}
          <Paper sx={{ p: { xs: 1.5, md: 2 }, overflow: "hidden" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, pb: 1 }}>
              <Stack direction="row" spacing={1.2} alignItems="center">
                <PlaceRoundedIcon />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Nuestros lugares
                </Typography>
                <IconButton size="small" color="secondary" aria-label="compartir" sx={{ ml: -0.5 }}>
                  <ShareRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Chip color="primary" label="23 lugares 💖" />
            </Stack>

            <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
              {/* corazón sutil */}
              <Box
                sx={{
                  position: "absolute", inset: 0, display: "grid", placeItems: "center",
                  pointerEvents: "none", zIndex: 1, fontSize: { xs: "22vw", md: 180 },
                  opacity: .08, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.3))",
                  animation: "beat 1.8s ease-in-out infinite",
                }}
              >
                ❤
              </Box>

              {/* badge arriba-derecha */}
              <Chip
                label="23 lugares 💖"
                color="secondary"
                size="small"
                sx={{
                  position: "absolute", zIndex: 2, top: 10, right: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,.25)",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 0 }}>
                <Mapa2 />
              </Box>
            </Box>
          </Paper>

          {/* Footer */}
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2">Hecho con 💕 desde Medellín</Typography>
          </Paper>
        </Stack>
      </Container>

      <style>{`
        @keyframes beat {
          0%,100% { transform: scale(1); }
          25% { transform: scale(1.03); }
          55% { transform: scale(0.98); }
        }
      `}</style>
    </ThemeProvider>
  );
}
