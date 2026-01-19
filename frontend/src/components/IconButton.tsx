import { MdReply, MdDeleteOutline, MdCancel  } from "react-icons/md";

type ButtonProps = {
  variant: "reply" | "delete" | "cancel";
  onClick?: () => void;
};

export default function IconButton({ variant, onClick}: ButtonProps) {
  if (variant === "reply") {
    return (
      <MdReply size={20} onClick={onClick} />
    );
  } else if (variant === "delete") {
    return (
      <MdDeleteOutline size={20} onClick={onClick} />
    );
  } else if (variant === "cancel") {
    return (
      <MdCancel size={20} onClick={onClick} />
    );
  }
}