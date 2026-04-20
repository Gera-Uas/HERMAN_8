import React, { useState, useRef } from "react";
import { Upload, X, File, FileVideo, FileAudio, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const getFileIcon = (type) => {
  if (type.includes("video")) return FileVideo;
  if (type.includes("audio")) return FileAudio;
  if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel")) return FileSpreadsheet;
  return FileText;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function FileUploader({ 
  accept, 
  multiple = true, 
  files = [], 
  onFilesChange,
  title = "Cargar archivos",
  description = "Arrastra archivos aquí o haz clic para seleccionar"
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    onFilesChange([...files, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
          isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className={cn(
          "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors",
          isDragging ? "bg-indigo-100" : "bg-slate-100"
        )}>
          <Upload className={cn(
            "w-8 h-8 transition-colors",
            isDragging ? "text-indigo-500" : "text-slate-400"
          )} />
        </div>
        
        <h4 className="text-lg font-semibold text-slate-700 mb-1">{title}</h4>
        <p className="text-sm text-slate-500">{description}</p>
        
        {accept && (
          <p className="text-xs text-slate-400 mt-2">
            Formatos aceptados: {accept}
          </p>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}