
type InputFieldProps = {
  variant: "text" | "textarea" | "submit";
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

export default function InputField({ variant, value, onChange, placeholder }: InputFieldProps) {
  if (variant === "text") {
    return (
      <input 
      type="text" 
      className="w-full border border-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
      value={value} 
      onChange={e => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      />
    );
  } else if (variant === "textarea") {
    return (
      <textarea 
      className="w-full border border-gray-500 rounded px-3 py-2 h-40 resize-none overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500" 
      value={value} 
      onChange={e => onChange && onChange(e.target.value)} 
      placeholder={placeholder}
      />
    );
  } else if (variant === "submit") {
    return (
      <input 
      type="submit" 
      className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded" 
      value={value} 
      />
    );
  }
}