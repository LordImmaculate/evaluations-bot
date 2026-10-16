import type { BunFile } from "bun";

export async function readOrCreateFile(
  filePath: string,
  defaultContent: string
): Promise<BunFile> {
  const file = Bun.file(filePath);
  let content = "";
  try {
    content = await file.text();
  } catch (err) {
    // file doesn't exist or cannot be read -> create it with default content
    await Bun.write(filePath, defaultContent);
    return Bun.file(filePath);
  }

  // If file exists but is empty or only whitespace, initialize with defaultContent
  if (!content || content.trim().length === 0) {
    await Bun.write(filePath, defaultContent);
  }

  return Bun.file(filePath);
}
