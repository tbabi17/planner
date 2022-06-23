const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const { MongoClient } = require('mongodb');
const htmlDocx = require('html-docx-js');
const sluggify = require('slugify');
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb+srv://planner:PDcece0FHZvOnfrI@cluster0.aevzg.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = 'planner';
let db;

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error);

app.listen(8080, () => {
  console.log('server started!');
});
app.use(express.json());
app.use('/public', express.static('public'))
app.use('/node_modules', express.static('node_modules'))
app.use('/', router);

app.get('/',function(req,res) {
  res.sendFile('hello.html', { root: __dirname+'/public/' });
});

app.get('/main',function(req,res) {
  res.sendFile('main.html', { root: __dirname+'/public/' });
});

app.get('/doc', function(req, res) {
    let collection = db.collection('documents');
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        res.json(result);
      }
    });
});

app.post('/connect', function(req, res) {
    let collection = db.collection('users');
    collection.find({id: req.body.id}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        if (result.length == 0) {
            collection.insert(req.body);
        }

        res.json(result);
      }
    });
});

app.get('/doc/:user', function(req, res) {
    let collection = db.collection('documents');
    let users = db.collection('users');

    users.find({id: req.params.user}).toArray(function(err, result) {
      if (err) {

      } else {
        if (result.length>0 && result[0].isadmin) {
          collection.find({}).toArray(function (err, result) {
            if (err) {
              res.status(400).send("Error fetching listings!");
           } else {
              res.json(result);
            }
          });
        } else {
          collection.find({pr_user:req.params.user}).toArray(function (err, result) {
            if (err) {
              res.status(400).send("Error fetching listings!");
           } else {
              res.json(result);
            }
          });
        }
      }
    });


});

app.delete('/doc/:id', function(req, res) {
    let collection = db.collection('documents');
    collection.find({_id: ObjectID(req.params.id)}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        if (result.length > 0) {
          collection.deleteOne({_id: ObjectID(req.params.id)}, function(err, result) {
            res.json({'msg': 'Амжилттай устгалаа !'});
          });
        } else {
            res.json({'msg': 'Устгах үйлдэл амжилтгүй !'});
        }
      }
    });
});

