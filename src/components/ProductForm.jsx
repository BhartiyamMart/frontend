// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useToast } from "@/components/ui/use-toast";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";

// const token = localStorage.getItem("token");

// const ProductForm = ({ product, onSubmit, onCancel }) => {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       sku: "",
//       HSN_code: "",
//       GST: 0,
//       expiry_date: "",
//       product_description: "",
//       product_brand: "",
//       MRP: 0,
//       selling_price: 0,
//       categoryId: "", // ✅ updated
//       subCategoryId: "", // ✅ updated
//       finalCategoryId: "", // ✅ updated
//     },
//   });

//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [finalCategories, setFinalCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [photos, setPhotos] = useState([null, null, null, null, null]);

//   const fetchData = async () => {
//     try {
//       const [cat, sub, final, br] = await Promise.all([
//         fetch("http://localhost:5000/api/categories", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch("http://localhost:5000/api/subcategories", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch("http://localhost:5000/api/finalcategories", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch("http://localhost:5000/api/brands", {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setCategories(await cat.json());
//       setSubCategories(await sub.json());
//       setFinalCategories(await final.json());
//       setBrands(await br.json());
//     } catch (error) {
//       console.error("Error fetching initial data", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (product) {
//       reset({
//         name: product.name || "",
//         sku: product.sku || "",
//         HSN_code: product.HSN_code || "",
//         GST: product.GST || 0,
//         expiry_date: product.expiry_date?.slice(0, 10) || "",
//         product_description: product.product_description || "",
//         product_brand: product.product_brand || "",
//         MRP: product.MRP || 0,
//         selling_price: product.selling_price || 0,
//         categoryId: product.category?._id || "",
//         subCategoryId: product.sub_category?._id || "",
//         finalCategoryId: product.final_category?._id || "",
//       });
//     }
//   }, [product, reset]);

//   const selectedCategory = watch("categoryId");
//   const selectedSubCategory = watch("subCategoryId");

//   const filteredSubCategories = subCategories.filter(
//     (s) => String(s.categoryId) === String(selectedCategory)
//   );

//   const filteredFinalCategories = finalCategories.filter((f) => {
//     const subCatId =
//       typeof f.subCategoryId === "object"
//         ? f.subCategoryId._id || f.subCategoryId["$oid"]
//         : f.subCategoryId;
//     return String(subCatId) === String(selectedSubCategory);
//   });

//   const handleFileChange = (index, file) => {
//     if (file && file.size > 250 * 1024) {
//       toast({
//         variant: "destructive",
//         title: "Photo too large",
//         description: "Each photo must be 250KB or less.",
//       });
//       return;
//     }
//     const updated = [...photos];
//     updated[index] = file;
//     setPhotos(updated);
//   };

//   const handleAddNew = async (type) => {
//     const name = prompt(`Enter new ${type} name:`);
//     if (!name) return;

//     try {
//       let endpoint = "";
//       let payload = { name };

//       if (type === "category") {
//         endpoint = "categories";
//       } else if (type === "subcategory") {
//         if (!selectedCategory) return alert("Select a category first.");
//         endpoint = "subcategories";
//         payload.categoryId = String(selectedCategory).trim();
//       } else if (type === "finalcategory") {
//         if (!selectedSubCategory) return alert("Select a subcategory first.");
//         endpoint = "finalcategories";
//         payload.subCategoryId = String(selectedSubCategory).trim();
//       }

//       const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       await fetchData();

//       const newId = result._id || result.id;
//       if (!newId) {
//         toast({
//           variant: "destructive",
//           title: `Failed to retrieve new ${type} ID`,
//         });
//         return;
//       }

//       if (type === "category") setValue("category", String(newId));
//       else if (type === "subcategory") setValue("subCategory", String(newId));
//       else if (type === "finalcategory")
//         setValue("finalCategory", String(newId));
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: `Failed to add ${type}`,
//       });
//       console.error(error);
//     }
//   };

//   const onFormSubmit = async (data) => {
//     console.log("Submitting product:", data);
//     if (photos.some((photo) => !photo)) {
//       toast({
//         variant: "destructive",
//         title: "Upload all photos",
//         description: "Please upload all 5 product photos before submitting.",
//       });
//       return;
//     }

//     setIsLoading(true);

//     const formData = new FormData();
//     photos.forEach((photo, index) => {
//       if (photo) {
//         formData.append(`photo${index}`, photo);
//       }
//     });

