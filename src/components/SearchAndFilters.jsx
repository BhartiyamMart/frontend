import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchAndFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/fulltree/full-tree")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleFinalCategoryClick = (finalCat, subCat, mainCat) => {
    // Send all 3 levels of selected category
    onFilterChange({
      categoryId: mainCat._id,
      subcategoryId: subCat._id,
      finalCategoryId: finalCat._id,
    });
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Dropdown */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Category
      </button>
       
      {isDropdownOpen && (
        <div className="absolute mt-2 flex bg-white border shadow-lg z-50">
          {/* Main Categories */}
          <div className="w-48 border-r overflow-y-auto max-h-80">
            {categories.map((mainCat) => (
              <div
                key={mainCat._id}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedMain?._id === mainCat._id ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  setSelectedMain(mainCat);
                  setHoveredSub(null); // reset subcategory on main change
                }}
              >
                {mainCat.name}
              </div>
            ))}
          </div>

          {/* SubCategories */}
          {selectedMain && selectedMain.subCategories?.length > 0 && (
            <div className="w-52 border-r overflow-y-auto max-h-80">
              {selectedMain.subCategories.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${
                    hoveredSub?._id === sub._id ? "bg-gray-100" : ""
                  }`}
                  onMouseEnter={() => setHoveredSub(sub)}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}

          {/* Final Categories */}
          {hoveredSub && hoveredSub.finalCategories?.length > 0 && (
            <div className="w-52 overflow-y-auto max-h-80">
              {hoveredSub.finalCategories.map((finalCat) => (
                <div
                  key={finalCat._id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() =>
                    handleFinalCategoryClick(finalCat, hoveredSub, selectedMain)
                  }
                >
                  {finalCat.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
