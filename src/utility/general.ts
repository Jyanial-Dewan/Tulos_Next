export const convertToTitleCase = (str: string) => {
  // convert "profile_type_one" to 'Profile Type One'
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
