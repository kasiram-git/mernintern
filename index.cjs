/**
 * git clone <link>
 * 
 * (add .gitignore file)
 * 
 * git add .
 * git commit -m "any msg"
 * git push origin main
 * 
 * git config --global user.name '<username>'
 * git config --global user.email <emailId>
 */

/**
 * Expense Tracker
 * 
 * Features and end points
 * 
 * Adding a new expense/income : /add-expense -> post
 * Displaying existing expenses : /get-expenses -> get
 * Editing existing entries : /edit-expense -> patch/put
 * Deleting expenses : /delete-expense -> delete
 * 
 * Budget reporting
 * Creating new user
 * Validating user
 * 
 * Defining schema
 * category, amount, date 
 */




const express =require('express')
const mongo =require('mongoose')
const parse =require('body-parser')
const {Expense} =require('./schema')
const { request } = require('http')
const cors=require('cors')


const app=express()
app.use(parse.json())
app.use(cors())

async function connectToDb(){
  try{
    await mongo.connect('mongodb+srv://atlas:atlas@cluster0.9hbsyjq.mongodb.net/Expense?retryWrites=true&w=majority&appName=Cluster0')
   
    console.log("Db connected :) ")
    const port = process.env.PORT || 8001
 
 app.listen(port,function(){
     console.log("Runnning Port 8001. . .")
 }) 
  }catch(error){
    console.log(error)
    console.log("Couldn't establish connection")
  }

}
connectToDb()

//user inputs posting
app.post('/add-expense',async function(request,response){
  try{
    await Expense.create({
        "amount":request.body.amount,
        "category":request.body.category,
        "date":request.body.date
  })
  response.status(201).json({
   "status":"success"
  })
  }catch(error){
    response.status(500).json({
        "status":"failure",
        "error":error
       })
  }
})

//user getting the response 
app.get('/get-expense',async function(request,response){
try{
  const expenseData = Expense.find() //async fn
  response.status(200).json(expenseData)
}catch(error){
  response.status(500).json({
   "status":"failure",
   "message":"could not fetch entries",
   "error":error
   })
 }
})

//Delete the user entry
app.delete('/delete-expense/:id',async function(request,response){
 const expenseData = await Expense.findById(request.params.id)
try{
  if(expenseData){
    await Expense.findByIdAndDelete(request.params.id)
    response.status(200).json({
      "status": "success",
      "message":"Deleted Entry successfullly"
    })
  }
      else{
        response.status(404).json({
         "status":"Failure",
         "message":"Could't find the document"
        })
      }
}catch(error){
   response.status(500).json({
    "status":"failure",
    "message":"could not delete entry",
    "error":error
   })
  }
})

//Edit the user entry
app.patch('/edit-expense/:id', async function(request, response) {
  try {
      const expenseEntry = await Expense.findById(request.params.id)
      if(expenseEntry) {
          await expenseEntry.updateOne({
              "amount" : request.body.amount,
              "category" : request.body.category,
              "date" : request.body.date
          })
          response.status(200).json({
              "status" : "success",
              "message" : "updated entry"
          })
      } else {
          response.status(404).json({
              "status" : "failure",
              "message" : "could not find entry"
          })
      }
  } catch(error) {
      response.status(500).json({
          "status" : "failure",
          "message" : "could not delete entry",
          "error" : error
      })
  }
})
