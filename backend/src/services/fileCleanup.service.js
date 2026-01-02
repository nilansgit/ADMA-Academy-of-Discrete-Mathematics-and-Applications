import fs from "fs";

export function deleteFileIfExists(filePath) {
  if (!filePath) return;

  fs.unlink(filePath, err => {
    if (err) {
      console.error("Failed to delete file:", filePath);
    }
  });
}
