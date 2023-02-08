const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connnetDatabase =()=>{
    mongoose
      .connect(process.env.DB_URI, {
        usenewurlparser: true,
        useunifiedtopology: true,
      })
      .then((data) => {
        console.log("mongodb connected with server ");
      })
      // .catch((err) => {
      //   console.log(err);
      // });

}

module.exports =  connnetDatabase