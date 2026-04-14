import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const readFile = useCallback((file) => {
    setError("");
    if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown")) {
      setError("Please provide a Markdown file (.md or .markdown)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target.result);
      setFileName(file.name);
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const handleReset = () => {
    setMarkdown("");
    setFileName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-7 h-7 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <h1 className="text-lg font-semibold tracking-tight">
              MD Viewer
            </h1>
            {fileName && (
              <span className="text-sm text-gray-400 bg-gray-800 px-2.5 py-0.5 rounded-full">
                {fileName}
              </span>
            )}
          </div>
          {markdown && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-800"
            >
              Open another file
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {!markdown ? (
          /* Drop zone / file picker */
          <div
            role="region"
            aria-label="File drop zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative flex flex-col items-center justify-center gap-6
              rounded-2xl border-2 border-dashed p-16
              transition-all duration-200 ease-out
              ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
                  : "border-gray-700 hover:border-gray-500 bg-gray-900/50"
              }
            `}
          >
            <div
              className={`
              rounded-full p-5 transition-colors
              ${isDragging ? "bg-blue-500/20" : "bg-gray-800"}
            `}
            >
              <svg
                className={`w-10 h-10 transition-colors ${isDragging ? "text-blue-400" : "text-gray-500"}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-gray-300">
                Drag & drop your Markdown file here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click the button below to browse
              </p>
            </div>

            <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Choose File
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-600">
              Supports .md and .markdown files
            </p>

            {error && (
              <div className="absolute bottom-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        ) : (
          /* Markdown preview */
          <article className="prose prose-invert max-w-none bg-gray-900/50 rounded-2xl border border-gray-800 p-8 md:p-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        )}
      </main>
    </div>
  );
}

export default App;
