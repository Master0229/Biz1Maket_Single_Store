
const https = require('https');
var db = {};
// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb')
const nodemailer = require("nodemailer");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
var parser;
var port;
db.pendingordersdb = new Datastore({ filename: './database/pendingorders.db', autoload: true });
db.printersettings = new Datastore({ filename: './database/printersettings.db', autoload: true });
db.paymenttypes = new Datastore({ filename: './database/paymenttypes.db', autoload: true });


db.transactionsdb = new Datastore({ filename: './database/transactions.db', autoload: true });
db.transactionlogsdb = new Datastore({ filename: './database/transactionlogs.db', autoload: true });
db.preordersdb = new Datastore({ filename: './database/preorders.db', autoload: true });
db.orderkeydb = new Datastore({ filename: './database/orderkey.db', autoload: true });
db.productdb = new Datastore({ filename: './database/products.db' });
db.customerdb = new Datastore({ filename: './database/customer.db' });
db.orderlogsdb = new Datastore({ filename: './database/orderlogs.db', autoload: true });
db.customeraddressdb = new Datastore({ filename: './database/customeraddress.db' });
db.additionalchargesdb = new Datastore({ filename: './database/additionalcharges.db' });
db.discountruledb = new Datastore({ filename: './database/discountrule.db' });
db.orderstatusdb = new Datastore({ filename: './database/orderstatus.db' });
db.ordertypedb = new Datastore({ filename: './database/ordertype.db' });
db.paymentstatusdb = new Datastore({ filename: './database/paymentstatus.db' });
db.paymenttypedb = new Datastore({ filename: './database/paymenttype.db' });
db.taxgroupdb = new Datastore({ filename: './database/taxgroup.db' });
db.transtypedb = new Datastore({ filename: './database/transtype.db' });
db.orderdb = new Datastore({ filename: './database/order.db' });
db.clientdb = new Datastore({ filename: './database/client.db' });
db.masterproductdb = new Datastore({ filename: './database/masterproduct.db' });
db.mastercategorydb = new Datastore({ filename: './database/mastercategory.db' });
db.masteroptiondb = new Datastore({ filename: './database/masteroption.db' });
db.masteroptiongroupdb = new Datastore({ filename: './database/masteroptiongroup.db' });
db.unitdb = new Datastore({ filename: './database/unit.db' });
db.producttypedb = new Datastore({ filename: './database/producttype.db' });
db.vendorsdb = new Datastore({ filename: './database/vendors.db' });
db.categoriesdb = new Datastore({ filename: './database/categories.db' });
db.barcodeproductdb = new Datastore({ filename: './database/barcodeproduct.db' });
db.aster_LOG
db.loginfo = new Datastore({ filename: './database/loginfo.db' });
db.preferencedb = new Datastore({ filename: './database/preference.db' });
db.stockbatchdb = new Datastore({ filename: './database/stockbatch.db' });
db.aster
db.storeusers = new Datastore({ filename: './database/storeusers.db' });
db.user = new Datastore({ filename: './database/user.db' });


Object.keys(db).forEach(key => {
  db[key].loadDatabase((data, error) => {
    // if (error) console.log("Error loading database!")
    // else console.log("Database loaded successfully!")
  });
})
// loadatabase();
const axios = require('axios')

// axios.get('https://biz1retail.azurewebsites.net/api/Product/getStockProduct?CompanyId=1')
//     .then(res => {
//         console.log(res.data)
//         stockbatchesdb.insert(res.data, function (err, newDoc) {   // Callback is optional
//         });
//     })
//     .catch(error => {
//         console.error(error)
//     })
//     axios.get('https://biz1retail.azurewebsites.net/api/Product/getProductType?CompanyId=1')
//     .then(res => {
//         console.log(res.data)
//         producttypedb.insert(res.data, function (err, newDoc) {   // Callback is optional
//         });
//     })
//     .catch(error => {
//         console.error(error)
//     })
// https.request('https://biz1retail.azurewebsites.net/api/Product/stockEntry?CompanyId=1', { "CompanyId": 1 }, (resp) => {
//     let data = '';

