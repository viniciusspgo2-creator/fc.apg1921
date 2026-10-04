import {
  Barlow_Condensed,
  Bebas_Neue,
  Instrument_Serif,
  Inter,
} from "next/font/google";

/**
 * Brand typography — 4 families:
 *  Display  : Bebas Neue        (giant uppercase headlines)
 *  UI       : Barlow Condensed  (tags, menus, scoreboard numbers)
 *  Body     : Inter             (comfortable reading)
 *  Serif    : Instrument Serif  (editorial accents, quotes, intros)
 */
export const fontDisplay = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const fontUi = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/** Ready-to-spread className carrying the CSS variables. */
export const fontVariables = [
  fontDisplay.variable,
  fontUi.variable,
  fontBody.variable,
  fontSerif.variable,
].join(" ");
