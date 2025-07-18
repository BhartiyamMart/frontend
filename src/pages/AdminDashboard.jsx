import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Download,
  ArrowLeft,
  Package,
  BarChart3,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ProductForm from "@/components/ProductForm";
import AddBrandForm from "@/components/AddBrandForm";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [productsRes, categoriesRes, subCategoriesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/categories`),
        axios.get(`${API_BASE_URL}/subcategories`),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSubCategories(subCategoriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleAddProduct = async (productData) => {
    await fetchAllData();
    setIsDialogOpen(false);
  };

  const handleEditProduct = async (updatedData) => {
    await fetchAllData();
    setEditingProduct(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
  if (!productId) {
    console.error("Invalid productId: undefined");
    toast({ title: "Error: Product ID is missing", variant: "destructive" });
    return;
  }

  try {
    await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts((prevProducts) =>
      prevProducts.filter((p) => p._id !== productId)
    );

    toast({ title: "Product deleted successfully!" });
  } catch (err) {
    console.error("Error deleting product:", err);
    toast({ title: "Failed to delete product", variant: "destructive" });
  }
};


  const handleExportExcel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products/download/excel`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: "Products downloaded successfully!" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to download products", variant: "destructive" });
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Unknown";
    const id =
      typeof categoryId === "object"
        ? categoryId._id || categoryId.id
        : categoryId;
    const category = categories.find((cat) => String(cat._id) === String(id));
    return category ? category.name : "Unknown";
  };

  const getSubCategoryName = (subCategoryId) => {
    if (!subCategoryId) return "Unknown";
    const id =
      typeof subCategoryId === "object"
        ? subCategoryId._id || subCategoryId.id
        : subCategoryId;
    const sub = subCategories.find((s) => String(s._id) === String(id));
    return sub ? sub.name : "Unknown";
  };

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.selling_price || 0),
    0
  );
  const lowStockProducts = products.filter((p) => {
    const expiry = new Date(p.expiry_date);
    const today = new Date();
    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return days <= 7;
  }).length;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Bhartiyam Mart</title>
        <meta
          name="description"
          content="Manage products, inventory and orders in Bhartiyam Mart admin dashboard."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Store</span>
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center gap-3">
                  <div className="zepto-gradient w-10 h-10 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Admin Dashboard
                    </h1>
                    <p className="text-xs text-gray-500">Bhartiyam Mart</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleExportExcel}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export Excel</span>
                </Button>
                <Dialog
                  open={isBrandDialogOpen}
                  onOpenChange={setIsBrandDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Brand</span>
                    </Button>
                  </DialogTrigger>
                  <AddBrandForm
                    onClose={() => setIsBrandDialogOpen(false)}
                    onSuccess={() =>
                      toast({ title: "Brand added successfully!" })
                    }
                  />
                </Dialog>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="zepto-button flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Product</span>
                    </Button>
                  </DialogTrigger>
                  <ProductForm
                    product={editingProduct}
                    onSubmit={
                      editingProduct ? handleEditProduct : handleAddProduct
                    }
                    onCancel={() => {
                      setIsDialogOpen(false);
                      setEditingProduct(null);
                    }}
                    categories={categories}
                    subCategories={subCategories}
                  />
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        {/* Rest of dashboard code remains unchanged */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard cards, product table and all internal components go here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalProducts}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="admin-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-600">
                    {lowStockProducts}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Products Management
              </h2>
              <span className="text-sm text-gray-500">
                {products.length} total products
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Brand
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      MRP
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Selling Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      GST
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Expiry
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.photos[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {getSubCategoryName(product.sub_category)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {getCategoryName(product.category)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {product.product_brand}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        ₹{product.MRP}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">
                        ₹{product.selling_price}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {product.GST}%
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(product.expiry_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Product
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteProduct(product._id)
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding your first product to the inventory
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="zepto-button"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Product
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
