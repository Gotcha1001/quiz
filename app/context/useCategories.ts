// import { useEffect, useState } from "react";
// import axios from "axios";

// const useCategories = () => {
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);

//   const getCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/categories");

//       setCategories(res.data);

//       setLoading(false);
//     } catch (error) {
//       console.log("Error fetching categories", error);
//     }
//   };

//   useEffect(() => {
//     getCategories();
//   }, []);

//   return { loading, categories };
// };

// export default useCategories;

import { useEffect, useState } from "react";
import axios from "axios";
import { ICategory } from "@/types/types";

const useCategories = () => {
  const [loading, setLoading] = useState(true); // starts true, no need to set it again in the effect
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    let cancelled = false;

    const getCategories = async () => {
      try {
        const res = await axios.get<ICategory[]>("/api/categories");
        if (!cancelled) {
          setCategories(res.data);
        }
      } catch (error) {
        console.log("Error fetching categories", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    getCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, categories };
};

export default useCategories;
