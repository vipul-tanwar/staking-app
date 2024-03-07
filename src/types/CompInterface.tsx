export interface ButtonProps {
    label: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    isLoading?: boolean
  }