/* global BigInt */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  Settings,
  RefreshCw,
  FileText,
  Zap,
  Maximize2,
  Minimize2,
  Braces,
  Brackets,
  FileSpreadsheet,
  FileCode,
  Code,
  X,
  Menu,
  Palette,
  Type,
  Expand,
} from "lucide-react";

const JSONTool = ({
  isDarkMode = true,
  showNotification: externalShowNotification,
}) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [treeView, setTreeView] = useState({});
  const [isTreeMode, setIsTreeMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [stats, setStats] = useState({ size: 0, lines: 0, keys: 0, depth: 0 });
  const [indentSize, setIndentSize] = useState(2);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [bigNumbers, setBigNumbers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [highlightSyntax, setHighlightSyntax] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);
  const outputRef = useRef(null);

  const showNotification = useCallback(
    (message, type = "success") => {
      if (externalShowNotification) {
        externalShowNotification(message, type);
      } else {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
      }
    },
    [externalShowNotification]
  );

  const parseJSON = useCallback(
    (jsonString) => {
      return JSON.parse(jsonString, (key, value) => {
        if (bigNumbers) {
          if (typeof value === "string" && value.endsWith("n")) {
            return BigInt(value.slice(0, -1));
          } else if (
            typeof value === "number" &&
            !Number.isSafeInteger(value)
          ) {
            return BigInt(value);
          }
        }
        return value;
      });
    },
    [bigNumbers]
  );
  const sortObjectKeys = useCallback((obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === "object") {
      const sorted = {};
      Object.keys(obj)
        .sort()
        .forEach((key) => {
          sorted[key] = sortObjectKeys(obj[key]);
        });
      return sorted;
    }
    return obj;
  }, []); // no dependencies needed

  const stringifyJSON = useCallback(
    (parsed, indent = indentSize) => {
      let replacer = (key, value) =>
        typeof value === "bigint" ? `${value}n` : value;
      let formatted = JSON.stringify(parsed, replacer, indent);
      if (sortKeys) {
        const sorted = sortObjectKeys(parsed);
        formatted = JSON.stringify(sorted, replacer, indent);
      }
      if (escapeUnicode) {
        formatted = formatted.replace(/[\u0080-\uFFFF]/g, (match) => {
          return "\\u" + ("0000" + match.charCodeAt(0).toString(16)).substr(-4);
        });
      }
      return formatted;
    },
    [indentSize, sortKeys, escapeUnicode, sortObjectKeys]
  );

  const getDepth = useCallback((obj, current = 0) => {
    if (typeof obj !== "object" || obj === null) return current;

    const depths = Object.values(obj).map((val) => getDepth(val, current + 1));
    return Math.max(current, ...depths);
  }, []);

  const minifyJSON = (jsonString) => {
    const parsed = parseJSON(jsonString);
    return JSON.stringify(parsed, (key, value) =>
      typeof value === "bigint" ? `${value}n` : value
    );
  };

  const countKeys = useCallback((obj) => {
    let count = 0;
    if (typeof obj === "object" && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item) => (count += countKeys(item)));
      } else {
        count += Object.keys(obj).length;
        Object.values(obj).forEach((value) => (count += countKeys(value)));
      }
    }
    return count;
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (autoUpdate && value.trim()) {
      if (validateJSON(value)) {
        try {
          const parsed = parseJSON(value);
          const formatted = stringifyJSON(parsed);
          setOutput(formatted);
          setError("");
        } catch (err) {
          setOutput("");
        }
      } else {
        setOutput("");
      }
    }
  };

  const handleFormat = () => {
    setIsTreeMode(false);
    if (!validateJSON(input)) {
      setError("Invalid JSON");
      showNotification("Invalid JSON format", "error");
      return;
    }
    try {
      const parsed = parseJSON(input);
      const formatted = stringifyJSON(parsed);
      setOutput(formatted);
      setError("");
      showNotification("JSON formatted successfully!", "success");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      showNotification("Invalid JSON format", "error");
    }
  };

  const handleMinify = () => {
    if (!validateJSON(input)) {
      setError("Invalid JSON");
      showNotification("Invalid JSON format", "error");
      return;
    }
    try {
      const minified = minifyJSON(input);
      setOutput(minified);
      setError("");
      showNotification("JSON minified successfully!", "success");
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      showNotification("Invalid JSON format", "error");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setSearchTerm("");
    setTreeView({});
    showNotification("Cleared successfully!", "info");
  };

  const copyToClipboard = async (text = output) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard!", "success");
    } catch (err) {
      showNotification("Failed to copy", "error");
    }
  };

  const expanAllFields = async (text = output) => {
    try {
    } catch (err) {}
  };

  const downloadJSON = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification("File downloaded!", "success");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target.result);
      showNotification("File uploaded successfully!", "success");
    };
    reader.readAsText(file);
  };

  const convertToXML = () => {
    if (!validateJSON(input)) {
      setError("Invalid JSON");
      showNotification("Invalid JSON format", "error");
      return;
    }
    try {
      const parsed = parseJSON(input);
      const xml = jsonToXML(parsed);
      setOutput(xml);
      showNotification("Converted to XML!", "success");
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification("Conversion failed", "error");
    }
  };

  const jsonToXML = (obj, rootName = "root") => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>`;
    const escapeXML = (str) =>
      str.replace(/[<>&'"]/g, (char) => {
        switch (char) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          case "'":
            return "&apos;";
          case '"':
            return "&quot;";
          default:
            return char;
        }
      });
    const convertValue = (value, key) => {
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_");
      if (Array.isArray(value)) {
        return value
          .map((item, index) => {
            const itemKey = `${safeKey}Item`;
            if (typeof item === "object" && item !== null) {
              return `<${itemKey}>${convertObject(item)}</${itemKey}>`;
            } else {
              return `<${itemKey}>${escapeXML(String(item))}</${itemKey}>`;
            }
          })
          .join("");
      } else if (typeof value === "object" && value !== null) {
        return `<${safeKey}>${convertObject(value)}</${safeKey}>`;
      } else {
        return `<${safeKey}>${escapeXML(String(value))}</${safeKey}>`;
      }
    };
    const convertObject = (obj) => {
      return Object.entries(obj)
        .map(([key, value]) => convertValue(value, key))
        .join("");
    };
    xml += convertObject(obj);
    xml += `</${rootName}>`;
    return xml;
  };

  const convertToCSV = () => {
    if (!validateJSON(input)) {
      setError("Invalid JSON");
      showNotification("Invalid JSON format", "error");
      return;
    }
    try {
      const parsed = parseJSON(input);
      const csv = jsonToCSV(parsed);
      setOutput(csv);
      showNotification("Converted to CSV!", "success");
    } catch (err) {
      setError(`Conversion failed: ${err.message}`);
      showNotification("Conversion failed", "error");
    }
  };

  const jsonToCSV = (json) => {
    let data = Array.isArray(json) ? json : [json];
    const flattenObject = (obj, prefix = "") => {
      let flat = {};
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          Object.assign(flat, flattenObject(value, newKey));
        } else {
          flat[newKey] = value;
        }
      });
      return flat;
    };
    const flattenedData = data.map(flattenObject);
    const headers = [...new Set(flattenedData.flatMap(Object.keys))];
    const csvRows = flattenedData.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          return value == null
            ? ""
            : typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(",")
    );
    return [headers.join(","), ...csvRows].join("\n");
  };

  const toggleTreeNode = (path) => {
    setTreeView((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTreeView = (obj, path = "", depth = 0) => {
    if (typeof obj !== "object" || obj === null) {
      let valueType = typeof obj;
      let value = typeof obj === "string" ? `"${obj}"` : String(obj);
      if (typeof obj === "bigint") {
        value = `${obj}n`;
        valueType = "bigint";
      } else if (obj === null) {
        value = "null";
        valueType = "null";
      } else if (valueType === "boolean") {
        value = obj ? "true" : "false";
      }
      const highlighted =
        searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase())
          ? value.replace(
              new RegExp(`(${searchTerm})`, "gi"),
              "<mark>$1</mark>"
            )
          : value;
      return (
        <span
          className={`tree-value tree-value-${valueType}`}
          title={`Type: ${valueType}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
    const isExpanded = treeView[path] ?? true;
    const isArray = Array.isArray(obj);
    const entries = isArray
      ? obj.map((value, index) => [index.toString(), value])
      : Object.entries(obj);
    const nodeType = isArray ? "array" : "object";
    return (
      <div className="tree-node" style={{ marginLeft: `${depth * 1}rem` }}>
        <div
          className="tree-toggle"
          onClick={() => toggleTreeNode(path)}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={0}
        >
          {isExpanded ? (
            <ChevronDown className="tree-icon" />
          ) : (
            <ChevronRight className="tree-icon" />
          )}
          <span className="tree-type">{nodeType}</span>
          <span className="tree-count">({entries.length})</span>
        </div>
        {isExpanded && (
          <div className="tree-children">
            {entries.map(([key, value], idx) => {
              const keyStr = isArray ? key : `"${key}"`;
              const highlightedKey =
                searchTerm &&
                key.toLowerCase().includes(searchTerm.toLowerCase())
                  ? keyStr.replace(
                      new RegExp(`(${searchTerm})`, "gi"),
                      "<mark>$1</mark>"
                    )
                  : keyStr;
              return (
                <div key={`${path}-${key}`} className="tree-entry">
                  <span
                    className={`tree-key ${isArray ? "tree-key-array" : ""}`}
                    dangerouslySetInnerHTML={{ __html: highlightedKey }}
                    onClick={() => copyToClipboard(key)}
                  />
                  {!isArray && <span className="tree-colon">: </span>}
                  {renderTreeView(value, `${path}.${key}`, depth + 1)}
                  {idx < entries.length - 1 && (
                    <span className="tree-comma">,</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const addLineNumbers = (text) => {
    if (!lineNumbers || !text) return text;
    return text
      .split("\n")
      .map(
        (line, idx) => `${(idx + 1).toString().padStart(4, " ")}</span> ${line}`
      )
      .join("\n");
  };

  const highlightSearch = (text) => {
    if (!searchTerm || !text) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const highlightJSON = (json) => {
    if (!highlightSyntax) return json;
    return json.replace(
      /(".*?")(:)|(\btrue\b|\bfalse\b)|(null)|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([{}[\],])/g,
      (match, p1, p2, p3, p4, p5, p6) => {
        if (p1) return `<span class="json-key">${p1}</span>${p2 || ""}`;
        if (p3) return `<span class="json-boolean">${match}</span>`;
        if (p4) return `<span class="json-null">${match}</span>`;
        if (p5) return `<span class="json-number">${match}</span>`;
        if (p6) return `<span class="json-punct">${match}</span>`;
        return match;
      }
    );
  };

  const handleScroll = (ref, highlight) => {
    if (ref.current && highlight.current) {
      highlight.current.scrollTop = ref.current.scrollTop;
      highlight.current.scrollLeft = ref.current.scrollLeft;
    }
  };

  const validateJSON = useCallback(
    (jsonString) => {
      try {
        if (!jsonString.trim()) return true;
        parseJSON(jsonString);
        return true;
      } catch {
        return false;
      }
    },
    [parseJSON]
  );

  useEffect(() => {
    if (input) {
      const valid = validateJSON(input);
      setIsValid(valid);

      if (valid) {
        setError("");
        try {
          const parsed = parseJSON(input);
          const size = new Blob([input]).size;
          const lines = input.split("\n").length;
          const keys = countKeys(parsed);
          const depth = getDepth(parsed);

          setStats({ size, lines, keys, depth });
        } catch {
          setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
        }
      } else {
        setError("Invalid JSON syntax");
        setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
      }
    } else {
      setError("");
      setIsValid(true);
      setStats({ size: 0, lines: 0, keys: 0, depth: 0 });
    }
  }, [input, bigNumbers, validateJSON, parseJSON, countKeys, getDepth]);

  useEffect(() => {
    if (isTreeMode && output) {
      try {
        //const parsed = parseJSON(output);
        setTreeView({ "": true }); // Reset tree view
      } catch {}
    }
  }, [isTreeMode, output, parseJSON]);

  return (
    <div
      className={`json-tool-container ${isDarkMode ? "dark" : "light"} ${
        isFullscreen ? "fullscreen" : ""
      } ${compactMode ? "compact" : ""}`}
    >
      <style>{`
        .json-tool-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          transition: all 0.3s ease;
          border-radius: 1.25rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }
       
        .json-tool-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          padding: 1rem;
          border-radius: 0;
          margin: 0;
        }
       
        .json-tool-container.dark {
          background: linear-gradient(135deg, #1a1f2e 0%, #0f1419 100%);
          color: #e2e8f0;
        }
       
        .json-tool-container.light {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          color: #1e293b;
        }
        .json-tool-container.compact .header,
        .json-tool-container.compact .stats {
          padding: 0.5rem;
        }
        .notification {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 10000;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          color: white;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideIn 0.3s ease;
          backdrop-filter: blur(10px);
        }
       
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
       
        .notification.success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        .notification.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }
        .notification.info {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          position: relative;
        }
       
        .json-tool-container.dark .header {
          background: rgba(26, 31, 46, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
       
        .json-tool-container.light .header {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.5);
        }
       
        .title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
       
        .subtitle {
          color: #64748b;
          margin: 0.5rem 0 0 0;
          font-size: 0.95rem;
        }
        .header-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
       
        .json-tool-container.dark .stats {
          background: rgba(26, 31, 46, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
       
        .json-tool-container.light .stats {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.5);
        }
       
        .stat-item {
          text-align: center;
          padding: 0.75rem;
          border-radius: 0.75rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
       
        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
       
        .json-tool-container.dark .stat-item {
          background: rgba(15, 20, 25, 0.6);
        }
       
        .json-tool-container.light .stat-item {
          background: rgba(248, 250, 252, 0.8);
        }
       
        .stat-value {
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
       
        .stat-value.blue { color: #3b82f6; }
        .stat-value.green { color: #10b981; }
        .stat-value.purple { color: #8b5cf6; }
        .stat-value.red { color: #ef4444; }
        .stat-value.orange { color: #f59e0b; }
       
        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        .middle-controls {
          padding: 1.5rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 220px;
          max-height: 100vh;
          overflow-y: auto;
        }
       
        .json-tool-container.dark .middle-controls {
          background: rgba(26, 31, 46, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
       
        .json-tool-container.light .middle-controls {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.5);
        }
        .controls-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: stretch;
        }
        .controls-group-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .controls-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.3), transparent);
          margin: 0.5rem 0;
        }
       
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
       
        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
       
        .btn:hover::before {
          left: 100%;
        }
       
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
       
        .btn:active:not(:disabled) {
          transform: translateY(0);
        }
       
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
       
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
       
        .btn-secondary {
          background: linear-gradient(135deg, #64748b, #475569);
          color: white;
          box-shadow: 0 4px 15px rgba(100, 116, 139, 0.3);
        }
       
        .btn-danger {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }
       
        .btn-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
       
        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }
       
        .btn-toggle {
          border: 2px solid #64748b;
          background: rgba(100, 116, 139, 0.1);
          backdrop-filter: blur(10px);
        }
       
        .json-tool-container.dark .btn-toggle {
          color: #e2e8f0;
        }
       
        .json-tool-container.light .btn-toggle {
          color: #1e293b;
        }
       
        .btn-toggle:hover:not(:disabled) {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
       
        .btn-toggle.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #2563eb;
          color: white;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
       
        .btn-toggle.active.green {
          background: linear-gradient(135deg, #10b981, #059669);
          border-color: #059669;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .btn-icon {
          padding: 0.5rem;
          min-width: auto;
        }
        .file-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        .select, .input {
          padding: 0.5rem;
          border-radius: 0.5rem;
          border: 1px solid #64748b;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }
       
        .json-tool-container.dark .select,
        .json-tool-container.dark .input {
          background: rgba(15, 20, 25, 0.8);
          color: #e2e8f0;
          border-color: #2f3340;
        }
       
        .json-tool-container.light .select,
        .json-tool-container.light .input {
          background: rgba(255, 255, 255, 0.8);
          color: #1e293b;
          border-color: #d1d5db;
        }
       
        .select:focus, .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .main-layout {
          display: grid;
          gap: 1rem;
          flex: 1;
          min-height: 0;
          grid-template-columns: 1fr 1fr;
        }
        .main-layout.show-sidebar:not(.compare-mode) {
          grid-template-columns: 1fr auto 1fr;
        }
        .main-layout.compare-mode:not(.show-sidebar) {
          grid-template-columns: 1fr 1fr 1fr;
        }
        .main-layout.compare-mode.show-sidebar {
          grid-template-columns: 1fr auto 1fr 1fr;
        }
        @media (min-width: 1201px) {
          .main-layout {
            grid-template-rows: 1fr;
          }
        }
        @media (max-width: 1200px) {
          .main-layout {
            grid-template-columns: 1fr !important;
            max-height: none;
            flex-direction: column;
          }
          .middle-controls {
            max-height: none;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .controls-group {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            flex: 1;
            min-width: 200px;
          }
          .btn {
            flex: 1 1 calc(50% - 0.5rem);
            min-width: 120px;
          }
        }
        @media (max-width: 768px) {
          .json-tool-container {
            padding: 0.5rem;
          }
          .header {
            padding: 1rem;
          }
          .title {
            font-size: 1.5rem;
          }
          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .btn {
            flex: 1 1 100%;
          }
        }
        .panel {
          display: flex;
          flex-direction: column;
          border-radius: 1.25rem;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
        }
       
        .panel:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.2);
        }
       
        .json-tool-container.dark .panel {
          background: rgba(26, 31, 46, 0.8);
          border: 1px solid rgba(47, 51, 64, 0.3);
        }
       
        .json-tool-container.light .panel {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.5);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.5rem;
          border-bottom: 1px solid;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.05);
        }
       
        .json-tool-container.dark .panel-header {
          border-color: rgba(47, 51, 64, 0.3);
        }
       
        .json-tool-container.light .panel-header {
          border-color: rgba(226, 232, 240, 0.3);
        }
        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
          backdrop-filter: blur(10px);
        }
       
        .status-badge.valid {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
        }
       
        .status-badge.invalid {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
        }
        .panel-controls {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .panel-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .editor-container {
          position: relative;
          flex: 1;
          overflow: scroll;
          max-height: 600px;
        }
        .highlight-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          pointer-events: none;
          overflow: auto;
          z-index: 0;
        }
        .textarea {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          background: transparent;
          color: transparent;
          caret-color: currentColor;
          overflow: auto;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          line-height: 1.6;
          border: none;
          outline: none;
          resize: none;
        }
        .textarea::placeholder {
          color: #64748b;
          opacity: 0.5;
        }
        .output-area {
          flex: 1;
          padding: 1rem;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          line-height: 1.6;
          overflow: scroll;
          max-height: 600px;
          background: transparent;
        }
       
        .json-tool-container.dark .output-area {
          color: #e2e8f0;
        }
       
        .json-tool-container.light .output-area {
          color: #1e293b;
        }
        .output-area pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #64748b;
          text-align: center;
          padding: 2rem;
        }
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
          animation: pulse 2s ease-in-out infinite;
        }
        .error-message {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border-top: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          font-size: 0.875rem;
          backdrop-filter: blur(10px);
        }
        .tree-node {
          margin: 0.25rem 0;
        }
        .tree-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
          font-family: 'JetBrains Mono', monospace;
        }
       
        .tree-toggle:hover {
          background: rgba(59, 130, 246, 0.1);
        }
        .tree-icon {
          width: 1rem;
          height: 1rem;
          color: #3b82f6;
        }
        .tree-type {
          color: #94a3b8;
          font-weight: 600;
        }
        .tree-count {
          font-size: 0.75rem;
          color: #64748b;
        }
        .tree-children {
          margin-left: 1rem;
          border-left: 2px solid rgba(100, 116, 139, 0.3);
          padding-left: 0.75rem;
        }
        .tree-entry {
          display: flex;
          align-items: flex-start;
          margin: 0.25rem 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .tree-key {
          color: #f97316;
          white-space: nowrap;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .tree-key:hover {
          color: #fb923c;
        }
        .tree-key-array {
          color: #8b5cf6;
        }
        .tree-colon {
          color: #94a3b8;
          margin: 0 0.25rem;
        }
        .tree-comma {
          color: #94a3b8;
          margin-left: 0.25rem;
        }
       
        .tree-value-string {
          color: #10b981;
        }
        .tree-value-number, .tree-value-bigint {
          color: #3b82f6;
        }
        .tree-value-boolean {
          color: #8b5cf6;
        }
        .tree-value-null {
          color: #64748b;
        }
        mark {
          background: rgba(251, 191, 36, 0.3);
          color: inherit;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
       
        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          width: 1rem;
          height: 1rem;
        }
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background-color 0.2s ease;
          font-size: 0.875rem;
        }
       
        .checkbox-group:hover {
          background: rgba(59, 130, 246, 0.1);
        }
       
        .checkbox {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0.375rem;
          border: 2px solid #64748b;
          position: relative;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
       
        .checkbox.checked {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-color: #2563eb;
        }
       
        .checkbox.checked::after {
          content: '✓';
          color: white;
          font-size: 0.875rem;
          font-weight: bold;
        }
        .settings-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          z-index: 9998;
          padding: 1.5rem;
          overflow-y: auto;
          box-shadow: -4px 0 20px rgba(0,0,0,0.2);
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }
        .settings-panel.open {
          transform: translateX(0);
        }
        .json-tool-container.dark .settings-panel {
          background: rgba(26, 31, 46, 0.98);
          border-left: 1px solid rgba(47, 51, 64, 0.5);
        }
        .json-tool-container.light .settings-panel {
          background: rgba(255, 255, 255, 0.98);
          border-left: 1px solid rgba(226, 232, 240, 0.5);
        }
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(100, 116, 139, 0.3);
        }
        .settings-title {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .slider-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .slider-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #64748b;
        }
        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }
        .json-tool-container.dark .slider {
          background: rgba(100, 116, 139, 0.3);
        }
        .json-tool-container.light .slider {
          background: rgba(226, 232, 240, 0.5);
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
        .footer {
          text-align: center;
          margin-top: 2rem;
          padding: 1.5rem;
          color: #64748b;
          font-size: 0.875rem;
          border-top: 1px solid rgba(100, 116, 139, 0.2);
          background: rgba(0, 0, 0, 0.02);
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
        }
        .json-key { color: #f97316; font-weight: 600; }
        .json-number { color: #3b82f6; }
        .json-boolean { color: #8b5cf6; }
        .json-null { color: #64748b; }
        .json-string { color: #10b981; }
        .json-punct { color: #94a3b8; }
        .line-number {
          display: inline-block;
          width: 3em;
          color: #64748b;
          text-align: right;
          margin-right: 1em;
          user-select: none;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
       
        ::-webkit-scrollbar-track {
          background: rgba(100, 116, 139, 0.1);
          border-radius: 4px;
        }
       
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #64748b, #475569);
          border-radius: 4px;
        }
       
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #475569, #334155);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 1200px) {
          .mobile-menu-btn {
            display: flex;
          }
          .middle-controls {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 9997;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .middle-controls.open {
            transform: translateX(0);
          }
        }
        .minimap {
          position: absolute;
          right: 0;
          top: 0;
          width: 100px;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.3;
          z-index: 2;
        }
        .minimap pre {
          transform: scale(0.2);
          transform-origin: top right;
          white-space: pre;
        }
        .diff-added {
          background: rgba(16, 185, 129, 0.2);
        }
        .diff-removed {
          background: rgba(239, 68, 68, 0.2);
        }
        .diff-modified {
          background: rgba(245, 158, 11, 0.2);
        }
      `}</style>
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" && <CheckCircle size={20} />}
          {notification.type === "error" && <AlertCircle size={20} />}
          {notification.type === "info" && <RefreshCw size={20} />}
          <span>{notification.message}</span>
        </div>
      )}
      <div className="header">
        <div>
          <h1 className="title">
            {/* <FileJson size={32} /> */}
            JSON Tool
          </h1>
        </div>
        <div className="header-controls">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="btn btn-toggle mobile-menu-btn"
          >
            <Menu size={16} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-toggle"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`btn btn-toggle ${showSettings ? "active" : ""}`}
          >
            <Settings size={16} />
          </button>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="select"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>
      </div>
      <div className={`main-layout ${showSidebar ? "show-sidebar" : ""}`}>
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Code size={18} />
              <span>Input JSON</span>
              {input && (
                <span
                  className={`status-badge ${isValid ? "valid" : "invalid"}`}
                >
                  {isValid ? (
                    <CheckCircle size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                  {isValid ? "Valid" : "Invalid"}
                </span>
              )}
            </div>
            <div className="panel-controls">
              <label className="btn btn-secondary btn-icon" title="Upload JSON">
                <Upload size={16} />
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </label>
              <button
                onClick={() => copyToClipboard(input)}
                disabled={!input}
                className="btn btn-secondary btn-icon"
                title="Copy Input"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className="btn btn-danger btn-icon"
                title="Clear Input"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="panel-content">
            <div
              className="editor-container"
              style={{ fontSize: `${fontSize}px` }}
            >
              <pre
                ref={highlightRef}
                className="highlight-overlay"
                dangerouslySetInnerHTML={{
                  __html: highlightJSON(highlightSearch(addLineNumbers(input))),
                }}
              />
              <textarea
                ref={textareaRef}
                className="textarea"
                value={input}
                onChange={handleInputChange}
                onScroll={() => handleScroll(textareaRef, highlightRef)}
                placeholder=""
                style={{
                  color: "transparent",
                  background: "transparent",
                  caretColor: isDarkMode ? "#e2e8f0" : "#1e293b",
                  wordWrap: wordWrap ? "break-word" : "normal",
                  whiteSpace: wordWrap ? "pre-wrap" : "pre",
                }}
              />
              {showMinimap && (
                <div className="minimap">
                  <pre>
                    {highlightJSON(highlightSearch(addLineNumbers(input)))}
                  </pre>
                </div>
              )}
            </div>
            {error && (
              <div className="error-message">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
        {showSidebar && (
          <div className={`middle-controls ${showSidebar ? "open" : ""}`}>
            <div className="controls-group">
              <div className="controls-group-title">
                <Zap size={14} />
                Quick Actions
              </div>
              <button
                onClick={handleFormat}
                disabled={!input || !isValid}
                className="btn btn-primary"
              >
                <Braces size={16} />
                Format
              </button>
              <button
                onClick={handleMinify}
                disabled={!input || !isValid}
                className="btn btn-secondary"
              >
                <Brackets size={16} />
                Minify
              </button>
              <button
                onClick={() => {
                  setIsTreeMode(!isTreeMode);
                  if (!isTreeMode && input) handleFormat();
                }}
                className={`btn btn-toggle ${isTreeMode ? "active green" : ""}`}
              >
                <FileText size={16} />
                Tree View
              </button>
              <button onClick={handleClear} className="btn btn-danger">
                <Trash2 size={16} />
                Clear All
              </button>
            </div>
            <div className="controls-group">
              <div className="controls-group-title">
                <FileCode size={14} />
                Convert
              </div>
              <button
                onClick={convertToXML}
                disabled={!input || !isValid}
                className="btn btn-success"
              >
                <FileCode size={16} />
                To XML
              </button>
              <button
                onClick={convertToCSV}
                disabled={!input || !isValid}
                className="btn btn-success"
              >
                <FileSpreadsheet size={16} />
                To CSV
              </button>
            </div>
            <div className="controls-group">
              <div className="controls-group-title">
                <Settings size={14} />
                Toggles
              </div>
              <label className="checkbox-group">
                <div
                  className={`checkbox ${autoUpdate ? "checked" : ""}`}
                  onClick={() => setAutoUpdate(!autoUpdate)}
                />
                Auto Update
              </label>
              <label className="checkbox-group">
                <div
                  className={`checkbox ${bigNumbers ? "checked" : ""}`}
                  onClick={() => setBigNumbers(!bigNumbers)}
                />
                Big Numbers
              </label>
              <label className="checkbox-group">
                <div
                  className={`checkbox ${sortKeys ? "checked" : ""}`}
                  onClick={() => setSortKeys(!sortKeys)}
                />
                Sort Keys
              </label>
              <label className="checkbox-group">
                <div
                  className={`checkbox ${escapeUnicode ? "checked" : ""}`}
                  onClick={() => setEscapeUnicode(!escapeUnicode)}
                />
                Escape Unicode
              </label>
              <label className="checkbox-group">
                <div
                  className={`checkbox ${compactMode ? "checked" : ""}`}
                  onClick={() => setCompactMode(!compactMode)}
                />
                Compact Mode
              </label>
            </div>
          </div>
        )}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <FileText size={18} />
              <span>Output {isTreeMode ? "(Tree View)" : ""}</span>
            </div>
            <div className="panel-controls">
              <div>
                <input
                  type="text"
                  placeholder="Search JSON..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                />
              </div>
              <button
                onClick={expanAllFields}
                disabled={!output}
                className="btn btn-secondary btn-icon"
                title="Expand All Fields"
              >
                <Expand size={16} />
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="btn btn-secondary btn-icon"
                title="Copy Output"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={downloadJSON}
                disabled={!output}
                className="btn btn-success btn-icon"
                title="Download Output"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => setOutput("")}
                disabled={!output}
                className="btn btn-danger btn-icon"
                title="Clear Output"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div
            className="panel-content"
            ref={outputRef}
            style={{ fontSize: `${fontSize}px` }}
          >
            {output ? (
              isTreeMode ? (
                <div className="output-area">
                  {renderTreeView(parseJSON(output))}
                </div>
              ) : (
                <div className="output-area">
                  <pre
                    dangerouslySetInnerHTML={{
                      __html: highlightJSON(
                        highlightSearch(addLineNumbers(output))
                      ),
                    }}
                  />
                </div>
              )
            ) : (
              <div className="empty-state">
                {/* <div className="empty-icon">📄</div> */}
                <p>
                  {/* No output yet. Format or minify your JSON to see results here. */}
                </p>
              </div>
            )}
            {showMinimap && output && !isTreeMode && (
              <div className="minimap">
                <pre>
                  {highlightJSON(highlightSearch(addLineNumbers(output)))}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value blue">{stats.size}</div>
          <div className="stat-label">Bytes</div>
        </div>
        <div className="stat-item">
          <div className="stat-value green">{stats.lines}</div>
          <div className="stat-label">Lines</div>
        </div>
        <div className="stat-item">
          <div className="stat-value purple">{stats.keys}</div>
          <div className="stat-label">Properties</div>
        </div>
        <div className="stat-item">
          <div className="stat-value orange">{stats.depth}</div>
          <div className="stat-label">Depth</div>
        </div>
        <div className="stat-item">
          <div className={`stat-value ${isValid ? "green" : "red"}`}>
            {isValid ? "✓" : "✗"}
          </div>
          <div className="stat-label">Valid</div>
        </div>
      </div>
      {showSettings && (
        <div className={`settings-panel ${showSettings ? "open" : ""}`}>
          <div className="settings-header">
            <h2 className="settings-title">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="btn btn-icon btn-danger"
            >
              <X size={20} />
            </button>
          </div>
          <div className="controls-group">
            <div className="controls-group-title">
              <Type size={16} />
              Editor
            </div>
            <div className="slider-container">
              <div className="slider-label">
                <span>Font Size: {fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="slider"
              />
            </div>
            <label className="checkbox-group">
              <div
                className={`checkbox ${lineNumbers ? "checked" : ""}`}
                onClick={() => setLineNumbers(!lineNumbers)}
              />
              Line Numbers
            </label>
            <label className="checkbox-group">
              <div
                className={`checkbox ${wordWrap ? "checked" : ""}`}
                onClick={() => setWordWrap(!wordWrap)}
              />
              Word Wrap
            </label>
            <label className="checkbox-group">
              <div
                className={`checkbox ${highlightSyntax ? "checked" : ""}`}
                onClick={() => setHighlightSyntax(!highlightSyntax)}
              />
              Syntax Highlighting
            </label>
            <label className="checkbox-group">
              <div
                className={`checkbox ${showMinimap ? "checked" : ""}`}
                onClick={() => setShowMinimap(!showMinimap)}
              />
              Show Minimap
            </label>
          </div>
          <div className="controls-divider"></div>
          <div className="controls-group">
            <div className="controls-group-title">
              <Palette size={16} />
              Display
            </div>
            <label className="checkbox-group">
              <div
                className={`checkbox ${compactMode ? "checked" : ""}`}
                onClick={() => setCompactMode(!compactMode)}
              />
              Compact Mode
            </label>
          </div>
        </div>
      )}
      <div className="footer">© 2025 Developer Tools Hub - JSON Tool</div>
    </div>
  );
};

export default JSONTool;
