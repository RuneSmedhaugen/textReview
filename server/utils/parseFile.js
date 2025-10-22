import fs from 'fs';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import textract from 'textract';

export const parseFile = async (file) => {
    const { mimetype, path } = file;
    // PDF
    if (mimetype === 'application/pdf') {
        const data = await pdf(fs.readFileSync(path));
        return data.text;
    }
    // TXT
    else if (mimetype === application/vnd/opencmlformats-officedocument.wordprocessingml.document') {
        const {value} = await mammoth.extractRawText({path});
        return value;
    }
    // everything else 
    else {
        return new Promise((resolve, reject) => {
            textract.fromFileWithPath(path, (error, text) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(text);
                }
            });
    }
}