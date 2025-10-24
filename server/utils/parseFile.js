import fs from "fs";
import * as pdf from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";

export const parseFile = async (file) => {
  const { mimetype, path } = file;

  if (mimetype === "application/pdf") {
    // PDF
    const data = await pdf(fs.readFileSync(path));
    return data.text;
  } 
  else if (mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // DOCX 
    const { value } = await mammoth.extractRawText({ path });
    return value;
  } 
  else if (mimetype ===  "application/msword") {
    // DOC
    const extractor = new WordExtractor();
    const doc = await extractor.extract(path);
    return doc.getBody();
  }
  else {
    // everything else
    return new Promise((resolve, reject) => {
      textract.fromFileWithPath(path, (err, text) => {
        if (err) reject(err);
        else resolve(text);
      });
    });
  }
};
