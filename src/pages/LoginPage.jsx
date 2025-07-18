import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { ShoppingBag, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios"; // ✅ Import Axios for API requests

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ API Base URL from .env

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter both email and password.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password }
      );
      localStorage.setItem("authToken", data.token); // ✅ Save token
      toast({
        title: "Login Successful!",
        description: "Welcome to Bhartiyam Mart!",
      });
      navigate("/"); // ✅ Redirect after login
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          "Invalid credentials or server error.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Bhartiyam Mart</title>
        <meta
          name="description"
          content="Login to access the Bhartiyam Mart inventory management system."
        />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="zepto-gradient w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bhartiyam Mart
              </h1>
              <p className="text-gray-500">
                Sign in to your inventory dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full zepto-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>
          <p className="text-sm text-gray-500 text-center mt-6">
            &copy; {new Date().getFullYear()} Bhartiyam Mart. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;