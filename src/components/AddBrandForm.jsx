// src/components/AddBrandForm.jsx
import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const AddBrandForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    country_origin: "",
    manufactured_by: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("authToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/brands`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 👈 Make it explicit
        },
      });

      toast({ title: "Brand added successfully!" });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to add brand", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Brand</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Brand Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="country_origin">Country of Origin</Label>
          <Input
            id="country_origin"
            name="country_origin"
            value={formData.country_origin}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="manufactured_by">Manufacturer Name</Label>
          <Input
            id="manufactured_by"
            name="manufactured_by"
            value={formData.manufactured_by}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Brand"}
        </Button>
      </form>
    </DialogContent>
  );
};

export default AddBrandForm;
