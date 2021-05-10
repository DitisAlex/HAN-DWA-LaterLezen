const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const mercury = require('@postlight/mercury-parser');
const {
  extract
} = require('article-parser');


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // const articleURL = 'https://www.nu.nl/wetenschap/6093105/wat-drijft-een-mens-om-te-discrimineren.html';
  const articleURL = 'https://nos.nl/artikel/2359116-burgemeester-woensdrecht-over-vuurwerkbom-bij-zijn-huis-schrik-beetje-te-boven.html'

  mercury.parse(articleURL)
  .then(response => res.end(JSON.stringify(response)))

  extract(articleURL).then((article) => {
    res.end(JSON.stringify(article))
  })

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});