import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

type DeleteWarningProps = {
  item_id: Number | undefined,
  item_name: String | undefined,
  item_type: "topic" | "post" | "comment",
};

export default function DeleteWarning({ item_id, item_name, item_type }: DeleteWarningProps) {
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
      <h2>Are you sure you want to delete this {item_type}?</h2>
      <p><strong>{item_name}</strong></p>
      <p>This action cannot be undone.</p>
      <div>
        <Button variant="primary" value="Delete" onClick={deleteItem} />
      </div>
    </div>
  );
}