//     // ✅ Correct keys aligned with backend
//     formData.append("categoryId", data.categoryId);
//     formData.append("subCategoryId", data.subCategoryId);
//     formData.append("finalCategoryId", data.finalCategoryId);

//     // Append all remaining fields
//     Object.entries(data).forEach(([key, value]) => {
//       if (!["categoryId", "subCategoryId", "finalCategoryId"].includes(key)) {
//         formData.append(key, value);
//       }
//     });

//     try {
//       const method = product ? "put" : "post";
//       const url = product
//         ? `http://localhost:5000/api/products/${product._id}`
//         : "http://localhost:5000/api/products";

//       const res = await axios({
//         method,
//         url,
//         data: formData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast({
//         variant: "default",
//         title: `✅ Product ${product ? "updated" : "added"} successfully`,
//       });

//       reset();
//       setPhotos([null, null, null, null, null]);
//       onSubmit?.(res.data);
//       onCancel?.();
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "❌ Failed to submit product",
//         description: error.response?.data?.message || error.message,
//       });
//       console.error("Product submit error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//       <DialogHeader>
//         <DialogTitle>
//           {product ? "Edit Product" : "Add New Product"}
//         </DialogTitle>
//         <DialogDescription>Fill out the form below</DialogDescription>
//       </DialogHeader>

//       <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
//         {/* ... (keep your form fields here, unchanged) ... */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <Label>Product Name *</Label>
//             <Input
//               {...register("name", { required: "Product name is required" })}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>
//           <div>
//             <Label>SKU *</Label>
//             <Input {...register("sku", { required: "SKU is required" })} />
//             {errors.sku && (
//               <p className="text-red-500 text-sm">{errors.sku.message}</p>
//             )}
//           </div>
//           <div>
//             <Label>HSN Code</Label>
//             <Input {...register("HSN_code")} />
//           </div>
//           <div>
//             <Label>Brand *</Label>
//             <Select
//               value={watch("product_brand")}
//               onValueChange={(val) => setValue("product_brand", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select brand" />
//               </SelectTrigger>
//               <SelectContent>
//                 {brands.map((b) => (
//                   <SelectItem key={b._id} value={b.name}>
//                     {b.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="md:col-span-2">
//             <Label>Product Photos (≤250KB each)</Label>
//             {photos.map((photo, index) => (
//               <div key={index} className="mb-2">
//                 <Label>Photo {index + 1}</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileChange(index, e.target.files[0])}
//                 />
//                 {photo && (
//                   <img
//                     src={URL.createObjectURL(photo)}
//                     alt={`Preview ${index + 1}`}
//                     className="w-24 h-24 mt-1 object-cover rounded border"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//           <div>
//             <Label>Expiry Date</Label>
//             <Input type="date" {...register("expiry_date")} />
//           </div>
//           <div>
//             <Label>GST (%)</Label>
//             <Input type="number" {...register("GST")} min="0" max="100" />
//           </div>
//           <div>
//             <Label>MRP *</Label>
//             <Input
//               type="number"
//               {...register("MRP", { required: "MRP is required" })}
//             />
//             {errors.MRP && (
//               <p className="text-red-500 text-sm">{errors.MRP.message}</p>
//             )}
//           </div>
//           <div>
//             <Label>Selling Price *</Label>
//             <Input
//               type="number"
//               {...register("selling_price", {
//                 required: "Selling price is required",
//               })}
//             />
//             {errors.selling_price && (
//               <p className="text-red-500 text-sm">
//                 {errors.selling_price.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <Label>Category *</Label>
//             <Select
//               value={watch("categoryId")}
//               onValueChange={(val) =>
//                 val === "__add__"
//                   ? handleAddNew("category")
//                   : setValue("categoryId", val)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((c) => (
//                   <SelectItem key={c._id} value={String(c._id)}>
//                     {c.name}
//                   </SelectItem>
//                 ))}
//                 <SelectItem value="__add__">➕ Add New Category</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Subcategory *</Label>
//             <Select
//               value={watch("subCategoryId")}
//               onValueChange={(val) =>
//                 val === "__add__"
//                   ? handleAddNew("subcategory")
//                   : setValue("subCategoryId", val)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select subcategory" />
//               </SelectTrigger>
//               <SelectContent>
//                 {filteredSubCategories.map((s) => (
//                   <SelectItem key={s._id} value={String(s._id)}>
//                     {s.name}
//                   </SelectItem>
//                 ))}
//                 <SelectItem value="__add__">➕ Add New Subcategory</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Final Category *</Label>
//             <Select
//               value={watch("finalCategoryId")}
//               onValueChange={(val) =>
//                 val === "__add__"
//                   ? handleAddNew("finalcategory")
//                   : setValue("finalCategoryId", val)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select final category" />
//               </SelectTrigger>
//               <SelectContent>
//                 {filteredFinalCategories.map((f) => (
//                   <SelectItem key={f._id} value={String(f._id)}>
//                     {f.name}
//                   </SelectItem>
//                 ))}
//                 <SelectItem value="__add__">
//                   ➕ Add New Final Category
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div>
//           <Label>Description</Label>
//           <Textarea {...register("product_description")} rows={3} />
//         </div>
//         <div className="flex justify-end gap-3 pt-4">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading}>
//             {isLoading
//               ? "Submitting..."
//               : product
//               ? "Update Product"
//               : "Add Product"}
//           </Button>
//         </div>
//       </form>
//     </DialogContent>
//   );
// };

