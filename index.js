// import puppeteer from "puppeteer"
// import Cronjob from "node-cron"
import cheerio from "cheerio"
import Cron from "node-cron"
import axios from "axios";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express"; 
import { MongoClient } from "mongodb";
import cors from "cors"
const MONGO_URL = process.env.MONGO_URL;
const client = new MongoClient(MONGO_URL); // dial
const app = express();
app.use(cors());
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");


const PORT = process.env.port;
app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.delete("/scrapdata", async function (request, response) {

  const data = await client
  .db("scrapdataDB")
  .collection("alldata")
  .deleteMany()
  
  response.send(data)
  
  
  });

app.delete("/scrapdata/gadget", async function (request, response) {

const data = await client
.db("scrapdataDB")
.collection("gadget")
.deleteMany()

response.send(data)


});
app.delete("/scrapdata/watch", async function (request, response) {

const data = await client
.db("scrapdataDB")
.collection("watch")
.deleteMany()

response.send(data)


});
app.delete("/scrapdata/cloths", async function (request, response) {

const data = await client
.db("scrapdataDB")
.collection("cloths")
.deleteMany()

response.send(data)


});



const url = 'https://www.flipkart.com/search?q=electronics';
const urlflipkart = 'https://www.flipkart.com/search?q=cloths';

const snapdeal ="https://www.snapdeal.com/search?keyword=watch&sort=rlvncy"

async function scrapeFlipkart() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const products = [];

    $('._4ddWXP').each((index, element) => {
      const product = {
        image: $(element).find('img._396cs4').attr('src'),
        title: $(element).find('a.s1Q9rs').text(),
        rating: $(element).find('._3LWZlK').text(),
        price: $(element).find('div._30jeq3').text(),
        offer: $(element).find('div._3Ay6Sb').text()
      };

      products.push(product);
    });

    const finalproducts = products.slice(0,10)

for(let value of finalproducts){
  const dat = await client
  .db("scrapdataDB")
  .collection("gadget")
  .findOneAndUpdate({title:value.title},{ $set :{...value}}  )
  
if(dat.lastErrorObject.updatedExisting == false ){
  const dat = await client
  .db("scrapdataDB")
  .collection("gadget")
  .insertOne(value)
}
}
for(let value of finalproducts){
  const dat = await client
  .db("scrapdataDB")
  .collection("alldata")
  .findOneAndUpdate({title:value.title},{ $set :{...value}}  )
  
if(dat.lastErrorObject.updatedExisting == false ){
  const dat = await client
  .db("scrapdataDB")
  .collection("alldata")
  .insertOne(value)
}
}

    console.log('Scraped Flipkart successfully');
  } catch (err) {
    console.log('Error scraping Flipkart:', err);
  }
}
async function scrapeSnapdeal() {
  try {
    const response = await axios.get(snapdeal);
    const $ = cheerio.load(response.data);
    const products = [];

    $('.favDp').each((index, element) => {
      const product = {
        image: $(element).find("source").attr("srcset"),
        title: $(element).find('p.product-title').text(),
        rating: $(element).find('p.product-rating-count').text(),
        price: $(element).find('span.product-price').text(),
        offer: $(element).find('.product-discount span').text()
      };
      products.push(product);      
    })

    const finalproducts = products.slice(0,20)

for(let value of finalproducts){
const data = await client
.db("scrapdataDB")
.collection("watch")
.findOneAndUpdate({title:value.title},{$set :{...value}}  )

if(data.lastErrorObject.updatedExisting == false){
  const data = await client
    .db("scrapdataDB")
    .collection("watch")
    .insertOne(value)
}
}   
for(let value of finalproducts){
const data = await client
.db("scrapdataDB")
.collection("alldata")
.findOneAndUpdate({title:value.title},{$set :{...value}}  )

if(data.lastErrorObject.updatedExisting == false){
  const data = await client
    .db("scrapdataDB")
    .collection("alldata")
    .insertOne(value)
}
}   
console.log('Scraped snapdeal successfully');
    // console.log(products);
  } 
    catch (err) {
          console.log('Error scraping Flipkart:', err);
        }
      }

async function scrapCloths() {
  try {
    const response = await axios.get(urlflipkart);
    const $ = cheerio.load(response.data);
    const products = [];

    $('._1AtVbE').each((index, element) => {
      const product = {
        image: $(element).find('img._2r_T1I').attr('src'),
        title: $(element).find('._2WkVRV').text(),
        price: $(element).find("._30jeq3").text().slice(0,4),
        offer: $(element).find('._3Ay6Sb > span').text().slice(0,7)
      };
      products.push(product);
    });
    
    const finalproducts = products.slice(2,12)
    console.log(finalproducts);

for(let value of finalproducts){
const data = await client
.db("scrapdataDB")
.collection("cloths")
.findOneAndUpdate({title:value.title},{$set :{...value}}  )
if(data.lastErrorObject.updatedExisting == false){
  const data = await client
    .db("scrapdataDB")
    .collection("cloths")
    .insertOne(value)
}
}   
for(let value of finalproducts){
const data = await client
.db("scrapdataDB")
.collection("alldata")
.findOneAndUpdate({title:value.title},{$set :{...value}}  )
if(data.lastErrorObject.updatedExisting == false){
  const data = await client
    .db("scrapdataDB")
    .collection("alldata")
    .insertOne(value)
}
}   
console.log('Scraped flipkart cloths successfully');

  } 
    catch (err) {
          console.log('Error scraping amazon:', err);
        }
      }

      scrapeFlipkart()
      scrapeSnapdeal()
      scrapCloths()

    Cron.schedule('0 */12 * * *', () => {
      console.log('Scraping data from flikart...');
      console.log('Scraping data from snapdeal...');
      console.log('Scraping data from flikart cloths...');
      scrapeFlipkart()
      scrapeSnapdeal()
 scrapCloths()
    });

    app.get("/scrapdata", async function (request, response) {

      const data = await client
      .db("scrapdataDB")
      .collection("alldata")
      .find({})
      .toArray()
      
      response.send(data)
      
      
      });
    app.get("/scrapdata/gadget", async function (request, response) {

      const data = await client
      .db("scrapdataDB")
      .collection("gadget")
      .find({})
      .toArray()
      
      response.send(data)
      
      
      });
    app.get("/scrapdata/watch", async function (request, response) {
        
      const data = await client
      .db("scrapdataDB")
      .collection("watch")
      .find({})
      .toArray()
      
      response.send(data)
      
    })
    app.get("/scrapdata/cloths", async function (request, response) {

      const data = await client
      .db("scrapdataDB")
      .collection("cloths")
      .find({})
      .toArray()
      
      response.send(data)
      
      
      });


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
  

