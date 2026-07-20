import { requireUser } from "@/lib/auth";
import ChatClient from "./ChatClient";

export default async function ChatPage() {
  const user = await requireUser();
  return <ChatClient userName={user.name} />;
}