// export default ProductForm;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const token = localStorage.getItem("token");

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [finalCategories, setFinalCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [photos, setPhotos] = useState([null, null, null, null, null]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      sku: "",
      HSN_code: "",
      GST: 0,
      cess: 0,
      expiry_date: "",
      product_description: "",
      product_brand: "",
      MRP: 0,
      selling_price: 0,
      categoryId: "",
      subCategoryId: "",
      finalCategoryId: "",
    },
  });

  const fetchData = async () => {
    try {
      const [cat, sub, final, br] = await Promise.all([
        fetch("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/subcategories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/finalcategories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/brands", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(await cat.json());
      setSubCategories(await sub.json());
      setFinalCategories(await final.json());
      setBrands(await br.json());
    } catch (error) {
      console.error("Error fetching initial data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        sku: product.sku || "",
        HSN_code: product.HSN_code || "",
        GST: product.GST || 0,
        cess: product.cess || 0,
        expiry_date: product.expiry_date?.slice(0, 10) || "",
        product_description: product.product_description || "",
        product_brand: product.product_brand || "",
        MRP: product.MRP || 0,
        selling_price: product.selling_price || 0,
        categoryId: product.category?._id || "",
        subCategoryId: product.sub_category?._id || "",
        finalCategoryId: product.final_category?._id || "",
      });
    }
  }, [product, reset]);

  useEffect(() => {
    if (product && Array.isArray(product.photos)) {
      const filledPhotos = [...product.photos];
      while (filledPhotos.length < 5) {
        filledPhotos.push(null);
      }
      setPhotos(filledPhotos.slice(0, 5));
    }
  }, [product]);

  const selectedCategory = watch("categoryId");
  const selectedSubCategory = watch("subCategoryId");

  const filteredSubCategories = subCategories.filter(
    (s) => String(s.categoryId) === String(selectedCategory)
  );

  const filteredFinalCategories = finalCategories.filter((f) => {
    const subCatId =
      typeof f.subCategoryId === "object"
        ? f.subCategoryId._id || f.subCategoryId["$oid"]
        : f.subCategoryId;
    return String(subCatId) === String(selectedSubCategory);
  });

  const handleFileChange = (index, file) => {
    if (file && file.size > 250 * 1024) {
      toast({
        variant: "destructive",
        title: "Photo too large",
        description: "Each photo must be 250KB or less.",
      });
      return;
    }
    const updated = [...photos];
    updated[index] = file;
    setPhotos(updated);
  };

  const handleAddNew = async (type) => {
    const name = prompt(`Enter new ${type} name:`);
    if (!name) return;

    try {
      let endpoint = "";
      let payload = { name };

      if (type === "category") {
        endpoint = "categories";
      } else if (type === "subcategory") {
        if (!selectedCategory) return alert("Select a category first.");
        endpoint = "subcategories";
        payload.categoryId = String(selectedCategory).trim();
      } else if (type === "finalcategory") {
        if (!selectedSubCategory) return alert("Select a subcategory first.");
        endpoint = "finalcategories";
        payload.subCategoryId = String(selectedSubCategory).trim();
      }

      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      await fetchData();

      const newId = result._id || result.id;
      if (!newId) {
        toast({
          variant: "destructive",
          title: `Failed to retrieve new ${type} ID`,
        });
        return;
      }

      if (type === "category") setValue("categoryId", String(newId));
      else if (type === "subcategory") setValue("subCategoryId", String(newId));
      else if (type === "finalcategory")
        setValue("finalCategoryId", String(newId));
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to add ${type}`,
      });
      console.error(error);
    }
  };

  const onFormSubmit = async (data) => {
    if (photos.some((photo) => !photo)) {
      toast({
        variant: "destructive",
        title: "Upload all photos",
        description: "Please upload all 5 product photos before submitting.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    photos.forEach((photo, index) => {
      if (photo && typeof photo !== "string") {
        formData.append(`photo${index}`, photo);
      }
    });

    formData.append("categoryId", data.categoryId);
    formData.append("subCategoryId", data.subCategoryId);
    formData.append("finalCategoryId", data.finalCategoryId);

    Object.entries(data).forEach(([key, value]) => {
      if (!["categoryId", "subCategoryId", "finalCategoryId"].includes(key)) {
        formData.append(key, value);
      }
    });

    try {
      const method = product ? "put" : "post";
      const url = product
        ? `http://localhost:5000/api/products/${product._id}`
        : "http://localhost:5000/api/products";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        variant: "default",
        title: `✅ Product ${product ? "updated" : "added"} successfully`,
      });

      reset();
      setPhotos([null, null, null, null, null]);
      onSubmit?.(res.data);
      onCancel?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "❌ Failed to submit product",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {product ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogDescription>Fill out the form below</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* ... (keep your form fields here, unchanged) ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Product Name *</Label>
            <Input
              {...register("name", { required: "Product name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label>SKU *</Label>
            <Input {...register("sku", { required: "SKU is required" })} />
            {errors.sku && (
              <p className="text-red-500 text-sm">{errors.sku.message}</p>
            )}
          </div>
          <div>
            <Label>HSN Code</Label>
            <Input {...register("HSN_code")} />
          </div>
          <div>
            <Label>Brand *</Label>
            <Select
              value={watch("product_brand")}
              onValueChange={(val) => setValue("product_brand", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b._id} value={b.name}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Product Photos (≤250KB each)</Label>
            {photos.map((photo, index) => (
              <div key={index} className="mb-2">
                <Label>Photo {index + 1}</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                />
                {photo && (
                  <img
                    src={
                      typeof photo === "string"
                        ? photo
                        : URL.createObjectURL(photo)
                    }
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 mt-1 object-cover rounded border"
                  />
                )}
              </div>
            ))}
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input type="date" {...register("expiry_date")} />
          </div>
          <div>
            <Label>GST (%)</Label>
            <Input type="number" {...register("GST")} min="0" max="100" />
          </div>
          <div>
            <Label>Cess (%)</Label>
            <Input type="number" {...register("cess")} min="0" max="100" />
          </div>
          <div>
            <Label>MRP *</Label>
            <Input
              type="number"
              {...register("MRP", { required: "MRP is required" })}
            />
            {errors.MRP && (
              <p className="text-red-500 text-sm">{errors.MRP.message}</p>
            )}
          </div>
          <div>
            <Label>Selling Price *</Label>
            <Input
              type="number"
              {...register("selling_price", {
                required: "Selling price is required",
              })}
            />
            {errors.selling_price && (
              <p className="text-red-500 text-sm">
                {errors.selling_price.message}
              </p>
            )}
          </div>
          <div>
            <Label>Category *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(val) =>
                val === "__add__"
                  ? handleAddNew("category")
                  : setValue("categoryId", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={String(c._id)}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value="__add__">➕ Add New Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Subcategory *</Label>
            <Select
              value={watch("subCategoryId")}
              onValueChange={(val) =>
                val === "__add__"
                  ? handleAddNew("subcategory")
                  : setValue("subCategoryId", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {filteredSubCategories.map((s) => (
                  <SelectItem key={s._id} value={String(s._id)}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value="__add__">➕ Add New Subcategory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Final Category *</Label>
            <Select
              value={watch("finalCategoryId")}
              onValueChange={(val) =>
                val === "__add__"
                  ? handleAddNew("finalcategory")
                  : setValue("finalCategoryId", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select final category" />
              </SelectTrigger>
              <SelectContent>
                {filteredFinalCategories.map((f) => (
                  <SelectItem key={f._id} value={String(f._id)}>
                    {f.name}
                  </SelectItem>
                ))}
                <SelectItem value="__add__">
                  ➕ Add New Final Category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea {...register("product_description")} rows={3} />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Submitting..."
              : product
              ? "Update Product"
              : "Add Product"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ProductForm;
