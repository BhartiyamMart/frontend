import React, { useState, useEffect } from "react";
import Slider  from "../components/ui/Slider"; // Assuming a UI lib or use a custom slider
import  Checkbox  from "../components/ui/Checkbox"; // Replace with your UI checkbox
import { useSearchParams } from "react-router-dom";

const FilterSidebar = ({ brands, priceRange, onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [price, setPrice] = useState([priceRange.min, priceRange.max]);

  useEffect(() => {
    const filters = {
      brands: selectedBrands,
      price,
    };
    onFilterChange(filters);

    const params = new URLSearchParams();
    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    params.set("minPrice", price[0]);
    params.set("maxPrice", price[1]);
    setSearchParams(params);
  }, [selectedBrands, price]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <div className="p-4 w-64 border-r bg-white">
      <h2 className="text-lg font-semibold mb-2">Filter</h2>

      <div className="mb-4">
        <label className="font-medium">Price Range</label>
        <Slider
          min={priceRange.min}
          max={priceRange.max}
          value={price}
          onValueChange={setPrice}
          step={10}
        />
        <div className="text-sm mt-1 text-gray-500">
          ₹{price[0]} – ₹{price[1]}
        </div>
      </div>

      <div>
        <label className="font-medium">Brands</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center gap-2 my-1">
            <Checkbox
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
            />
            <span>{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
