"use client";

import { motion } from "framer-motion";
import { Message } from "@/types";
import { format } from "date-fns";
import { Copy, RefreshCw, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "react-hot-toast";

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: (messageId: string) => void;
  isLast?: boolean;
}

export default function MessageBubble({ message, onRegenerate, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} message-enter`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold logo-glow"
            style={{
              background: "linear-gradient(135deg, #9097C0 0%, #A7BBEC 100%)",
              boxShadow: "0 0 12px rgba(167,187,236,0.25)",
            }}
          >
            S
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={`group max-w-[75%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm"
              : "rounded-tl-sm"
          }`}
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, rgba(167,187,236,0.25) 0%, rgba(144,151,192,0.2) 100%)",
                  border: "1px solid rgba(167,187,236,0.25)",
                  color: "#e8e8e8",
                }
              : {
                  background: "linear-gradient(135deg, rgba(80,59,49,0.4) 0%, rgba(112,93,86,0.25) 100%)",
                  border: "1px solid rgba(112,93,86,0.3)",
                  color: "#e2e2e2",
                }
          }
        >
          {message.isStreaming ? (
            <div className="flex items-center gap-1">
              <span className="prose-chat">{message.content}</span>
              <span
                className="inline-block w-0.5 h-4 ml-0.5 animate-pulse"
                style={{ background: "#A7BBEC" }}
              />
            </div>
          ) : (
            <div className="prose-chat">
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const isBlock = className?.includes("language-");
                      return isBlock ? (
                        <pre className="relative">
                          <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded" style={{ color: "#705D56", background: "rgba(112,93,86,0.3)" }}>
                            {match?.[1] ?? "code"}
                          </div>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {/* Timestamp & Actions */}
        {!message.isStreaming && (
          <div className={`flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <span className="text-[10px]" style={{ color: "#705D56" }}>
              {format(new Date(message.timestamp), "h:mm a")}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
              style={{ color: "#705D56" }}
              title="Copy"
            >
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            </button>
            {!isUser && isLast && onRegenerate && (
              <button
                onClick={() => onRegenerate(message.id)}
                className="p-1 rounded-md hover:bg-white/10 transition-colors"
                style={{ color: "#705D56" }}
                title="Regenerate"
              >
                <RefreshCw size={11} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #503B31 0%, #705D56 100%)",
              border: "1px solid rgba(167,187,236,0.15)",
            }}
          >
            U
          </div>
        </div>
      )}
    </motion.div>
  );
}