app.post('/docx', function(req, res) {
  const docx = htmlDocx.asBlob(req.body.html);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=name.docx`);
  res.setHeader('Content-Length', docx.length);
  res.send(docx);
});

app.post('/doc', function(req, res) {
    let collection = db.collection('documents');
    console.log(req.body);
    req.body.pr_marketing_plan_price = !isNaN(req.body.pr_marketing_plan_price) ? req.body.pr_marketing_plan_price : parseFloat(req.body.pr_marketing_plan_price.replace('₮','').replaceAll(',',''));
    req.body.pr_loan_amount = !isNaN(req.body.pr_loan_amount) ? req.body.pr_loan_amount : parseFloat(req.body.pr_loan_amount.replace('₮','').replaceAll(',',''));
    req.body.pr_investment_plan.forEach((item, i) => {
      item.investment_cost = !isNaN(item.investment_cost) ? item.investment_cost : parseFloat(item.investment_cost.replace('₮','').replaceAll(',',''));
    });

    req.body.pr_assets.forEach((item, i) => {
      item.asset_evaluation = !item.asset_evaluation || !isNaN(item.asset_evaluation) ? item.asset_evaluation : parseFloat(item.asset_evaluation.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_competitors.forEach((item, i) => {
      item.competitor_price = !item.competitor_price || !isNaN(item.competitor_price) ? item.competitor_price : parseFloat(item.competitor_price.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_suppliers.forEach((item, i) => {
      item.supplier_price = !item.supplier_price || !isNaN(item.supplier_price) ? item.supplier_price : parseFloat(item.supplier_price.replace('₮','').replaceAll(',',''));
      item.supplier_transport_cost = !item.supplier_transport_cost || !isNaN(item.supplier_transport_cost) ? item.supplier_transport_cost : parseFloat(item.supplier_transport_cost.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_sales_sectors.forEach((item, i) => {
      item.sales_point_income =  !item.sales_point_income || !isNaN(item.sales_point_income) ? item.sales_point_income : parseFloat(item.sales_point_income.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_productions.forEach((item, i) => {
      item.production_price1 = !item.production_price1 || !isNaN(item.production_price1) ? item.production_price1 : parseFloat(item.production_price1.replace('₮','').replaceAll(',',''));
      item.production_price2 = !item.production_price2 || !isNaN(item.production_price2) ? item.production_price2 : parseFloat(item.production_price2.replace('₮','').replaceAll(',',''));
      item.production_price3 = !isNaN(item.production_price3) ? item.production_price3 : parseFloat(item.production_price3.replace('₮','').replaceAll(',',''));
      item.production_income1 = !isNaN(item.production_income1) ? item.production_income1 : parseFloat(item.production_income1.replace('₮','').replaceAll(',',''));
      item.production_income2 = !isNaN(item.production_income2) ? item.production_income2 : parseFloat(item.production_income2.replace('₮','').replaceAll(',',''));
      item.production_income3 = !isNaN(item.production_income3) ? item.production_income3 : parseFloat(item.production_income3.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_raw_materials.forEach((item, i) => {
      item.raw_cost1 = !item.raw_cost1 || !isNaN(item.raw_cost1) ? item.raw_cost1 : parseFloat(item.raw_cost1.replace('₮','').replaceAll(',',''));
      item.raw_cost2 = !item.raw_cost2 || !isNaN(item.raw_cost2) ? item.raw_cost2 : parseFloat(item.raw_cost2.replace('₮','').replaceAll(',',''));
      item.raw_cost3 = !item.raw_cost3 || !isNaN(item.raw_cost3) ? item.raw_cost3 : parseFloat(item.raw_cost3.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_salary_costs.forEach((item, i) => {
      item.salary_month1 = !isNaN(item.salary_month1) ? item.salary_month1 : parseFloat(item.salary_month1.replace('₮','').replaceAll(',',''));
      item.salary_month2 = !isNaN(item.salary_month2) ? item.salary_month2 : parseFloat(item.salary_month2.replace('₮','').replaceAll(',',''));
      item.salary_month3 = !isNaN(item.salary_month3) ? item.salary_month3 : parseFloat(item.salary_month3.replace('₮','').replaceAll(',',''));
      item.salary_year1 = !isNaN(item.salary_year1) ? item.salary_year1 : parseFloat(item.salary_year1.replace('₮','').replaceAll(',',''));
      item.salary_year2 = !isNaN(item.salary_year2) ? item.salary_year2 : parseFloat(item.salary_year2.replace('₮','').replaceAll(',',''));
      item.salary_year3 = !isNaN(item.salary_year3) ? item.salary_year3 : parseFloat(item.salary_year3.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_depreciation_costs.forEach((item, i) => {
      item.depreciation_cost_month = !isNaN(item.depreciation_cost_month) ? item.depreciation_cost_month : parseFloat(item.depreciation_cost_month.replace('₮','').replaceAll(',',''));
      item.depreciation_cost_year = !isNaN(item.depreciation_cost_year) ? item.depreciation_cost_year : parseFloat(item.depreciation_cost_year.replace('₮','').replaceAll(',',''));
      item.depreciation_total = !isNaN(item.depreciation_total) ? item.depreciation_total : parseFloat(item.depreciation_total.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_other_costs.forEach((item, i) => {
      item.other_costs_cost1 = !isNaN(item.other_costs_cost1) ? item.other_costs_cost1 : parseFloat(item.other_costs_cost1.replace('₮','').replaceAll(',',''));
      item.other_costs_cost2 = !isNaN(item.other_costs_cost2) ? item.other_costs_cost2 : parseFloat(item.other_costs_cost2.replace('₮','').replaceAll(',',''));
      item.other_costs_cost3 = !isNaN(item.other_costs_cost3) ? item.other_costs_cost3 : parseFloat(item.other_costs_cost3.replace('₮','').replaceAll(',',''));
    });
    req.body.pr_loan_dates.forEach((item, i) => {
      item.loan_rate_amount = !isNaN(item.loan_rate_amount) ? item.loan_rate_amount : parseFloat(item.loan_rate_amount.replace('₮','').replaceAll(',',''));
      item.loan_amount = !isNaN(item.loan_amount) ? item.loan_amount : parseFloat(item.loan_amount.replace('₮','').replaceAll(',',''));
      item.loan_balance = !isNaN(item.loan_balance) ? item.loan_balance : parseFloat(item.loan_balance.replace('₮','').replaceAll(',',''));
    });


    collection.find({_id: req.body._id}).toArray(function (err, result) {
      if (err) {
        res.status(400).send("Error fetching listings!");
     } else {
        console.log('result = '+result.length);
        if (result.length > 0) {
          // collection.replaceOne({_id: ObjectID(req.body._id)}, req.body, {w: "majority", wtimeout: 100}, function(err, result) {
          //   console.log(result);
          //   res.json({'msg': 'Өөрчлөлтийг амжилттай хадгаллаа !'});
          // });
          collection.deleteOne({_id: req.body._id}, function(err, result) {

          });

          collection.insert(req.body, function(err, result) {
            res.json({'msg': 'Амжилттай хадгалагдлаа !'});
          });
        } else {
          collection.insert(req.body, function(err, result) {
            res.json({'msg': 'Амжилттай хадгалагдлаа !'});
          });
        }
      }
    });
});
