import React, { useState, useEffect, useCallback } from "react"
import { FaReply } from "react-icons/fa"

const CUSDIS_API_HOST = "https://cusdis.com"

interface CommentFormProps {
  appId: string
  pageId: string
  parentId?: string | null
  replyToName?: string | null
  onSubmitted?: () => void
  onCancel?: () => void
}

interface CommentData {
  id: string
  content: string
  parsedContent?: string
  nickname?: string
  by_nickname?: string
  createdAt: string
  replies?: CommentData[]
  [key: string]: any
}

interface CommentItemProps {
  comment: CommentData
  appId: string
  pageId: string
  refresh: () => void
}

interface CommentsProps {
  appId: string
  pageId: string
}

const CommentForm: React.FC<CommentFormProps> = ({
  appId,
  pageId,
  parentId = null,
  replyToName = null,
  onSubmitted,
  onCancel,
}) => {
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const payload = {
      appId,
      pageId,
      parentId: parentId,
      content,
      nickname: nickname,
      email: email,
    }

    console.log("Posting comment with payload:", payload)

    try {
      const res = await fetch(`${CUSDIS_API_HOST}/api/open/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to post comment")
      }

      setContent("")
      setNickname("")
      setEmail("")
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
      if (onSubmitted) onSubmitted()
    } catch (err) {
      console.error(err)
      setError("Failed to post comment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      {replyToName && (
        <div
          style={{
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            color: "var(--color-text-light)",
          }}
        >
          <FaReply style={{ marginRight: "0.25rem" }} />
          Replying to <strong>{replyToName}</strong>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          required
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid var(--color-accent)",
            background: "var(--color-card-bg)",
            color: "var(--color-text)",
            fontFamily: "inherit",
          }}
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid var(--color-accent)",
            background: "var(--color-card-bg)",
            color: "var(--color-text)",
            fontFamily: "inherit",
          }}
        />
      </div>
      <textarea
        placeholder="Write a comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "0.5rem",
          borderRadius: "4px",
          border: "1px solid var(--color-accent)",
          background: "var(--color-card-bg)",
          color: "var(--color-text)",
          marginBottom: "0.5rem",
          fontFamily: "inherit",
          resize: "vertical",
        }}
      />
      {success && (
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            borderRadius: "4px",
            marginBottom: "0.5rem",
            fontSize: "0.9rem",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          Comment submitted! It is pending validation.
        </div>
      )}
      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            background: "var(--color-text)",
            color: "var(--color-card-bg)",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontWeight: "bold",
          }}
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              color: "var(--color-text)",
              border: "1px solid var(--color-text)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  appId,
  pageId,
  refresh,
}) => {
  const [replying, setReplying] = useState(false)
  const displayContent = comment.parsedContent || comment.content
  const displayName = comment.by_nickname || comment.nickname || "Anonymous"
  const displayDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : ""

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          borderLeft: "2px solid var(--color-accent)",
          paddingLeft: "1rem",
          paddingBottom: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <strong style={{ fontSize: "0.95rem" }}>{displayName}</strong>
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            {displayDate}
          </span>
        </div>
        <div
          style={{ marginBottom: "0.5rem", lineHeight: "1.5" }}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
        <button
          onClick={() => setReplying(!replying)}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-text-light)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.85rem",
            padding: 0,
            transition: "color 0.2s",
          }}
        >
          <FaReply /> Reply
        </button>

        {replying && (
          <CommentForm
            appId={appId}
            pageId={pageId}
            parentId={comment.id}
            replyToName={displayName}
            onSubmitted={() => {
              setReplying(false)
              refresh()
            }}
            onCancel={() => setReplying(false)}
          />
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
          {comment.replies
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                appId={appId}
                pageId={pageId}
                refresh={refresh}
              />
            ))}
        </div>
      )}
    </div>
  )
}

const Comments: React.FC<CommentsProps> = ({ appId, pageId }) => {
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = useCallback(async () => {
    try {
      console.log("Fetching comments for page:", pageId)
      const res = await fetch(
        `${CUSDIS_API_HOST}/api/open/comments?appId=${encodeURIComponent(
          appId
        )}&pageId=${encodeURIComponent(pageId)}&limit=100`,
        { cache: "no-store" }
      )

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const json = await res.json()
      console.log("Cusdis API Response:", json)

      // Navigate to the array of comments
      // Based on provided JSON: json.data.data is the array
      let rawComments: any[] = []
      if (Array.isArray(json)) {
        rawComments = json
      } else if (json.data && Array.isArray(json.data)) {
        rawComments = json.data
      } else if (json.data && json.data.data && Array.isArray(json.data.data)) {
        rawComments = json.data.data
      }

      console.log("Extracted Comments List:", rawComments)

      if (rawComments.length === 0) {
        setComments([])
        return
      }

      // Transform the API response into our tree structure
      // The API returns nested replies in c.replies.data
      const processComment = (c: any): CommentData => {
        const { replies, ...rest } = c
        const processed: CommentData = { ...rest, replies: [] }

        if (replies && replies.data && Array.isArray(replies.data)) {
          processed.replies = replies.data
            .map(processComment)
            .sort(
              (a: CommentData, b: CommentData) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ) // Sort replies oldest first
        }

        return processed
      }

      const roots = rawComments.map(processComment)

      console.log("Final Tree Roots:", roots)

      // Sort root comments by date descending (newest first)
      roots.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return dateB - dateA
      })

      setComments(roots)
    } catch (e) {
      console.error("Error in fetchComments:", e)
    } finally {
      setLoading(false)
    }
  }, [appId, pageId])

  useEffect(() => {
    if (appId && pageId) fetchComments()
  }, [appId, pageId, fetchComments])

  if (!appId)
    return (
      <div
        style={{
          padding: "1rem",
          border: "1px dashed var(--color-accent)",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0 }}>
          Please configure your Cusdis App ID in{" "}
          <code>src/templates/blog-post.js</code>
        </p>
      </div>
    )

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1.5rem", marginTop: "0" }}>
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </h4>
        {loading ? (
          <p style={{ opacity: 0.7 }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p style={{ opacity: 0.7, fontStyle: "italic" }}>
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              appId={appId}
              pageId={pageId}
              refresh={fetchComments}
            />
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "2rem",
          paddingTop: "2rem",
          borderTop: "1px solid var(--color-accent)",
        }}
      >
        <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Leave a comment</h4>
        <CommentForm
          appId={appId}
          pageId={pageId}
          onSubmitted={fetchComments}
        />
      </div>
    </div>
  )
}

export default Comments
