import { Link } from "react-router-dom";
import { useAuth } from "../Auth";
import type { TopicResponse } from "../../types/topic";
import type { PostResponse } from "../../types/post";

type ListProps = {
  item_list: Array<TopicResponse> | Array<PostResponse>;
  item_type: 'topic' | 'post' | 'comment';
  curLocation?: string;
};

export default function ListDisplay({ item_list, item_type, curLocation}: ListProps) {
  
  const { user, loading } = useAuth();

  function formatDate(created_at: string) {
    const date = new Date(created_at);
  
    const datePart = date.toLocaleDateString("en-UK");
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  
    return `${datePart} | ${timePart}`;
  }

  if (loading) {
    return null;
  }

  if (item_type === "topic") {
    const topic_list: Array<TopicResponse> = item_list as Array<TopicResponse>;
    return (
        <ul className="list-none p-0">
          {topic_list.map((topic) => (
            <Link to={`/topics/${topic.id}`} state={{ returnTo: curLocation || `/home` }}>
              <li className={`border mt-2 px-3 py-2 rounded-lg ${user?.id === topic.user_id ? `bg-blue-100` : `bg-white`}`}>
                  <div className="flex flex-row justify-between">
                    <h3 className="font-semibold text-lg">{topic.topic_name}</h3>
                    <p>{formatDate(topic.created_at)}</p>
                  </div>
                <p>{topic.topic_description}</p>
              </li>
            </Link>
          ))}
        </ul>
    );
  } else if (item_type === "post") {
    const post_list: Array<PostResponse> = item_list as Array<PostResponse>;
    return (
        <ul className="list-none p-0">
          {post_list.map((post) => (
            <Link to={`/posts/${post.id}`} state={{ returnTo: curLocation || `/topics/${post.topic_id}` }}>
              <li className={`border mt-2 px-3 py-2 rounded-lg ${user?.id === post.user_id ? `bg-blue-100` : `bg-white`}`}>
                  <div className="flex flex-row justify-between">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <p>{formatDate(post.created_at)}</p>
                  </div>
              </li>
            </Link>
          ))}
        </ul>
    );
  } else if (item_type === "comment") {
    // Comments are not displayed in a list format currently
    return null;
  }
}
