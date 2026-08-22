import fs from "fs";
import { PDFParse } from "pdf-parse";

const extractedText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const pdf = new PDFParse({
    data: buffer,
  });
  const result = await pdf.getText();

  return result.text;
};
export default extractedText;

// pdf ---> pdf Storage ---> text ---> llm ---> agent ----> prompt ---> data ---> save mongoDb
// ---> redis ---> pdf delete ---> resume data (score, missing skills, recommendation)
