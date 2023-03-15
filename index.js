// import puppeteer from "puppeteer"
// import Cronjob from "node-cron"
import cheerio from "cheerio"
import axios from "axios";
// import request from "request-promise";
// import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
// dotenv.config()
import express from "express"; 
import { MongoClient } from "mongodb";
import cors from "cors"
const MONGO_URL = process.env.MONGO_URL;
// const MONGO_URL = "mongodb+srv://scrapdataDB:789789@flashspeed.hsre6qm.mongodb.net";
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
.collection("gadget")
.find({})
.toArray()

response.send(data)


});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

const url = 'https://www.flipkart.com/search?q=electronics';
// const url ="https://www.amazon.com/s?k=phones"


// const db =client.db("scrapdataDB")
// const collection = db.collection("gadgets")


async function scrapeFlipkart() {
  try {
    const response = await axios.get('https://www.flipkart.com/search?q=electronics');
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

const dat = await client
.db("scrapdataDB")
.collection("gadget")
.insertMany(products)

console.log(products);
    console.log('Scraped Flipkart successfully');
  } catch (err) {
    console.log('Error scraping Flipkart:', err);
  }
}

// scrapeFlipkart()











// async function Flipkartscrap(){
// try{
//   axios.get(url)
//   const response = await axios.get(url);
//       const $ = cheerio.load(response.data);
//       const products = [];
  
//       $('._4ddWXP').each((index, element) => {
//         const product = {
//           image: $(element).find('img._396cs4').attr('src'),
//           title: $(element).find('a.s1Q9rs').text(),
//           rating: $(element).find('._3LWZlK').text(),
//           price: $(element).find('div._30jeq3').text(),
//           offer: $(element).find('div._3Ay6Sb').text()
//         };
  
//         products.push(product);
  
  
        
//       });
  
  
//       console.log(products);
  

// }catch(err){
//   console.error(err)
// }


// }






// async function ScrapFlipkartlist(){


// try{

// const htmlResult =await request.get(url)
// const $ = await cheerio.load(htmlResult)
// // const alldatafromflipkart=[]
// const products = [];

// $('._4ddWXP').each((i, el) => {
//     const title = $(el).find('a.s1Q9rs').text();
//     const price = $(el).find('div._30jeq3').text();
//     const rating = $(el).find('._3LWZlK').text();
//     const image = $(el).find('img._396cs4').attr('src');
//     const offer = $(el).find('div._3Ay6Sb').text();

//     products.push({
//       title,
//       price,
//       rating,
//       image,
//       offer,
//     });
//   });


// console.log(products);
// // $("._4ddWXP").each((index,element) =>{

// //     const resulttitle =  $(element)
// //     .children('.s1Q9rs')
// //     const resultprice =  $(element)
// //     .find("._30jeq3")
// //     const resultimg =  $(element)
// //     .find("._396cs4")
// //     const resultrating =  $(element)
// //     .find("._3LWZlK")
// //     const title =resulttitle.text()
// //     const rating = resultrating.text()
// //     const price =resultprice.text()
// //     const imgpro = resultimg.attr("src")

// // const  scrapdata = {title,rating,price,imgpro}
// // alldatafromflipkart.push(scrapdata)

// // } )

// // console.log(alldatafromflipkart.length);

// }
// catch(err){
//     console.error(err)
// }

// }




// import { MongoClient } from "mongodb";
// const MONGO_URL = "mongodb://127.0.0.1";
// const client = new MongoClient(MONGO_URL); // dial
// // Top level await
// await client.connect(); // call
// console.log("Mongo is connected !!!  ");


// const PORT = 4000;
// app.get("/", function (request, response) {
//   response.send("🙋‍♂️, 🌏 🎊✨🤩");
// });


// async function insertdata(dataf){

// const datas = await client
// .db("scrapDB")
// .collection("gadget")
// .insertMany({dataf})


  
// } 
// const datafromscrap = ScrapFlipkartlist()
// // insertdata(datafromscrap)
// console.log(datafromscrap);


// const data = await client
// .db("scrapedDB")
// .collection('scrapdata_gadget')
// .insertMany(datafro)


// console.log(datafromscrap);

// app.get("/scrapdata", async function (request, response) {
  

// const data = await client
// .db("scrapedDB")
// .collection('scrapdata')
// .find({})
// .toArray()
// response.send(data)

// });
// app.post("/scrapdata", async function (request, response) {
  
// const dataformscrap = await ScrapFlipkartlist()

// const data = await client
// .db("scrapedDB")
// .collection('scrapdata')
// .insertMany(dataformscrap)

// response.send(data)

// });

// app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));





// ScrapFlipkartlist()









// // import $ from "cheerio"
// import cheerio from "cheerio"
// import request from "request";


// const url = 'https://www.flipkart.com/search?q=electronics';

// request(url, (error, response, html) => {
//   if (!error && response.statusCode == 200) {
//     const $ = cheerio.load(html);
//     const products = [];

//     $('div._2kHMtA').each((i, el) => {
//       const title = $(el).find('a._2cLu-l').text();
//       const price = $(el).find('div._30jeq3').text();
//       const rating = $(el).find('div.hGSR34').text();
//       const image = $(el).find('img._396cs4').attr('src');
//       const offer = $(el).find('div._3Ay6Sb').text();

//       products.push({
//         title,
//         price,
//         rating,
//         image,
//         offer,
//       });
//     });

//     console.log(products);
//   }
// });

// import express from "express"; // "type": "module"
// import puppeteer from 'puppeteer'
// const app = express();


// import { MongoClient } from "mongodb";
// const MONGO_URL = "mongodb://127.0.0.1";
// const client = new MongoClient(MONGO_URL); // dial
// // Top level await
// await client.connect(); // call
// console.log("Mongo is connected !!!  ");





// const PORT = 4000;
// app.get("/", function (request, response) {
//   response.send("🙋‍♂️, 🌏 🎊✨🤩");
// });

// app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));