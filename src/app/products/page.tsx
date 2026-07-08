'use client'
import ProductItem from "@/components/productItem/ProductItem";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch } from "@/hooks/useAppStore";
import { IProduct } from "@/store/slices/productSlice";
import { setToken } from "@/store/slices/userSlice";
import { loadData } from "@/utility/httpRequest";
import { endpoints } from "@/variables/variables";
import { Suspense, useEffect, useState } from "react";

export default function Products() {
  // const items = Array.from({ length: 9 }).map((_, i) => i);
  const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const params = {
        url: endpoints.Products,
        // setLoading: setIsSubmitting,
        // payload: { user: data.user, password: data.password },
        // isConsole: true,
        // isToast: true,
        setLoading: setIsLoading,
      };

      const res = await loadData(params);
      if (res?.data) {
        setProducts(res.data.result);
      }

    })();
  }, []);

  return <>
    {isLoading ? <div className="flex items-center justify-center content-center"><Spinner /></div> :
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {products.map((product) => (<ProductItem key={product.product_id} item={product} />))}
      </div>}</>;
}
