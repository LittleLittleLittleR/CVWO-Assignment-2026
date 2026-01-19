import { useLocation, useNavigate } from 'react-router-dom';
import { MdCreate, MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';

type ButtonProps = {
  variant: "primary" | "secondary" | "square" | "back" | "dropdown" | "alert" | "semiAlert";
  value: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({ variant, value, onClick, className }: ButtonProps) {
  if (variant === "primary") {
    return (
      <button className={`cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex flex-row items-center gap-2 ${className}`} onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "secondary") {
    return (
      <button 
      className={`cursor-pointer bg-white hover:bg-blue-500 hover:text-white py-2 px-4 rounded border flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "square") {
    return (
      <button 
      className={`cursor-pointer py-2 px-4 border-b border-black hover:border-black flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "dropdown") {
    return (
      <button 
      className={`w-full bg-white cursor-pointer hover:bg-blue-500 hover:text-white hover:border-t-black py-2 px-4 border-t flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "back") {
    return (
      <button 
      className={`cursor-pointer bg-white hover:bg-gray-300 hover:border-black py-2 px-4 rounded border flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "alert") {
    return (
      <button 
      className={`cursor-pointer bg-white border-2 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  } else if (variant === "semiAlert") {
    return (
      <button 
      className={`cursor-pointer bg-white border hover:bg-red-500 hover:text-white py-2 px-4 rounded flex flex-row items-center gap-2 ${className}`} 
      onClick={onClick}>
        {value}
      </button>
    );
  }
}

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const returnTo = location.state?.returnTo;

    navigate(returnTo ?? "/home", { replace: true });
  };

  return (
    <Button variant="back" value={<><MdArrowBack />Back</>} onClick={handleBack}/>
  );
}

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" value={<>Edit<MdEdit /></>} onClick={onClick}/>
  );
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="semiAlert" value={<>Delete<MdDelete /></>} onClick={onClick}/>
  );
}

export function CreateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="primary" value={<>Create<MdCreate /></>} onClick={onClick}/>
  );
}