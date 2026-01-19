import { MdReply, MdDeleteOutline, MdCancel  } from "react-icons/md";

type ButtonProps = {
  variant: "reply" | "delete" | "cancel";
  onClick?: () => void;
};

export default function IconButton({ variant, onClick}: ButtonProps) {
  if (variant === "reply") {
    return (
      <MdReply onClick={onClick} />
    );
  } else if (variant === "delete") {
    return (
      <MdDeleteOutline onClick={onClick} />
    );
  } else if (variant === "cancel") {
    return (
      <MdCancel onClick={onClick} />
    );
  }
}