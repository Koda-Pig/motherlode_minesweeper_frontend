import * as React from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value?: number;
  onValueChange: (value: number) => void;
  className?: string;
  id: string;
}

const CurrencyInput = React.forwardRef<HTMLDivElement, CurrencyInputProps>(
  ({ value, onValueChange, className, id, ...props }, ref) => {
    const displayValue = value ?? 0;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          className
        )}
        {...props}
      >
        {/* Invisible measurement element - establishes width for centering */}
        <span
          className="invisible absolute left-1/2 -translate-x-1/2 text-center text-sm whitespace-nowrap pointer-events-none"
          aria-hidden="true"
        >
          {displayValue} SOL
        </span>

        {/* Input - transparent, full width, text centered */}
        <Input
          type="number"
          value={value}
          onChange={(e) =>
            onValueChange(Number.parseFloat(e.target.value) || 0)
          }
          className="caret-transparent border-0 w-full text-center bg-transparent text-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          id={id}
          min="0"
          step="0.01"
        />

        <span className="absolute left-1/2 -translate-x-1/2 text-sm text-foreground pointer-events-none whitespace-nowrap">
          {displayValue} SOL
        </span>
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
