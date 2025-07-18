// import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet";
// import { motion } from "framer-motion";
// import { ShoppingBag, LogOut, UserCog } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import ProductCard from "@/components/ProductCard";
// import SearchAndFilters from "@/components/SearchAndFilters";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

// const HomePage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [filterIds, setFilterIds] = useState({
//     categoryId: "",
//     subcategoryId: "",
//     finalCategoryId: "",
//   });
//   const navigate = useNavigate();

//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data: productList } = await axios.get(
//           `${API_BASE_URL}/products`
//         );
//         setProducts(productList);

//         const uniqueCategories = [];
//         const uniqueSubCategories = [];

//         productList.forEach((product) => {
//           if (
//             product.category &&
//             !uniqueCategories.some((cat) => cat._id === product.category._id)
//           ) {
//             uniqueCategories.push(product.category);
//           }

//           if (
//             product.sub_category &&
//             !uniqueSubCategories.some(
//               (sub) => sub._id === product.sub_category._id
//             )
//           ) {
//             uniqueSubCategories.push(product.sub_category);
//           }
//         });

//         setCategories(uniqueCategories);
//         setSubCategories(uniqueSubCategories);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//       }
//     };

//     fetchData();
//   }, [API_BASE_URL]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/login");
//   };
//   const handleFilterChange = ({
//     categoryId,
//     subcategoryId,
//     finalCategoryId,
//   }) => {
//     setFilterIds({ categoryId, subcategoryId, finalCategoryId });
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.product_brand?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory =
//       !filterIds.categoryId || product.category?._id === filterIds.categoryId;

//     const matchesSubCategory =
//       !filterIds.subcategoryId ||
//       product.sub_category?._id === filterIds.subcategoryId;

//     const matchesFinalCategory =
//       !filterIds.finalCategoryId ||
//       product.final_category?._id === filterIds.finalCategoryId;

//     return (
//       matchesSearch &&
//       matchesCategory &&
//       matchesSubCategory &&
//       matchesFinalCategory
//     );
//   });

//   return (
//     <>
//       <Helmet>
//         <title>Bhartiyam Mart - Inventory Store</title>
//         <meta
//           name="description"
//           content="Browse all products available in the Bhartiyam Mart inventory store."
//         />
//       </Helmet>

//       <div className="min-h-screen bg-gray-50">
//         <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex items-center gap-3">
//                 <div className="zepto-gradient w-10 h-10 rounded-xl flex items-center justify-center">
//                   <ShoppingBag className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900">
//                     Bhartiyam Mart
//                   </h1>
//                   <p className="text-xs text-gray-500">Inventory Store</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <Link
//                   to="/admin"
//                   className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
//                 >
//                   <UserCog className="w-4 h-4" />
//                   Admin
//                 </Link>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleLogout}
//                   className="flex items-center gap-1"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   Logout
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </header>

//         <section className="zepto-gradient py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                 Welcome to Bhartiyam Mart
//               </h2>
//               <p className="text-lg text-white/90">
//                 Your one-stop solution for inventory management.
//               </p>
//             </motion.div>
//           </div>
//         </section>

//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <SearchAndFilters
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             selectedCategory={filterIds.categoryId}
//             setSelectedCategory={(categoryId) =>
//               setFilterIds((prev) => ({
//                 ...prev,
//                 categoryId,
//                 subcategoryId: "",
//                 finalCategoryId: "",
//               }))
//             }
//             selectedFinalCategory={filterIds.finalCategoryId}
//             setSelectedFinalCategory={(finalCategoryId, subcategoryId) =>
//               setFilterIds((prev) => ({
//                 ...prev,
//                 finalCategoryId,
//                 subcategoryId,
//               }))
//             }
//             categories={categories}
//             onFilterChange={handleFilterChange}
//           />

//           <div className="mb-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//               {filteredProducts.length} Products Available
//             </h3>

