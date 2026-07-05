"use client";

import { useAppDispatch } from "@/hooks/useAppStore";
import { useEffect } from "react";
import {
  setAvailabilities,
  setBrands,
  setCatagories,
  setCollections,
  setColors,
  setGenders,
  setSizes,
  setTags,
} from "./slices/catalogSlice";

export default function CatalogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadCatalogs = async () => {
      // Category
      const categoryRes = await fetch("/api/categories");
      const categoryData = await categoryRes.json();
      // Collections
      const collectionsRes = await fetch("/api/collections");
      const collectionsData = await collectionsRes.json();
      // Colors
      const colorsRes = await fetch("/api/colors");
      const colorsData = await colorsRes.json();
      // Tags
      const tagsRes = await fetch("/api/tags");
      const tagsData = await tagsRes.json();
      // Genders
      const gendersRes = await fetch("/api/genders");
      const gendersData = await gendersRes.json();
      console.log(gendersData, "genderData");
      // Genders
      const availabilitiesRes = await fetch("/api/availabilities");
      const availabilitiesData = await availabilitiesRes.json();
      // Brands
      const brandsRes = await fetch("/api/brands");
      const brandsData = await brandsRes.json();
      // Brands
      const sizesRes = await fetch("/api/sizes");
      const sizesData = await sizesRes.json();

      dispatch(setCatagories(categoryData.result));
      dispatch(setCollections(collectionsData.result));
      dispatch(setColors(colorsData.result));
      dispatch(setTags(tagsData.result));
      dispatch(setGenders(gendersData.result));
      dispatch(setAvailabilities(availabilitiesData.result));
      dispatch(setBrands(brandsData.result));
      dispatch(setSizes(sizesData.result));
    };

    loadCatalogs();
  }, [dispatch]);

  return children;
}
