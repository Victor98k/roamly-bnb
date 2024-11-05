"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Facebook, Mail } from "lucide-react";
import { Alert } from "antd";

export function Signup() {
  const [firstName, setFirstName] = useState("''");
  const [lastName, setLastName] = useState("''");
  const [email, setEmail] = useState("''");
  const [password, setPassword] = useState("''");
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);
  const [alert, setAlert] = useState<{
    type: string;
    message: string;
    description: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          isAdmin: isAdmin ?? false,
        }),
      });

      if (!response.ok) {
        setAlert({
          type: "error",
          message: "Sign-up failed",
          description: "Please check your details and try again",
        });
        return;
      }
      setAlert({
        type: "success",
        message: "Sign-up successful",
        description: "You have successfully signed up",
      });

      const data = await response.json();
      router.push("/home");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center from-gray-900 to-black-600">
        <Card className="w-full max-w-md">
          {/* Render alert if it exists */}
          {alert && (
            <Alert
              message={alert.message}
              description={alert.description}
              type={alert.type as "success" | "error" | "info" | "warning"}
              showIcon
              closable
              onClose={() => setAlert(null)}
            />
          )}
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Your <span className="text-teal-200">Roamly</span> Account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details to sign up for an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="userType">I am a...</Label>
                <Select
                  onValueChange={(value) => setIsAdmin(value === "true")}
                  required
                >
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Admin</SelectItem>
                    <SelectItem value="false">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  Or sign up with
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
          <CardFooter>
            <Button
              variant="link"
              className="w-full text-sm text-slate-500 dark:text-slate-400"
              onClick={() => router.push("/login")}
            >
              Already have an account? Log in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Signup;