//             {filteredProducts.length === 0 ? (
//               <div className="text-center py-12">
//                 <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-gray-500">
//                   Try adjusting your search or filters
//                 </p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                 {filteredProducts.map((product, index) => (
//                   <motion.div
//                     key={product._id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: index * 0.05 }}
//                   >
//                     <ProductCard
//                       product={product}
//                       categories={categories}
//                       subCategories={subCategories}
//                     />
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>

//         <footer className="bg-white border-t border-gray-200 mt-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//             <div className="flex flex-col items-center text-center">
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
//                 <ShoppingBag className="w-6 h-6 text-white" />
//               </div>

//               <h2 className="text-xl font-bold text-gray-900">
//                 Bhartiyam Mart
//               </h2>
//               <p className="text-gray-600 text-sm mt-1 mb-3">
//                 Inventory Management System
//               </p>

//               <div className="w-24 h-px bg-gray-300 my-4" />

//               <p className="text-sm text-gray-500">
//                 &copy; {new Date().getFullYear()} Bhartiyam Mart. All rights
//                 reserved.
//               </p>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ShoppingBag, LogOut, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import SearchAndFilters from "@/components/SearchAndFilters";
import { Button } from "@/components/ui/button";
import axios from "axios";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // from full-tree
  const [searchTerm, setSearchTerm] = useState("");

  const [filterIds, setFilterIds] = useState({
    categoryId: "",
    subcategoryId: "",
    finalCategoryId: "",
  });
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productList } = await axios.get(
          `${API_BASE_URL}/products`
        );
        setProducts(productList);

        // Fetch full category tree
        const { data: fullTree } = await axios.get(
          `${API_BASE_URL}/fulltree/full-tree`
        );
        setCategories(fullTree);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleFilterChange = ({
    categoryId,
    subcategoryId,
    finalCategoryId,
  }) => {
    setFilterIds({ categoryId, subcategoryId, finalCategoryId });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_brand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !filterIds.categoryId ||
      (product.category?._id?.toString?.() ||
        product.category?.toString?.()) === filterIds.categoryId;

    const matchesSubCategory =
      !filterIds.subcategoryId ||
      (product.sub_category?._id?.toString?.() ||
        product.sub_category?.toString?.()) === filterIds.subcategoryId;

    const matchesFinalCategory =
      !filterIds.finalCategoryId ||
      (product.final_category?._id?.toString?.() ||
        product.final_category?.toString?.()) === filterIds.finalCategoryId;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSubCategory &&
      matchesFinalCategory
    );
  });

  return (
    <>
      <Helmet>
        <title>Bhartiyam Mart - Inventory Store</title>
        <meta
          name="description"
          content="Browse all products available in the Bhartiyam Mart inventory store."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="zepto-gradient w-10 h-10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bhartiyam Mart
                  </h1>
                  <p className="text-xs text-gray-500">Inventory Store</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/admin"
                  className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <UserCog className="w-4 h-4" />
                  Admin
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <section className="zepto-gradient py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Welcome to Bhartiyam Mart
              </h2>
              <p className="text-lg text-white/90">
                Your one-stop solution for inventory management.
              </p>
            </motion.div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SearchAndFilters
            categories={categories}
            onSearch={setSearchTerm}
            onFilterChange={handleFilterChange}
          />

          {(filterIds.categoryId ||
            filterIds.subcategoryId ||
            filterIds.finalCategoryId) && (
            <div className="flex justify-end mt-2 mb-4">
              <Button
                variant="outline"
                className="text-sm"
                onClick={() => {
                  setFilterIds({
                    categoryId: "",
                    subcategoryId: "",
                    finalCategoryId: "",
                  });
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {filteredProducts.length} Products Available
            </h3>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product}
                      categories={categories}
                      subCategories={[]} // not needed anymore
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                Bhartiyam Mart
              </h2>
              <p className="text-gray-600 text-sm mt-1 mb-3">
                Inventory Management System
              </p>

              <div className="w-24 h-px bg-gray-300 my-4" />

              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Bhartiyam Mart. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
