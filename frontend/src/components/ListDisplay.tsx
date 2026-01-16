import { Link } from "react-router-dom";
import { useAuth } from "../Auth";
import type { TopicResponse } from "../../types/topic";
import type { PostResponse } from "../../types/post";

type ListProps = {
  item_list: Array<TopicResponse> | Array<PostResponse>;
  item_type: 'topic' | 'post';
};

export default function ListDisplay({ item_list, item_type}: ListProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (item_type === "topic") {
    const topic_list: Array<TopicResponse> = item_list as Array<TopicResponse>;
    return (
        <ul className="list-none p-0">
          {topic_list.map((topic) => (
              <li className={`p-0 border mb-2 p-2 rounded-lg ${user?.id === topic.user_id ? `bg-blue-100` : `bg-white`}`}>
                <Link to={`/topics/${topic.id}`} state={{ returnTo: `/home` }}>
                  <h3 className="font-semibold text-lg">{topic.topic_name}</h3>
                  <p>{topic.topic_description}</p>
                  <p>{topic.created_at}</p>
                </Link>
              </li>
          ))}
        </ul>
    );
  } else {
    const post_list: Array<PostResponse> = item_list as Array<PostResponse>;
    return (
        <ul className="list-none p-0">
          {post_list.map((post) => (
              <li className={`p-0 border mb-2 p-2 rounded-lg ${user?.id === post.user_id ? `bg-blue-100` : `bg-white`}`}>
                <Link to={`/posts/${post.id}`} state={{ returnTo: `/topics/${post.topic_id}` }}>
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p>{post.created_at}</p>
                </Link>
              </li>
          ))}
        </ul>
    );
  }
}
