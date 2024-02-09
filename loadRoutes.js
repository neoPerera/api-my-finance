const fs = require("fs");
const path = require("path");

const exploreDirectory = (dir, callback) => {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const relativePath = path.relative(__dirname + "/routes", filePath);

    if (fs.statSync(filePath).isDirectory()) {
      exploreDirectory(filePath, callback); // Recursively explore subdirectories
    } else {
      callback(file, relativePath);
    }
  });
};

const loadRoutes = (app) => {
  const routersDir = path.join(__dirname, "routes");

  exploreDirectory(routersDir, (file, relativePath) => {
    try {
      const folderName = file.split(".")[0];
      const routerPath = path.join(routersDir, relativePath);
      const dirname = path.dirname(relativePath);
      const routename = path.relative(routersDir, dirname).split("..",2)[1].replace(/\\/g, '/')|| "";
      // Now you can use folderName, routerPath, and relativePath as needed
      // console.log("File:", file);
      // console.log("Folder Name:", folderName);
      // console.log("Router Path:", routerPath);
      // console.log("Relative Path:", relativePath);
      console.log("url Path:",`API${routename}` );

      // Load the router if needed
      const router = require(routerPath);
      app.use(`/api${routename}`, router);

    } catch (error) {
      console.error(`Error loading router from file: ${file}`, error);
    }
  });
};

module.exports = loadRoutes;
