import {
  IAvailability,
  IBrand,
  ICatagory,
  ICollection,
} from "@/store/slices/catalogSlice";

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

export const brandName = (id: number | undefined, brands: IBrand[]) => {
  if (!id) return;

  const brand = brands.find((item) => item.brand_id === id);

  if (brand) {
    return brand.brand_name;
  }
};

export const collectionName = (
  id: number | undefined,
  collections: ICollection[],
) => {
  if (!id) return;

  const collection = collections.find((item) => item.collection_id === id);

  if (collection) {
    return collection.collection_name;
  }
};

export const availabilityName = (
  id: number | undefined,
  availabilities: IAvailability[],
) => {
  if (!id) return;

  const availability = availabilities.find(
    (item) => item.availability_id === id,
  );

  if (availability) {
    return availability.availability_name;
  }
};
