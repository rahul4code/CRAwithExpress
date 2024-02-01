const express=require('express');
const app=express();

const cors = require('cors');
const PORT = 8080;


app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};


const countries=require("./data/data.json")
const countryList=countries.countries

app.get('/', cors(corsOptions),(req,res)=>{
    res.send("Welcome to the world of cricket !")
})

app.get('/api/getAllCountries',cors(corsOptions),(req,res)=>{
    let entries=countryList.map(item=>{
        return {
            "value":item.id,
            "label":item.name
        }
    })
    res.send(entries);
})

app.get("/api/getAllContinent", cors(corsOptions), (req, res) => {
    var lookup = {};
    var items = countryList;
    var result = [];
    
    for (var item, i = 0; item = items[i++];) {
      var name = item.continent;
    
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
    }
    res.send(result)
})



app.get('/api/getCountry/:name',cors(corsOptions),(req,res)=>{
    let name=req.params.name;
    let arr=countryList.find(b=>b.name==name)
    if(!arr) res.status(404).send("No match found !");
    res.send(arr);
})

app.post('/api/addCountry',cors(corsOptions),(req,res)=>{
    console.log(req.body,"Get all data")
    let new_Country={
        "id":countries.length+1,
        "name":req.body.country,
        "continent":req.body.continent,
        "flag":req.body.flag,
        "rank":req.body.rankNew
    }
    countries.push(new_Country);
    res.send(countries);
})


app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
})