"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/ui/file-upload";

export default function UploadSummarize() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [length, setLength] = useState("medium");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setFile(f);
      // Suggest a title from filename (remove extension and replace separators)
      try {
        const name = f.name || "";
        const base = name.replace(/\.[^/.]+$/, "");
        const suggested = base.replace(/[_\-\.\+]+/g, " ").trim();
        setTitle((prev) => (prev && prev.length > 0 ? prev : suggested));
      } catch (err) {
        // ignore
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL;

      if (file) {
        // Send multipart/form-data with file and title
        const fd = new FormData();
        fd.append("file", file);
        const finalTitle =
          (title && title.trim()) || file.name || "Untitled Book";
        fd.append("title", finalTitle);

        const response = await fetch(`${apiBase}/summarize/file`, {
          method: "POST",
          body: fd,
        });

        const textResp = await response.text();
        let data = {} as any;
        try {
          data = JSON.parse(textResp);
        } catch (err) {
          console.warn("Non-JSON response:", textResp);
        }
        console.log("Response data:", data, response.status, textResp);
        setSummary(data.summary ?? "No summary returned.");
      } else {
        // No file: keep existing text-only flow (may require a text endpoint on backend)
        const response = await fetch(`${apiBase}/summarize/file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text || "Default sample text",
            max_length:
              length === "short" ? 80 : length === "medium" ? 150 : 250,
            min_length: 30,
          }),
        });

        const data = await response.json();
        console.log("Response data:", data);
        setSummary(data.summary ?? "No summary returned.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSummary("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gray-100 py-6 px-10 flex justify-center items-center">
      <div className="w-full max-w-4xl">
        {/* Form Card */}
        <motion.div
          className="bg-white  rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1
              className="text-2xl font-merriweather font-bold text-
             dark:text-indigo-400 mb-6"
            >
              Upload or Paste Book Content
            </h1>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload File (PDF/TXT)
                </label>

                {/* Editable Title input (prefilled from filename) */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Title (editable)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Suggested title from filename"
                    className="w-full rounded-xl border-gray-300 px-4 py-2"
                  />
                </div>

                {/* <div className="w-full max-w-4xl mx-auto border border-dashed bg-white border-neutral-200  rounded-lg">
      <FileUpload onChange={handleFileChange} />
    </div> */}
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 dark:text-gray-300 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-indigo-50 file:text-indigo-700 
                  hover:file:bg-indigo-100"
                />
              </div>

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Or Paste Text
                </label>
                <textarea
                  rows={6}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full rounded-xl border-gray-300 dark:border-gray-600 text-gray-800
                  dark:text-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                  px-6 py-2"
                  placeholder="Paste book excerpt here..."
                />
              </div>

              {/* Summary Length Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="rounded-xl border-gray-300 bg-indigo-400 py-2 px-2"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-400 
                text-white font-semibold py-3 rounded-xl shadow-md 
                transition duration-300 disabled:opacity-50"
              >
                {loading ? "Summarizing..." : "Summarize"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Summary Output */}
        {summary && (
          <motion.div
            className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-xl font-merriweather font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              AI Summary
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
