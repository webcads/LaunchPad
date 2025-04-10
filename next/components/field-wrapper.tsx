"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  children: React.ReactNode;
  fieldName: string;
}

export const FieldWrapper = ({ children, fieldName }: FieldWrapperProps) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      if (
        message.origin === process.env.NEXT_PUBLIC_API_URL &&
        message.data.type === "strapiUpdate" &&
        message.data.changedFields.includes(fieldName)
      ) {
        setIsAnimating(true);
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [fieldName, setIsAnimating]);

  return (
    <div
      // Flash animation when the field is changed
      className={cn(
        "duration-500 transition-all ring-2 ring-transparent",
        isAnimating && "ring-yellow-200"
      )}
      onTransitionEnd={() => {
        console.log("onAnimationEnd");
        setIsAnimating(false);
      }}
      data-strapi-field={fieldName}
    >
      {children}
    </div>
  );
};
