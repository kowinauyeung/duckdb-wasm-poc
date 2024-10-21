import { getFileFromPath } from "../opfsHelper";
import { useState, useCallback } from "react";

export const OPFSDemo = () => {
  const [filename, setFileName] = useState("");
  const [content, setContent] = useState("");

  const read = useCallback(async () => {
    const file = await getFileFromPath(filename);
    const fileContent = await file.getContent();
    setContent(fileContent);
  }, [filename]);
  const write = useCallback(async () => {
    const file = await getFileFromPath(filename);
    await file.writeFile(content);
  }, [content, filename]);

  return (
    <div>
      <div>
        File:
        <input
          type="text"
          value={filename}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      <div>
        Content:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <button onClick={read}>Read</button>
        <button onClick={write}>Write</button>
      </div>
    </div>
  );
};
