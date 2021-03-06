
export const percentize = (decimal, min, max) => {
  if (typeof decimal !== "number" || isNaN(decimal)) return "";
  return max === 0
    ? `${(decimal * 100).toFixed(0)}%`
    : `${(decimal * 100).toLocaleString("en-US", {
      style: "decimal",
      minimumFractionDigits: min || 2,
      maximumFractionDigits: max || 2,
    })}%`;
};

export const capitalize = (string) => {
  if (typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatWithCommas = (number) =>
  typeof number === "number" ? number.toLocaleString("en-US") : number;
