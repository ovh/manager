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
          "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border text-primary border-primary border-2 bg-white font-semibold hover:bg-primary-100",
        secondary:
          "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground",
        transparent: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        link: "rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary underline-offset-4",
        combobox: "focus-visible:border-b-primary border-primary-100 border hover:bg-primary-100 hover:text-primary-700 hover:border-b-primary"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-2",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
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
