import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    {
                        // Primary: High contrast with subtle hover lift and shadow
                        "bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md":
                            variant === "primary",
                        // Secondary: Muted background, border for definition
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50":
                            variant === "secondary",
                        // Ghost: Minimal, hover effect only
                        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",

                        "h-9 px-4 text-sm": size === "sm",
                        "h-10 px-6 text-sm": size === "md",
                        "h-12 px-8 text-base": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";
