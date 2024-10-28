//This code provides a robust way to handle file uploads in your application:


//It ensures each uploaded file has a unique name using UUIDs, reducing the risk of file name collisions.
//The files are stored in the specified directory, making it easy to manage uploaded files.




// const multer = require('multer')
// const { v4: uuid4 } = require('uuid');


// const storage = multer.diskStorage({
//     destination(req,file,cb){
//         cb(null ,"uploads")
//     },

//     filename(req,file,cb){
//         const id = uuid()
//         const extName =file.originalname.split(".").pop();
//         const fileName =`${id}.${extName}`
//         cb(null,file)

//     }
// });

//  const uploadFiles =multer({storage}).single('file')

//  module.exports = uploadFiles;

const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Ensure you import the uuid correctly
const fs = require('fs');
const path = require('path');

// Define the upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up multer storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir); // Correctly specify the upload path
    },
    filename(req, file, cb) {
        const id = uuidv4(); // Use uuidv4 to generate a unique ID
        const extName = file.originalname.split(".").pop(); // Get file extension
        const fileName = `${id}.${extName}`; // Construct the file name
        cb(null, fileName); // Pass the constructed file name
    }
});

// Create the upload middleware
const uploadFiles = multer({ storage }).single('file'); // Adjust 'file' to your input name

module.exports = uploadFiles;
 