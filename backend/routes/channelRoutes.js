const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nano = require('nano')('http://utsav:xyz2002%@127.0.0.1:5984');

var channelRoutesspace = channelRoutesspace || {};

channelRoutesspace.dbName = 'channels';

async function initialize(){

try{
    await nano.db.create(channelRoutesspace.dbName);
}
catch(err){
    console.log(err.message);
}
} 
initialize();//initialize every time used.

const channeldb = nano.db.use(channelRoutesspace.dbName); 


//get all the document from the channel databases
router.get('/', async (req, res) => {
  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const result = await channeldb.list({ include_docs: true });
    const channels = [];
    if(result.rows ){
      for(var i=0;i< result.rows.length;i++){
        channels.push(result.rows[i].doc);
      }
    }

    res.status(200).json({data:channels,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)
        // res.status(500).json({
        //     msg: 'internal server error',
        //     err: err.message
        // })

        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

});


//get all the document from the post databases
router.get('/search_content/:pattern', async (req, res) => {
  let pattern = req.params.pattern;
  console.log(1);
  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const result = await channeldb.find({selector:{$or:[{name:{$regex:pattern}},{description:{$regex:pattern}}]}});
    // const posts = [];
    // if(result.rows ){
    //   for(var i=0;i< result.rows.length;i++){
    //     posts.push(result.rows[i].doc);
    //   }
    // }

    res.status(200).json({data:result.docs,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)
        // res.status(500).json({
        //     msg: 'internal server error',
        //     err: err.message
        // })

        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

});

router.get('/single/:id', async (req, res) =>{
  try {
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const channelId = req.params.id;
    // Retrieve the user by ID
    const channels = await channeldb.get(channelId);
    res.status(200).json(channels);
  } catch (error) {
    console.error('Error getting user:', error);

    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'channel not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


 
// create a new document in channel databases
router.post('/', async (req, res) =>{

try{
  
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);

  const newChannel = req.body;
  newChannel.username = username;
  newChannel.timestamp = new Date().now;

  const response = await channeldb.insert(newChannel);
  res.status(200).json({ success: true, response });
}catch (err) {
  console.log(err)
  res.status(500).json({
      msg: 'internal server error',
      err: err.message
  })
}

})

// update any channel in the channel database

router.patch('/:id', async (req, res) => {
  try {
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const channelId = req.params.id;
    const existingChannel = await userdb.get(channelId);
    Object.assign(existingChannel, req.body);
    const response = await userdb.insert(existingChannel, channelId);
    res.status(200).json({ success: true, response });

  } catch (error) {
    console.error('Error getting user:', error);
    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'channel not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


// delete a channel by ID
router.delete('/:id', async (req, res) => {
  try {
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const channelId = req.params.id;
    const existingChannel = await channeldb.get(channelId);
    const response = await userdb.destroy(channelId, existingChannel._rev);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error getting user:', error);

    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'channel not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


  module.exports = router;