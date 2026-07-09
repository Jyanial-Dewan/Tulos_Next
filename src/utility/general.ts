import {
  IAvailability,
  IBrand,
  ICatagory,
  ICollection,
  IColor,
  ISize,
  ITag,
} from "@/store/slices/catalogSlice";

export const convertToTitleCase = (str: string | undefined) => {
  if (!str) return;
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

export const colorName = (id: number | undefined, colors: IColor[]) => {
  if (!id) return;

  const color = colors.find((item) => item.color_id === id);

  if (color) {
    return color.color_name;
  }
};

export const sizeName = (id: number | undefined, sizes: ISize[]) => {
  if (!id) return;

  const size = sizes.find((item) => item.size_id === id);

  if (size) {
    return size.size_name;
  }
};

export const tagName = (id: number | undefined, sizes: ITag[]) => {
  if (!id) return;

  const tag = sizes.find((item) => item.tag_id === id);

  if (tag) {
    return tag.tag_name;
  }
};

// export const productPriceRange = (id: number | undefined, sizes: ISize[]) => {
//   if (!id) return;

//   const size = sizes.find((item) => item.size_id === id);

//   if (size) {
//     return size.size_name;
//   }
// };
