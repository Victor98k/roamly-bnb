"'use client'";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Mail, Terminal } from "lucide-react";
import { Alert } from "antd";

export function Login() {
  const [email, setEmail] = useState("''");
  const [password, setPassword] = useState("''");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "loading";
    message: string;
    description: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setAlert({
          type: "error",
          message: "Login failed",
          description: "Please check your email and password",
        });
        return;
      }
      // setAlert({
      //   type: "loading",
      //   message: "Logging in...",
      //   description: "Please wait while we log you in",
      // });

      setAlert({
        type: "success",
        message: "Login in...",
        description: "You have successfully logged in",
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      // console.log("Login successful:", data);

      router.push("/home");
    } catch (error) {
      console.error("Error during login:", error);
      setAlert({
        type: "error",
        message: "Login failed",
        description: "An error occurred during login. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center from-gray-900   to-black-600">
        {alert && (
          <div className="mb-4 w-full max-w-md">
            <Alert
              message={alert.message}
              description={alert.description}
              type={alert.type}
              showIcon
              closable
              onClose={() => setAlert(null)}
            />
          </div>
        )}
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sign in to <span className="text-teal-200">Roamly</span> Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" /> Google
              </Button>
              <Button variant="outline">
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="link"
              className="w-full text-sm text-slate-500 dark:text-slate-400"
            >
              Forgot password?
            </Button>
            <Button
              variant="link"
              className="w-full text-sm text-slate-500 dark:text-slate-400"
              onClick={() => router.push("/sign-up")}
            >
              Don't have an account? Sign up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Login;
