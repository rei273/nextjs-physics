import { verifyAuth } from "@/app/lib/session";
import Breadcrumbs from "@/app/ui/tutorials/breadcrumbs";
import { fetchDiscussions, fetchDisussionReplies } from "@/app/lib/data";
import { unstable_noStore as noStore } from "next/cache";
import DiscussionReplyClient from "@/app/ui/chat/discussion-reply-client";

export default async function Page() {
  noStore();

  const result = await verifyAuth();
  const userId = result.user;

  const [discussions, replies] = await Promise.all([
    fetchDiscussions(),
    fetchDisussionReplies(),
  ]);

  return (
    <main className="max-w-7xl">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Discussion", href: "/chat", active: true },
        ]}
      />
      <div className="lg:p-6 space-y-6">
        <h2 className="text-lg font-bold mb-8">Comments</h2>
        <div className="flex flex-col space-y-4">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="bg-gray-200 lg:p-4 rounded-lg shadow-md"
            >
              {/* Main discussion */}
              <h3 className="text-md font-bold">{discussion.username}</h3>
              <p className="text-gray-700 text-sm mb-2">
                {new Date(discussion.date).toLocaleDateString()}
              </p>
              <p className="text-gray-900 font-bold">{discussion.subject}</p>
              <p className="text-gray-700">{discussion.content}</p>
              {/* Replies container */}
              <div className="ml-6 mt-4">
                {/* Check if replies exist */}
                {replies && replies.length > 0 ? (
                  replies
                    .filter((reply) => reply.discussion_id === discussion.id)
                    .map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-gray-100 p-3 rounded-md shadow-sm mb-2"
                      >
                        <h4 className="text-sm font-semibold">
                          {reply.username}
                        </h4>
                        <p className="text-gray-600 text-xs mb-1">
                          {new Date(reply.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 text-sm">{reply.content}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-500 text-sm">No replies yet.</p>
                )}
                {/* Reply button */}
                <DiscussionReplyClient
                  isAuthenticated={!!userId}
                  buttonName="Reply"
                  discussionId={discussion.id}
                  subject={discussion.subject}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
