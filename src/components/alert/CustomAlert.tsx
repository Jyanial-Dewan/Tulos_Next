import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";

interface AlertProps {
  disabled: boolean;
  tooltipTitle?: string;
  children?: React.ReactNode;
  actionName: string;
  onContinue: () => void;
  onClick?: () => void;
  tooltipAdjustmentStyle?: string | undefined;
  iconColor?: string;
  customButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?(open: boolean): void;
  onCancel?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Alert = ({
  disabled,
  children,
  actionName,
  onContinue,
  onClick,
  customButton,
  open,
  onOpenChange,
  onCancel,
}: AlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {customButton ? (
          customButton
        ) : (
          <Button
            onClick={onClick}
            disabled={disabled}
            className={`${disabled ? "cursor-not-allowed" : "cursor-pointer"} flex gap-1 flex-1 items-center justify-center`}
          >
            <Trash />
            <p className="hidden md:block">Delete</p>
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="pb-2 border-b">
            Are you sure you want to {actionName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="max-h-[50vh] overflow-auto mt-2 text-gray-700 scrollbar-thin">
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <span className="flex justify-end gap-6 w-full">
            <AlertDialogCancel className="flex-1" onClick={onCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="flex-1" onClick={onContinue}>
              Continue
            </AlertDialogAction>
          </span>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
