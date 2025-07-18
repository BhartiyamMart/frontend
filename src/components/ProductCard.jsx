import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductCard = ({ product, categories, subCategories }) => {
  const [showDetails, setShowDetails] = useState(false);

  const subCategory = subCategories.find(
    (sub) =>
      sub._id === product.sub_category ||
      sub.id === product.sub_category ||
      product.sub_category?._id === sub._id
  );

  const category = categories.find(
    (cat) =>
      cat._id === product.category ||
      cat.id === product.category ||
      product.category?._id === cat._id
  );

  const handleViewDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <motion.div
      className="product-card p-4 group cursor-pointer border rounded-xl shadow-sm bg-white"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="relative mb-3">
        <img
          src={product.photos?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-70 object-cover rounded-xl"
        />

        {/* GST Badge */}
        {(product.GST > 0 || product.cess > 0) && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.GST > 0 && `${product.GST}% GST`}
            {product.cess > 0 && `+ ${product.cess}% Cess`}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {product.product_brand}
            </p>
            <p className="text-xs text-gray-400">
              {subCategory?.name || "Unknown Subcategory"}
            </p>
            <p className="text-xs text-gray-400 italic">
              {category?.name || "Unknown Category"}
            </p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              ₹{product.selling_price}
            </span>
            {product.MRP > product.selling_price && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.MRP}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={handleViewDetails}
          >
            <Info className="w-3 h-3 mr-1" />
            {showDetails ? "Hide" : "Details"}
          </Button>
        </div>
      </div>

      {/* Product Details Toggle Card */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="mt-4 p-3 bg-gray-50 border rounded-lg text-sm text-gray-700"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <p>
              <strong>Description:</strong>{" "}
              {product.product_description || "No description available."}
            </p>
            <p className="mt-1">
              <strong>Cess:</strong> {product.cess || 0}%
            </p>
            <p className="mt-1">
              <strong>Stock:</strong> {product.stock_quantity || "N/A"}
            </p>
            <p className="mt-1">
              <strong>GST:</strong> {product.GST || 0}%
            </p>
            <p className="mt-1">
              <strong>Expiry:</strong>{" "}
              {product.expiry_date
                ? new Date(product.expiry_date).toLocaleDateString()
                : "N/A"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
