import https from 'https';

https.get('https://coach2-kappa.vercel.app/index.html', (resp) => {
  console.log("Status: ", resp.statusCode);
  console.log("Headers: ", resp.headers);
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log(data); });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});