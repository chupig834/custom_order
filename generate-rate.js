// generate-rate.js
require('dotenv').config();
const fs = require("fs");
const https = require("https");

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

https.get(url, (res) => {
  let data = "";

  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      const rate = json.conversion_rates.TWD;
      const today = new Date().toISOString().split("T")[0];

      const result = {
        date: today,
        usd_to_twd: Math.round(rate,1) + 1
      };

      fs.writeFileSync("rate.json", JSON.stringify(result, null, 2));
      console.log(`✅ rate.json updated: 1 USD = ${rate} TWD`);
    } catch (err) {
      console.error("Failed to parse API response:", err);
    }
  });
}).on("error", (err) => {
  console.error("HTTP request failed:", err.message);
});
