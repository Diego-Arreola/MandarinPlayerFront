import * as React from 'react';
import { Input as ShadcnInput } from '@/infrastructure/components/ui/input'; // Use alias
import { cn } from '@/lib/utils'; // Use alias

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <ShadcnInput
      className={cn('text-center h-12 text-lg my-2', className)} // Use tailwind margin and shadcn variables
      type={type}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export default Input;