//     // A chunk of data has been recieved.
//     resp.on('data', (chunk) => {
//         data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//         console.log("qqqq", data)
//         var products = JSON.parse(data).product;
//         stockbatchesdb.insert(products, function (err, newDoc) {   // Callback is optional
//             // newDoc is the newly inserted document, including its _id
//             // newDoc has no key called notToBeSaved since its value was undefined
//             console.log(err, index)
//         });
//     });

// }).on("error", (err) => {
//     console.log("Error: " + err.message);
// });
var express = require('express');
var app = express();
var cors = require('cors')
var ip = require('ip')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '50mb' }));

app.use(cors());

app.get('/portList', function (req, res) {
  SerialPort.list().then(function (ports) {
    res.send(ports)
  });
})

app.get('/configurePort', function (req, res) {
  console.log(req.query);
  port = new SerialPort({
    path: req.query.port,
    baudRate: 9600,
  })
  parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
  listener()
  res.send({ status: 200, parser })
})

var weight = '0'

const listener = () => {
  parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
  parser.on("data", (line) => weight = line)
}

app.get('/getWeight', function (req, res) {
  res.send({ status: 200, weight })
})
// app.get('/getWeight', function (req, res, next) {
//     //when using text/plain it did not stream
//     //without charset=utf-8, it only worked in Chrome, not Firefox
//     res.setHeader('Content-Type', 'text/html; charset=utf-8');
//     res.setHeader('Transfer-Encoding', 'chunked');

//     writer = fs.createWriteStream('test.txt')
//     parser.on("data", (line) => writer.write(line))
// });

app.get('/getproducts', function (req, res) {
  db.productdb.find({ quantity: { $gt: 0 } }, function (err, docs) {
    res.send(docs)
  });
})
app.get('/getendangeredproducts', function (req, res) {
  db.productdb.find({ quantity: { $lt: 4 } }, function (err, docs) {
    res.send(docs)
  });
})
app.get('/getbarcodeproduct', function (req, res) {
  db.barcodeproductdb.find({}, function (err, docs) {
    res.send(docs)
  });
})
app.get('/getcustomers', function (req, res) {
  db.customerdb.find({}, function (err, docs) {
    res.send(docs)
  });
})
app.get('/getvendors', function (req, res) {
  db.vendorsdb.find({}, function (err, docs) {
    res.send(docs)
  });
})
app.get('/getcustomerbyphone', function (req, res) {
  db.customerdb.findOne({ phone: req.query.phone }, function (err, docs) {
    res.send(docs)
  });
})

app.post('/insertcustomer', function (req, res) {
  db.customerdb.insert(req.body, function (err, docs) {
    res.send(docs)
  });
})
app.post('/insertproduct', function (req, res) {
  db.productdb.insert(req.body, function (err, docs) {
    res.send(docs)
  });
})

app.post('/batchproduct', function (req, res) {
  db.productdb.insert(req.body, function (err, newDoc) {   // Callback is optional
    // Callback is optional
    //  console.log(req.body.products)
    res.send({ message: 'data updated successfully' })
  });
})

app.post('/updatestock', function (req, res) {
  console.dir(req.body);
  db.stockbatchdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
      console.log(newDoc) // Callback is optional
      res.send({ message: 'yes iam the server' })
  });
})

app.get('/getlocal', function (req, res) {
  var product = req.query.getproducts
  console.log(req.params)
  console.log(req.query)
  res.send(req.query.getproduct)
})

app.get('/join', function (req, res) {
  console.log(req.ip)
  var data = { ip: req.ip }
  db.clientdb.find(data, function (err, docs) {
    if (docs.length > 0) {
      console.log("Client already exists!")
      data.message = "Client already exists!"
      res.send(data);
    } else {
      console.log("new client!")
      db.clientdb.insert(data, function (err, newDoc) {
        console.log(err, newDoc)
        data.message = "Successfully joined server!"
        app.emit('new_client', req.ip)
        res.send(data);
      });
    }
  })
  // res.send({ ip: req.ip })
})

