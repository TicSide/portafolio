// Anchos de avance de Bricolage Grotesque (wght 800, opsz 96, wdth 100), en em,
// extraídos del archivo de la fuente con fontTools (sin kerning, que solo resta).
// Sirven para que los titulares gigantes ocupen el ancho disponible sin
// cortarse: ver .fit en global.css.
const advances: Record<string, number> = {
  " ": 0.203,
  "!": 0.268,
  "\"": 0.34,
  "#": 0.613,
  "$": 0.575,
  "%": 0.948,
  "&": 0.697,
  "'": 0.174,
  "(": 0.303,
  ")": 0.303,
  "*": 0.457,
  "+": 0.486,
  ",": 0.193,
  "-": 0.313,
  ".": 0.246,
  "/": 0.349,
  "0": 0.594,
  "1": 0.31,
  "2": 0.551,
  "3": 0.565,
  "4": 0.607,
  "5": 0.565,
  "6": 0.592,
  "7": 0.498,
  "8": 0.608,
  "9": 0.603,
  ":": 0.25,
  ";": 0.235,
  "<": 0.486,
  "=": 0.486,
  ">": 0.486,
  "?": 0.396,
  "@": 0.936,
  "A": 0.659,
  "B": 0.608,
  "C": 0.631,
  "D": 0.621,
  "E": 0.54,
  "F": 0.51,
  "G": 0.649,
  "H": 0.637,
  "I": 0.243,
  "J": 0.323,
  "K": 0.623,
  "L": 0.46,
  "M": 0.822,
  "N": 0.694,
  "O": 0.661,
  "P": 0.586,
  "Q": 0.659,
  "R": 0.615,
  "S": 0.585,
  "T": 0.516,
  "U": 0.627,
  "V": 0.632,
  "W": 0.915,
  "X": 0.623,
  "Y": 0.595,
  "Z": 0.55,
  "[": 0.295,
  "]": 0.295,
  "_": 0.527,
  "a": 0.543,
  "b": 0.576,
  "c": 0.539,
  "d": 0.576,
  "e": 0.537,
  "f": 0.376,
  "g": 0.549,
  "h": 0.562,
  "i": 0.234,
  "j": 0.244,
  "k": 0.541,
  "l": 0.234,
  "m": 0.86,
  "n": 0.562,
  "o": 0.567,
  "p": 0.574,
  "q": 0.574,
  "r": 0.4,
  "s": 0.517,
  "t": 0.368,
  "u": 0.557,
  "v": 0.53,
  "w": 0.799,
  "x": 0.543,
  "y": 0.539,
  "z": 0.483,
  "{": 0.321,
  "|": 0.218,
  "}": 0.321,
  "~": 0.486,
  "á": 0.543,
  "é": 0.537,
  "í": 0.234,
  "ó": 0.567,
  "ú": 0.557,
  "Á": 0.659,
  "É": 0.54,
  "Í": 0.243,
  "Ó": 0.661,
  "Ú": 0.627,
  "ñ": 0.562,
  "Ñ": 0.694,
  "ü": 0.557,
  "Ü": 0.627,
  "¿": 0.386,
  "¡": 0.268,
  "’": 0.193,
  "‘": 0.193,
  "“": 0.382,
  "”": 0.382,
  "–": 0.5,
  "—": 0.775,
  "·": 0.246,
};

/** Ancho del texto en em, con el tracking negativo de los titulares. */
export function displayWidth(text: string, tracking = -0.045): number {
  let width = 0;
  let count = 0;
  for (const ch of text) {
    width += advances[ch] ?? 0.6;
    count += 1;
  }
  return Math.round((width + tracking * count) * 1000) / 1000;
}

/** Estilo en línea para un titular que se ajusta al ancho de su contenedor. */
export function fitStyle(text: string): string {
  return `--fit: ${displayWidth(text)}`;
}

/**
 * Para titulares de varias palabras que sí pueden partirse en líneas: el
 * tamaño se calcula con la palabra más ancha, que nunca debe cortarse.
 */
export function fitWordsStyle(text: string): string {
  const widest = Math.max(...text.split(/\s+/).map((word) => displayWidth(word)));
  return `--fit: ${widest}`;
}

