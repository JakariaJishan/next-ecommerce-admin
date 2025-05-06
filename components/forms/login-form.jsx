"use client"
import { cn } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginForm({ className, email, password, setEmail, setPassword, onSubmit, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email below to login to your account

              <div className="border-2">
                email: jakaria@gmail.com
                password: 111111
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
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
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10" // Add padding to ensure space for the icon
                    />
                    <button
                        type="button"
                        aria-label={showPassword ? "Password Visible" : "Password Invisible"}
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-[#009EF7]"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Button type="submit" className="w-full bg-[#2F93F6]">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
  );
}
