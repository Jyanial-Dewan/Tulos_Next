import { ICatagory } from "@/store/slices/productSlice";

export const convertToTitleCase = (str: string) => {
  // convert "profile_type_one" to 'Profile Type One'
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const categoryName = (
  id: number | undefined,
  catagories: ICatagory[],
) => {
  if (!id) return;

  const category = catagories.find((item) => item.catagory_id === id);

  if (category) {
    return category.catagory_name;
  }
};
