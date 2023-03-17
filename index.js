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
app.get("/scrapdata", async function (request, response) {

const data = await client
.db("scrapdataDB")
.collection("alldata")
.find({})
.toArray()

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
.collection("gadget")
.deleteMany()

response.send(data)


});
app.delete("/scrapdata/videogame", async function (request, response) {

const data = await client
.db("scrapdataDB")
.collection("gadget")
.deleteMany()

response.send(data)


});



const url = 'https://www.flipkart.com/search?q=electronics';
// const Amazonurl ="https://www.amazon.in/s?k=rings"
// const Amazonurl ="https://www.amazon.com/"
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

    const finalproducts = products.slice(0,10)

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

// async function scrapeAmazon() {
//   try {
//     const response = await axios.get(Amazonurl);
//     const $ = cheerio.load(response.data);
//     const products = [];

//     // $('div[data-component-type="s-search-result"]').each((index, element) => {
//     //   const title = $(element).find('h2 > a > span').text().trim();
//     //   const rating = $(element).find('div[data-asin="' + $(element).attr('data-asin') + '"] > div > div.a-section.a-spacing-none.a-spacing-top-micro > div.a-row.a-size-small > span:nth-child(1) > span.a-icon-alt').text().trim();
//     //   const offer = $(element).find('span[data-component-type="s-prime-info"]').text().trim();
//     //   const price = $(element).find('a > span.a-offscreen').text().trim();
//     //   const image = $(element).find('img').attr('src');

//     //   products.push({
//     //     title: title,
//     //     rating: rating,
//     //     offer: offer,
//     //     price: price,
//     //     image: image
//     //   });
//     // });

//     $('div.product').each((index, element) => {
//       const rating = $(element).find('div.rating').text();
//       const title = $(element).find('h1.title').text();
//       const offer = $(element).find('span.offer').text();
//       const price = $(element).find('span.price').text();
//       const image = $(element).find('img.image').attr('src');
//       console.log(`Product ${index + 1}:`);
//       console.log(`Rating: ${rating}`);
//       console.log(`Title: ${title}`);
//       console.log(`Offer: ${offer}`);
//       console.log(`Price: ${price}`);
//       console.log(`Image: ${image}`);
//     });
    
  


//     // const finalproducts = products.slice(0,12)

// // for(let value of finalproducts){
// // const data = await client
// // .db("scrapdataDB")
// // .collection("videogame")
// // .findOneAndUpdate({title:value.title},{$set :{...value}}  )
// // if(data.lastErrorObject.updatedExisting == false){
// //   const data = await client
// //     .db("scrapdataDB")
// //     .collection("videogame")
// //     .insertOne(value)
// // }
// // }   
// // for(let value of finalproducts){
// // const data = await client
// // .db("scrapdataDB")
// // .collection("alldata")
// // .findOneAndUpdate({title:value.title},{$set :{...value}}  )
// // if(data.lastErrorObject.updatedExisting == false){
// //   const data = await client
// //     .db("scrapdataDB")
// //     .collection("alldata")
// //     .insertOne(value)
// // }
// // }   
// console.log('Scraped amazon successfully');

//   } 
//     catch (err) {
//           console.log('Error scraping amazon:', err);
//         }
//       }


      // scrapeFlipkart()
      // scrapeSnapdeal()
    // scrapeAmazon()



scrapeFlipkart()
scrapeSnapdeal()

    Cron.schedule('0 */12 * * *', () => {
      console.log('Scraping data from flikart...');
      console.log('Scraping data from snapdeal...');
      console.log('Scraping data from amazon...');
      scrapeFlipkart()
      scrapeSnapdeal()
      // scrapeAmazon()
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
//  app.get("/scrapdata/videogame", async function (request, response) {

//       const data = await client
//       .db("scrapdataDB")
//       .collection("videogame")
//       .find({})
//       .toArray()

//       response.send(data)
      
//  })



app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
  

