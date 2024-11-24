import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
		VariantProps<typeof labelVariants> & { required?: boolean }
>(({ className, ...props }, ref) => (
	<div className="flex items-center gap-2">
		<LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
		{props.required && <span className="text-red-500">*</span>}
	</div>
));
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
