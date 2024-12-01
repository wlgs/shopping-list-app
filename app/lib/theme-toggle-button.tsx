"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

declare global {
    interface Document {
        startViewTransition(callback: () => void): void;
    }
}

function flipTheme(theme: string | undefined, systemTheme: string | undefined) {
    if (theme === "system") return systemTheme === "dark" ? "light" : "dark";
    if (theme === "dark") return "light";
    return "dark";
}

interface ThemeToggleButtonProps {
    size?: number;
}

export function ThemeToggleButton({ size = 24 }: ThemeToggleButtonProps) {
    const { setTheme: nextSetTheme, theme: currentTheme, systemTheme } = useTheme();

    function setTheme(theme: string) {
        if (theme === currentTheme) return;
        if (!document.startViewTransition) {
            nextSetTheme(theme);
            return;
        }
        document.startViewTransition(() => {
            nextSetTheme(theme);
        });
    }

    return (
        <Button
            variant="link"
            className="group relative flex h-fit items-center justify-center px-0 py-0 no-underline"
            onClick={() => setTheme(flipTheme(currentTheme, systemTheme))}
        >
            <Sun size={size} className="rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            <Moon size={size} className="absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
