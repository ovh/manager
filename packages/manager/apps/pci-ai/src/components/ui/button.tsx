import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary-700",
        destructive:
          "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-sm border text-primary border-primary border-2 bg-white font-semibold focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-primary-100 hover:bg-primary-100",
        secondary:
          "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground",
        //ghost: "rounded-sm text-primary bg-white font-semibold hover:bg-primary-100 hover:text-primary hover:border-2 hover:border-primary focus-visible:border-2 focus-visible:border-primary",
        transparent: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        //link: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary hover:underline",
        link: "rounded-sm text-primary hover:underline focus-visible:underline focus-visible:text-primary-700",
        combobox: "focus-visible:border-b-primary border-primary-100 border hover:bg-primary-100 hover:text-primary-700 hover:border-b-primary",
        linkBis: "rounded-sm font-semibold text-primary hover:bg-primary-100 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2",
        lg: "h-11 rounded-sm px-8",
        icon: "h-8 w-8",
        combobox: "h-8 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
