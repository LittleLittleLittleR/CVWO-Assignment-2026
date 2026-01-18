import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

type DeleteWarningProps = {
  item_id: Number | undefined,
  item_name: String | undefined,
  item_type: "topic" | "post" | "comment",
  closeDelete: () => void,
};

export default function DeleteWarning({ item_id, item_name, item_type, closeDelete }: DeleteWarningProps) {
  if (!item_id) return null;

  const api_url = import.meta.env.API_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;

  const deleteItem = async () => {
    try {
      await fetch(`${api_url}/${item_type}s/id/${item_id}`, { method: "DELETE" });
      
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

    } catch (error) {
      console.error("An error occurred while deleting the item:", error);
    }
  };

  return (
    <div>
      <div className="absolute top-0 left-0 w-screen h-screen bg-gray-100 opacity-80 z-10 overflow-hidden"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border p-6 rounded-lg z-20 flex flex-col gap-4 items-center">
        <h2>Are you sure you want to delete this {item_type}?</h2>
        <p className="font-bold italic text-lg">{item_name}</p>
        <p className="text-red-600 font-bold">This action cannot be undone.</p>
        <div className="flex gap-4">
          <Button variant="alert" value="Delete" onClick={deleteItem} />
          <Button variant="secondary" value="Cancel" onClick={closeDelete}/>
        </div>
      </div>
    </div>
  );
}
