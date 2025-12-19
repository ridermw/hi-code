import http from "http";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((_, response) => {
  const payload = {
    status: "ok",
    message: "Service placeholder. Routes will be added later.",
  };

  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
