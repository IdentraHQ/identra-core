import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  context?: {
    activeApp?: string;
    selectedText?: string;
  };
}

interface SetupState {
  setup_complete: boolean;
  models_ready: boolean;
  brain_ready: boolean;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<{
    activeApp?: string;
    selectedText?: string;
  }>({});
  const [setupState, setSetupState] = useState<SetupState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const debugEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Scroll to bottom on new logs
  useEffect(() => {
    if (showDebug) {
      debugEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, showDebug]);

  // Check setup state and brain readiness
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const state: SetupState = await invoke("get_setup_state");
        setSetupState(state);
        setIsReady(state.brain_ready && state.setup_complete);
      } catch (error) {
        console.error("Failed to get setup state:", error);
      }
    };

    checkSetup();
    const interval = setInterval(checkSetup, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch logs periodically when debug panel is open
  useEffect(() => {
    if (!showDebug) return;

    const fetchLogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/debug/logs");
        if (response.ok) {
          const data: LogEntry[] = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval);
  }, [showDebug]);

  // Capture current context
  const captureContext = async () => {
    try {
      const ctx: { active_app?: string; selected_text?: string } = await invoke(
        "get_current_context"
      );
      setContext({
        activeApp: ctx.active_app,
        selectedText: ctx.selected_text,
      });
      return ctx;
    } catch (error) {
      console.error("Failed to capture context:", error);
      return {};
    }
  };

  // Send message and stream response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isReady) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    const userInputValue = input;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Capture current context
      const ctx = await captureContext();

      // Send chat request to Brain service
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userInputValue,
          active_window: ctx.active_app,
          selected_text: ctx.selected_text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const assistantId = (Date.now() + 1).toString();
      let assistantContent = "";

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                assistantContent += data.content;
                setMessages((prev) => {
                  const existing = prev.find((m) => m.id === assistantId);
                  if (existing) {
                    return prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: assistantContent }
                        : m
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        id: assistantId,
                        role: "assistant",
                        content: assistantContent,
                      },
                    ];
                  }
                });
              }
              if (data.done) {
                // Record interaction for memory distillation
                await invoke("record_interaction", {
                  userPrompt: userInputValue,
                  assistantResponse: assistantContent,
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Identra</h1>
        <div className="header-right">
          <div className="status-indicator">
            {setupState && (
              <>
                <span
                  className={`status-dot ${isReady ? "ready" : "loading"}`}
                ></span>
                <span className="status-text">
                  {isReady
                    ? "Ready"
                    : setupState.brain_ready
                      ? "Brain ready, warming up..."
                      : "Starting up..."}
                </span>
              </>
            )}
          </div>
          <button
            className="debug-toggle"
            onClick={() => setShowDebug(!showDebug)}
            title="Toggle debug panel"
          >
            {showDebug ? "×" : "≡"}
          </button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <p>Start a conversation with Identra</p>
              <p className="subtitle">
                Your memories and active context are included automatically
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`message message-${msg.role}`}>
                  <div className="message-content">{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {showDebug && (
          <div className="debug-panel">
            <div className="debug-header">Debug Panel</div>
            <div className="debug-logs">
              {logs.length === 0 ? (
                <div className="debug-empty">No logs yet</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className={`debug-log debug-${log.level.toLowerCase()}`}>
                    <span className="debug-time">{log.timestamp}</span>
                    <span className="debug-level">{log.level}</span>
                    <span className="debug-msg">{log.message}</span>
                  </div>
                ))
              )}
              <div ref={debugEndRef} />
            </div>
          </div>
        )}
      </div>

      <div className="chat-context">
        {context.activeApp && (
          <div className="context-item">
            <span className="context-label">App:</span>
            <span className="context-value">{context.activeApp}</span>
          </div>
        )}
        {context.selectedText && (
          <div className="context-item">
            <span className="context-label">Selected:</span>
            <span className="context-value">{context.selectedText.substring(0, 100)}...</span>
          </div>
        )}
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isReady
              ? "Ask Identra anything..."
              : "Waiting for Brain service to be ready..."
          }
          disabled={isLoading || !isReady}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !isReady || !input.trim()}
          className="chat-submit"
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default App;