app.get('/getclients', function (req, res) {
  var responsedata = {
    msg: '',
    clients: []
  };
  db.clientdb.find({}, function (err, docs) {
    if (err) {
      responsedata.msg = 'Failed to fetch Client list';
      res.send(responsedata)
    } else {
      responsedata.msg = 'Client list successfully fetched';
      responsedata.clients = docs;
      res.send(responsedata)
    }
  })
})
app.post('/addbarcodeproduct', function (req, res) {
  // console.dir(req.body);
  db.barcodeproductdb.insert(req.body, function (err, newDoc) {   // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})

app.get('/checkifserver', function (req, res) {
  res.send({ message: 'yes iam the server' })
})

app.post('/addmasterproduct', function (req, res) {
  console.dir(req.body);
  db.masterproductdb.insert(req.body, function (err, newDoc) {   // Callback is optional
    res.send({ message: 'yes iam the server' })
  });

})
app.post('/updatemasterproduct', function (req, res) {
  console.dir(req.body);
  db.masterproductdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(req.body) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/addmasteroption', function (req, res) {
  console.dir(req.body);
  db.masteroptiondb.insert(req.body, function (err, newDoc) {   // Callback is optional
  });
  res.send({ message: 'yes iam the server' })
})
app.post('/updatemasteroption', function (req, res) {
  console.dir(req.body);
  db.masteroptiondb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/updatemasteroptiongroup', function (req, res) {
  console.dir(req.body);
  db.masteroptiongroupdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/addmasteroptiongroup', function (req, res) {
  console.dir(req.body);
  db.masteroptiongroupdb.insert(req.body, function (err, newDoc) {   // Callback is optional
  });
  res.send({ message: 'yes iam the server' })
})
app.get('/masteroption', function (req, res) {
  console.dir(req.body);
  db.masteroptiondb.find({}, function (err, newDoc) {   // Callback is optional
    res.send(newDoc)
  });
})
app.get('/masteroptiongroup', function (req, res) {
  console.dir(req.body);
  db.masteroptiongroupdb.find({}, function (err, newDoc) {   // Callback is optional
    res.send(newDoc)
  });
})
app.get('/getmasterproduct', function (req, res) {
  db.masterproductdb.find({}, function (err, data) {   // Callback is optional
    res.send(data)
  });
})
app.get('/getmastercategory', function (req, res) {
  console.dir(req.body);
  db.mastercategorydb.find({}, function (err, newDoc) {
    res.send(newDoc)
  });
})
app.get('/gettaxgroup', function (req, res) {
  console.dir(req.body);
  db.taxgroupdb.find({}, function (err, newDoc) {
    res.send(newDoc)
  });
})
app.get('/getunit', function (req, res) {
  console.dir(req.body);
  db.unitdb.find({}, function (err, newDoc) {
    res.send(newDoc)
  });
})
app.get('/getproducttype', function (req, res) {
  console.dir(req.body);
  db.producttypedb.find({}, function (err, newDoc) {
    res.send(newDoc)
  });
})
app.get('/getproductbyid', function (req, res) {
  console.log(req.body, req.query.id, { _id: req.query.id });
  db.masterproductdb.findOne({ _id: req.query.id }, function (err, newDoc) {
    res.send(newDoc)
  });
})
app.get('/updatemasterproduct', function (req, res) {
  db.masterproductdb.remove({}, { multi: true }, function (err, newDoc) {
    axios.get('https://biz1retail.azurewebsites.net/api/Product/getmasterproducts?CompanyId=1')
      .then(response => {
        console.log(response.data)
        db.masterproductdb.insert(response.data, function (err, newDoc) {   // Callback is optional
          var obj = { status: 200, message: "masterproduct db reset success" }
          res.send(obj)
        });
      })
      .catch(error => {
        var obj = { status: 500, message: "masterproduct db reset failed", error: error }
        res.send(obj)
      })

  });
})


app.get('/getorderlogs', function (req, res) {
  db.orderlogsdb.find({}, function (err1, logs) {   // Callback is optional
    res.send(logs)
  })
});

app.post('/saveorderdb', function (req, res) {
  var i = 0
  db.orderdb.insert(req.body.order, function (err, newDoc) {
    i++ // Callback is optional
    if (i == 1)
      res.send({ message: 'data updated successfully' })
  });
  // productdb.insert(req.body.products, function (err, newDoc) {   // Callback is optional
  //     i++ // Callback is optional
  //     if (i == 2)
  //         res.send({ message: 'data updated successfully' })
  // });
  if (req.body.order.OrderType == 6) {
    req.body.order.Items.forEach(item => {
      db.productdb.findOne({ _id: item._id }, function (err, newDoc) {
        newDoc.quantity -= item.OrderQuantity
        console.log(newDoc.quantity, item.OrderQuantity)
        db.productdb.update({ _id: newDoc._id }, newDoc, { upsert: false }, function (err, docs) {
          console.log(docs)
        });
      });
    });
  }
})

// app.post('/addtaxgroup', function (req, res) {
//     console.dir(req.body);
//     taxgroupdb.insert(req.body, function (err, newDoc) {   // Callback is optional
//         res.send({ message: 'yes iam the server' })
//     });
// })
// app.post('/updatetaxgroup', function (req, res) {
//     console.dir(req.body);
//     taxgroupdb.update(req.body, function (err, newDoc) {   // Callback is optional
//         res.send({ message: 'yes iam the server' })
//     });
// })
app.post('/updatetaxgroup', function (req, res) {
  console.dir(req.body);
  db.taxgroupdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/updatevariantgroup', function (req, res) {
  console.dir(req.body);
  db.masteroptiongroupdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/updatevariant', function (req, res) {
  console.dir(req.body);
  db.masteroptiondb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/updatecategories', function (req, res) {
  console.dir(req.body);
  db.categoriesdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
app.post('/updatemasterproduct', function (req, res) {
  console.dir(req.body);
  db.masterproduct.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})

app.post('/syncproducts', function (req, res) {
  console.dir(req.body);
  db.productdb.insert(req.body, function (err, newDoc) {   // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
// app.get('/getorders', function (req, res) {
//     console.dir(req.body);
//     orderdb.find({ OrderType: +req.query.typeid }, function (err1, docs) {   // Callback is optional
//         res.send(docs)
//     })
// })
app.get('/getorders', function (req, res) {
  console.log(req.ip, req.hostname)
  db.orderdb.find({ status: "N" }, function (err1, docs) {   // Callback is optional
    res.send(docs)
  })
});
app.post('/saveorder', function (req, res) {
  console.log(req.ip, req.hostname)
  req.body.status = "N"
  db.orderdb.insert(req.body, function (err1, newDoc) {   // Callback is optional
    res.send({ msg: "success" })
  })
});

app.post('/updateorder', function (req, res) {
  db.orderdb.update({ _id: req.body._id }, req.body, function (err1, newDoc) {   // Callback is optional
    db.transactionsdb.remove({ InvoiceNo: req.body.InvoiceNo }, { multi: true }, function (err, num) {
    })
    res.send({ msg: "success" })
  })
});

app.post('/deleteorder', function (req, res) {
  console.log(req.query)
  var i = 0
  db.orderdb.remove({ _id: req.query._id }, function (err1, newDoc) {   // Callback is optional.
    i++
    if (i == 2) res.send({ msg: "success" })
  })
  db.stockbatchdb.insert(req.body, function (err1, newDoc) {
    i++
    if (i == 2) res.send({ msg: "success" })
  })
});

app.post('/updatepreference', function (req, res) {
  console.dir(req.body);
  db.preferencedb.update({ companyId: req.body.companyId }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})

app.post('/saveStockBatch', function (req, res) {
  console.log("qwerty", req.body)
  if (req.body) {
    // stockbatchdb.insert(req.body, function (err, newDoc) {
    var i = 0
    db.taxgroupdb.find({}, function (err, docs) {
      req.body.forEach(sb => {
        db.stockbatchdb.update({ stockBatchId: sb.stockBatchId }, sb, { upsert: true }, function (sberr, sbch) {
          var products = []
          var obj = {
            "product": sb.productName,
            "barcodeId": sb.batch.barcodeId,
            "productId": sb.batch.productId,
            "barCode": sb.batch.barCode,
            "price": sb.batch.price,
            "tax1": docs.filter(x => x.id == sb.batch.product.taxGroupId)[0].tax1,
            "tax2": docs.filter(x => x.id == sb.batch.product.taxGroupId)[0].tax2,
            "tax3": docs.filter(x => x.id == sb.batch.product.taxGroupId)[0].tax3,
            "isInclusive": docs.filter(x => x.id == sb.batch.product.taxGroupId)[0].isInclusive,
            "stockBatchId": sb.stockBatchId,
            "quantity": sb.quantity,
            "createdDate": sb.createdDate
          }
          db.productdb.update({ stockBatchId: sb.stockBatchId }, obj, { upsert: true }, function (perr, prdt) {
            i++
            if (i == req.body.length) res.send({ msg: "success" })
          })
          products.push(obj)
        })
      })
    })
    // });
  } else {
    res.send({ msg: "empty or invalid payload" })
  }
})
// app.get('/getpurchaseorders', function (req, res) {
//     console.log(req.ip, req.hostname)
//     orderdb.find({ OrderType: +req.query.typeid }, function (err1, docs) {   // Callback is optional
//         res.send(docs)
//     })
// });
app.post('/updatepurchaseorder', function (req, res) {
  db.orderdb.update({ _id: req.body._id }, req.body, function (err1, newDoc) {   // Callback is optional
    console.log(err1, newDoc, req.body._id, req.body.status)
    res.send({ msg: "success" })
  })
});
app.post('/updatevendors', function (req, res) {
  console.dir(req.body);
  db.vendorsdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
})
// app.post('/addcategories', function (req, res) {
//     console.dir(req.body);
//     categoriesdb.insert(req.body, function (err, newDoc) {   // Callback is optional
//     });
//     res.send({ message: 'yes iam the server' })
// })

app.get('/getpreference', function (req, res) {
  db.preferencedb.find({}, function (err, docs) {
    res.send(docs)
  });
})

function updateproductdb(product_list) {
  console.log(product_list)
  db.masterproductdb.remove({}, { multi: true }, function (err, num) {
    console.log("db clean", err, num)
    db.masterproductdb.insert(product_list, function (err, newDoc) {   // Callback is optional
      var obj = { status: 200, message: "masterproduct db reset success" }
    });
  })
}
function updatevariantdb(variant_list) {
  console.log(variant_list)
  db.masteroptiondb.remove({}, { multi: true }, function (err, num) {
    console.log("db clean", err, num)
    db.masteroptiondb.insert(variant_list, function (err, newDoc) {   // Callback is optional
      var obj = { status: 200, message: "masteroption db reset success" }
    });
  })
}
function updatevariantgroupdb(variantgroup_list) {
  console.log(variantgroup_list)
  db.masteroptiongroupdb.remove({}, { multi: true }, function (err, num) {
    console.log("db clean", err, num)
    db.masteroptiongroupdb.insert(variantgroup_list, function (err, newDoc) {   // Callback is optional
      var obj = { status: 200, message: "masterproduct db reset success" }
    });
  })
}
// app.get('/updatevariantgroup', function (req, res) {
//     masteroptiongroupdb.remove({}, { multi: true }, function (err, newDoc) {
//         axios.get('https://biz1retail.azurewebsites.net/api/Product/getvariantgroups?CompanyId=1')
//             .then(response => {
//                 console.log(response.data)
//                 masteroptiongroupdb.insert(response.data, function (err, newDoc) {   // Callback is optional
//                     var obj = { status: 200, message: "optiongroup db reset success" }
//                     res.send(obj)
//                     // loadatabase();
//                 });
//             })
//             .catch(error => {
//                 var obj = { status: 500, message: "optiongroup db reset failed", error: error }
//                 res.send(obj)
//                 // loadatabase();
//             })

//     });
// })
app.get('/updatevariant', function (req, res) {
  db.masteroptiondb.remove({}, { multi: true }, function (err, newDoc) {
    axios.get('https://biz1retail.azurewebsites.net/api/Product/getvariants?CompanyId=1')
      .then(response => {
        console.log(`statusCode: ${response.statusCode}`)
        db.masteroptiondb.insert(response.data, function (err, newDoc) {   // Callback is optional
          console.log("db updated");
          var obj = { status: 200, message: "option db reset success" }
          res.send(obj)
        });
      })
      .catch(error => {
        var obj = { status: 500, message: "option db reset failed", error: error }
        res.send(obj)
      })

  });
})
app.post('/addcustomer', function (req, res) {
  db.customerdb.update({ phoneNo: req.body.phoneNo }, req.body, { upsert: true }, function (err, newDoc) {   // Callback is optional
    console.log("db updated");
    var obj = { status: 200, message: "customer db reset success" }
    res.send(obj)
  });
})
app.post('/setorderkey', function (req, res) {
  db.orderkeydb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newdoc) {
    var obj = { status: 200, msg: "data added succesfully" }
    res.send(obj)
  });
});

// customerdb.remove({}, { multi: true }, function (err, newDoc) {
//         axios.get('https://biz1retail.azurewebsites.net/api/Customer/GetCustomerList?CompanyId=1')
//             .then(response => {
//                 console.log(`statusCode: ${response.statusCode}`)
//                 customerdb.insert(response.data, function (err, newDoc) {   // Callback is optional
//                     console.log("db updated");
//                     var obj = { status: 200, message: "option db reset success" }
//                     res.send(obj)
//                 });
//             })
//             .catch(error => {
//                 var obj = { status: 500, message: "option db reset failed", error: error }
//                 res.send(obj)
//             })

//     });

app.post('/updatecustomer', function (req, res) {
  console.dir(req.body);
  db.customerdb.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, newDoc) {
    console.log(newDoc) // Callback is optional
    res.send({ message: 'yes iam the server' })
  });
});


app.get('/syncdata', function (req, response) {
  var actioncount = 6;
  var currentcount = 0;
  var obj = { status: 200, message: "Success" }
  db.masterproductdb.find({}, function (err, data) {
    if (err) return;
    var dbdata = data;
    var adddata = dbdata.filter(x => x.action == "A");
    var udata = dbdata.filter(x => x.action == "U");
    console.log(adddata.length, udata.length)
    if (adddata.length > 0) {
      axios
        .post('https://biz1retail.azurewebsites.net/api/Product/bulkaddproduct', adddata)
        .then(res => {
          // console.log(res)
          currentcount++;
          if (res.data.status == 200) {
            updateproductdb(res.data.product_list)
          }
          if (currentcount == actioncount) response.send(obj);
        })
        .catch(error => {
          console.error(error)
          currentcount++;
          if (currentcount == actioncount) response.send(obj);
        })
    } else {
      currentcount++;
      if (currentcount == actioncount) response.send(obj);
    }
    if (udata.length > 0) {
      axios
        .post('https://biz1retail.azurewebsites.net/api/Product/bulkupdateproduct', udata)
        .then(res => {
          console.log(`statusCode: ${res.statusCode}`)
          currentcount++;
          if (res.data.status == 200) {
            updateproductdb(res.data.product_list)
          }
          if (currentcount == actioncount) response.send(obj);
        })
        .catch(error => {
          console.error(error)
          currentcount++;
          if (currentcount == actioncount) response.send(obj);
        })
    } else {
      currentcount++;
      if (currentcount == actioncount) response.send(obj);
    }

  })
  // masteroptiondb.find({}, function (err, data) {
  //     if (err) return;
  //     var dbdata = data;
  //     var adddata = dbdata.filter(x => x.action == "A");
  //     var udata = dbdata.filter(x => x.action == "U");
  //     console.log(adddata.length, udata.length)
  //     if (adddata.length > 0) {
  //         axios
  //             .post('https://biz1retail.azurewebsites.net/api/Product/bulkaddoption', adddata)
  //             .then(res => {
  //                 console.log(res.data)
  //                 currentcount++;
  //                 if (res.data.status == 200) {
  //                     updatevariantdb(res.data.variant_list)
  //                 }
  //                 if (currentcount == actioncount) response.send(obj);
  //             })
  //             .catch(error => {
  //                 console.error(error)
  //                 currentcount++;
  //                 if (currentcount == actioncount) response.send(obj);
  //             })
  //     } else {
  //         currentcount++;
  //         if (currentcount == actioncount) response.send(obj);
  //     }
  //     if (udata.length > 0) {
  //         axios
  //             .post('https://biz1retail.azurewebsites.net/api/Product/bulkupdateoption', udata)
  //             .then(res => {
  //                 console.log(res)
  //                 currentcount++;
  //                 if (res.data.status == 200) {
  //                     updatevariantdb(res.data.variant_list)
  //                 }
  //                 if (currentcount == actioncount) response.send(obj);
  //             })
  //             .catch(error => {
  //                 console.error(error)
  //                 currentcount++;
  //                 if (currentcount == actioncount) response.send(obj);
  //             })
  //     }
  //     else {
  //         currentcount++;
  //         if (currentcount == actioncount) response.send(obj);
  //     }

  // })
  masteroptiongroupdb.find({}, function (err, data) {
    if (err) return;
    var dbdata = data;
    var adddata = dbdata.filter(x => x.action == "A");
    var udata = dbdata.filter(x => x.action == "U");
    if (adddata.length > 0) {
      console.log(adddata)
      axios
        .post('https://biz1retail.azurewebsites.net/api/Product/bulkaddoptiongroup', adddata)
        .then(res => {
          console.log(res.data)
          currentcount++;
          if (res.data.status == 200) {
            updatevariantgroupdb(res.data.variantgroup_list)
          }
          if (currentcount == actioncount) response.send(obj);
        })
        .catch(error => {
          console.error(error)
          currentcount++;
          if (currentcount == actioncount) response.send(obj);
        })
    }
    else {
      currentcount++;
      if (currentcount == actioncount) response.send(obj);
    }

    if (udata.length > 0) {
      axios
        .post('https://biz1retail.azurewebsites.net/api/Product/bulkupdateoptiongroup', udata)
        .then(res => {
          console.log()
          currentcount++;
          if (res.data.status == 200) {
            updatevariantgroupdb(res.data.variantgroup_list)
          }
          if (currentcount == actioncount) response.send(obj);
        })
        .catch(error => {
          console.error(error)
          currentcount++;
          if (currentcount == actioncount) response.send(obj);
        })
    } else {
      currentcount++;
      if (currentcount == actioncount) response.send(obj);
    }


  })
})

// pre save order
app.get('/getpreorders', function (req, res) {
  db.preordersdb.find({ status: "P" }, function (err1, docs) {   // Callback is optional
    console.log('Line: 195', err1)
    res.send(docs)
  })
});
app.post('/updatepreorder', function (req, res) {
  db.preordersdb.update({ _id: req.body._id }, req.body, function (err1, newDoc) {   // Callback is optional
    console.log("Line: 218", err1, newDoc, req.body._id, req.body.status)
    if (req.body.status == "S")
      db.transactionsdb.remove({ InvoiceNo: req.body.InvoiceNo }, { multi: true }, function (err, num) { })

    // db.transactions.update({ InvoiceNo: req.body.InvoiceNo }, { $set: { "saved": true } }, { multi: true }, function (err, num) { })
    res.send({ msg: "success" })
  })
});
app.get('/transactionsbyinvoice', function (req, res) {
  db.transactionsdb.find({ InvoiceNo: req.query.InvoiceNo }, function (err, trnxns) {
    res.send(trnxns)
  })
});
app.post('/addtransaction', function (req, res) {
  db.transactions.insert(req.body, function (err, trnxns) {
    res.send({ message: "Transaxn save success" })
  })
});

app.post('/logorderevent', function (req, res) {
  db.orderlogsdb.insert(req.body, function (err1, newDoc) {   // Callback is optional
    if (err1) {
      error_log(req.body, err1)
    }
    res.send({ msg: "success" })
  })
});
app.post('/logtransactions', function (req, res) {
  db.transactionlogsdb.insert(req.body, function (err1, newDoc) {   // Callback is optional
    res.send({ msg: "success" })
  })
});

app.post('/getdbdata', function (req, res) {
  var data = {}
  var i = 0
  var j = req.body.length
  req.body.forEach(dbname => {
    db[dbname].find({}, function (err, docs) {
      console.log(dbname, err, docs.length, i, j)
      data[dbname] = docs
      i++
      if (i == j) res.send(data)
    });
  })
});

app.post('/updateprintersettings', function (req, res) {
  db.printersettings.update({ _id: req.body._id }, req.body, { upsert: true }, function (err, docs) {
    var obj = { status: 200, msg: "data added succesfully" }
    res.send(obj)
  });
});

app.post('/savepreorder', function (req, res) {
  console.log(req.ip, req.hostname)
  req.body.status = "P"
  db.preordersdb.insert(req.body, function (err1, newDoc) {   // Callback is optional
    console.log('Line: 188', err1)
    res.send({ msg: "success" })
  })
});


app.get('/getloginfo', function (req, res) {
  db.loginfo.findOne({}, function (err, doc) {
    res.send(doc)
  })
})
app.post('/setstoredata', function (req, res) {
  var i = 0
  var obj = { mas: "success" }
  db.orderkeydb.remove({}, { multi: true }, function (err, numberRemoved) {
    const orderkey = { orderno: req.body.orderkey[0].orderno + 1, GSTno: "", timestamp: new Date().getTime() }
    db.orderkeydb.insert(orderkey, function (err, newDoc) {   // Callback is optional
      console.log("loginfo", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  })
  db.loginfo.remove({}, { multi: true }, function (err, numberRemoved) {
    db.loginfo.insert(req.body.logInfo, function (err, newDoc) {   // Callback is optional
      console.log("loginfo", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  })
  db.customerdb.remove({}, { multi: true }, function (err, numRemoved) {
    // numRemoved = 1
    db.customerdb.insert(req.body.customer, function (err, newDoc) {   // Callback is optional
      console.log("customerdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });

  db.productdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.productdb.insert(req.body.product, function (err, newDoc) {   // Callback is optional
      console.log("productdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.barcodeproductdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.barcodeproductdb.insert(req.body.barcodeProduct, function (err, newDoc) {   // Callback is optional
      console.log("barcodeproductdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.vendorsdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.vendorsdb.insert(req.body.vendor, function (err, newDoc) {   // Callback is optional
      console.log("vendorsdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.categoriesdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.categoriesdb.insert(req.body.categories, function (err, newDoc) {   // Callback is optional
      console.log("categoriesdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.taxgroupdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.taxgroupdb.insert(req.body.taxGroup, function (err, newDoc) {   // Callback is optional
      console.log("taxgroupdb", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.masteroptiongroupdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.masteroptiongroupdb.insert(req.body.variantGroup, function (err, newDoc) {   // Callback is optional
      console.log("variantGroup", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.masteroptiondb.remove({}, { multi: true }, function (err, numRemoved) {
    db.masteroptiondb.insert(req.body.variant, function (err, newDoc) {   // Callback is optional
      console.log("variant", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.masterproductdb.remove({}, { multi: true }, function (err, numRemoved) {
    db.masterproductdb.insert(req.body.masterproduct, function (err, newDoc) {   // Callback is optional
      console.log("masterproduct", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });
  db.preferencedb.remove({}, { multi: true }, function (err, numRemoved) {
    db.preferencedb.insert(req.body.preference, function (err, newDoc) {   // Callback is optional
      console.log("preference", i)
      i++
      if (i == 11)
        res.send(obj)
    });
  });

});

// app.post('/addmasterproduct', function (req, res) {
//     console.dir(req.body);
//     masterproductdb.insert(req.body, function (err, newDoc) {   // Callback is optional
//                     });
//     res.send({ message: 'yes iam the server' })
// })
// app.post('/addmasterproduct', function (req, res) {
//     console.dir(req.body);
//     masterproductdb.insert(req.body, function (err, newDoc) {   // Callback is optional
//                     });
//     res.send({ message: 'yes iam the server' })
// })
function removeclient(id) {
  db.clientdb.remove({ _id: id }, {}, function (err, numRemoved) {
    // numRemoved = 1
  });
}
function stopserver() {
  app.removeAllListeners();
  server.close();
  server.once('close', () => console.log('Server stopped'));

}
// var server = app.listen(8081, ip.address(), function () {
//     var host = server.address().address
//     var port = server.address().port
//     console.log("Example app listening at http://%s:%s", host, port)
// })

var server;

function startServer() {
  app.on('getserverip', (data) => {
    console.log(server)
    app.emit('appstarted', server.address())
  })
  server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
    app.emit('appstarted', server.address())
  })
}
startServer();
// app.listen = function () {
//     var server = http.createServer(this);
//     return server.listen.apply(server, arguments);
// };
// startServer();

module.exports = {
  startserver() {
    return startServer();
  },
  app,
  removeclient(id) {
    return removeclient(id)
  },
  stopserver() {
    return stopserver()
  }
}
