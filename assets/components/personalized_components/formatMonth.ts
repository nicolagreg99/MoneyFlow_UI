import { TFunction } from "i18next";

const KEYS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** "2025-03" -> "March 2025" (tradotto) */
export const formatMonth = (ym: string, t: TFunction): string => {
  const [y, m] = ym.split("-");
  return `${t(KEYS[parseInt(m, 10) - 1])} ${y}`;
};