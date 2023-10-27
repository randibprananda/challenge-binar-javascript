const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { PORT = 8000 } = process.env;

const PUBLIC_DIRECTORY = path.join(__dirname, "../public");

function getHtml(page) {
  const htmlFilePath = path.join(PUBLIC_DIRECTORY, `${page}.html`);
  console.log(htmlFilePath);
  return fs.readFileSync(htmlFilePath, "utf-8");
}

function getJSON(data) {
  const toJSON = JSON.stringify(data);
  return toJSON;
}

function router() {
  const routes = {
    get: () => {},
    post: () => {},
  };
  const get = (path, cb) => {
    routes.get[path] = cb;
  };
  const post = (path, cb) => {
    routes.post[path] = cb;
  };
  return {
    get,
    post,
    routes,
  };
}

const appRouter = router();

function getContent(filename) {
  const filePath = path.join(PUBLIC_DIRECTORY, filename);
  try {
    const content = fs.readFileSync(filePath);
    return content;
  } catch (error) {
    console.error(`Error reading file: ${error}`);
    return "Internal Server Error";
  }
}

const server = () => {
  return (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const { pathname } = parsedUrl;

    const isCss = pathname.includes("/css");
    const isJs = pathname.includes("/script");
    const isImages = pathname.includes("/images");

    if (pathname === "/") {
      const pageContent = getHtml("index");
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(pageContent);
    } else if (pathname === "/search") {
      const pageContent = getHtml("search");
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(pageContent);
    } else if (isCss || isJs || isImages) {
      res.end(getContent(pathname));
    } else {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(404);
      res.end(getHtml("404"));
    }
  };
};

http.createServer(server()).listen(PORT, "localhost", () => {
  console.log("Server is running, open http://localhost:%d", PORT);
});
