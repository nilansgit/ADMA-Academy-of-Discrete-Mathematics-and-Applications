export default function validateFile(file, { maxSize, allowedTypes }){
    console.log("redd")
    if (!file) return { valid: true };
  
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Invalid file type"
      };
    }
  
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSize / (1024 * 1024)}MB`
      };
    }
  
    return { valid: true };
}
  