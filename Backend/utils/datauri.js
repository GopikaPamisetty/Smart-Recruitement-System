import DatauriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
    if (!file) {
        console.error("File is undefined in getDataUri");
        return null; // Return null instead of crashing
    }
    const parser = new DatauriParser();
    const extName = path.extname(file.originalname);
    return parser.format(extName, file.buffer);
};

export default getDataUri;
