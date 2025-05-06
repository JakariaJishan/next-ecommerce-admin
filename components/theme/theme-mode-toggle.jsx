"use client"
import React, {useEffect, useState} from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeModeToggle() {
  const { theme,setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering until after hydration
  if (!mounted) return null;

  const handleThemeToggle=()=>{
    if(theme==="light"){
      setTheme("dark")
    }else{
      setTheme("light")
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="flex h-5 w-5 p-0 justify-center items-center outline-none hover:bg-transparent " onClick={handleThemeToggle}>
        <Sun size={20} className={`${theme === "light" ? "hidden": "block"}`} />
        <Moon size={20} className={`absolute ${theme === "dark" ? "hidden": "block"}`} />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
