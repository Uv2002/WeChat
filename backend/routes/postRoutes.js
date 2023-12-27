const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nano = require('nano')('http://utsav:xyz2002%@127.0.0.1:5984');

var postRoutesspace = postRoutesspace || {};

postRoutesspace.dbName = 'posts';

async function initialize(){

try{
    await nano.db.create(postRoutesspace.dbName);
}
catch(err){
    console.log(err.message);
}
} 
initialize();//initialize every time used.

const postdb = nano.db.use(postRoutesspace.dbName); 


//get all the document from the post databases
router.get('/most_least_post', async (req, res) => {
  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const result = await postdb.list({ include_docs: true });
    const posts = [];
    if(result.rows ){
      for(var i=0;i< result.rows.length;i++){

        posts.push(result.rows[i].doc);
      }
    }

    console.log(posts.length);

    var max=0,max_username,min=50000,min_username;
    let data = {};
    for(var i =0;i<posts.length;i++){
      if(data[posts[i].username]){
        data[posts[i].username]++;
      }
      else{
        data[posts[i].username]=1;
      }
    }

    console.log(data);
    let dataKeys=Object.keys(data);
    for(var i in dataKeys ){
      console.log(dataKeys[i]);
      if(data[dataKeys[i]]>max){
        max = data[dataKeys[i]];
        max_username = dataKeys[i];
      }
      if(data[dataKeys[i]]<min){
        min = data[dataKeys[i]];
        min_username = dataKeys[i];
      }

    }
   
  
    const re = [{'min': min_username, 'max' :max_username}];
    res.status(200).json({data:re,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)
        

        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

});


//get all the document from the post databases
router.get('/search_content/:pattern', async (req, res) => {
  let pattern = req.params.pattern;

  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const result = await postdb.find({selector:{content:{$regex:pattern}}});

    res.status(200).json({data:result,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)

        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

});


//get all the document from the post databases
router.get('/search_user/:user', async (req, res) => {
  let username = req.params.user;

  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const result = await postdb.find({selector:{username}});
    
    res.status(200).json({data:result.docs,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)

        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

});


// get a single post from the post database

router.get('/single/:id', async (req, res) =>{
  try {

    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const postId = req.params.id;

    const query = {
      selector: {
        
        _id: postId,
        
      },
      
    };

    // Retrieve the user by ID
    const post = await postdb.find(query);
    console.log(post);
    res.status(200).json(post);
  } catch (error) {
    console.error('Error getting user:', error);

    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'post not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


router.get('/channel/:channel_id', async (req, res) =>{
  try {
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);

    const channelId = req.params.channel_id;

    console.log(channelId);

    const query = {
      selector: {
        
        channelId: channelId,
        
      },
      
    };

    // Retrieve the user by ID
    const post = await postdb.find(query);
    let pposts = post.docs;

    for( i in pposts){
      console.log(i);
      if(pposts[i].replyPost){
        console.log(pposts[i].replyPost);
        let t = await postdb.find({selector:{_id:pposts[i].replyPost}});
        if(t.docs.length>0){
          pposts[i].replyPost = t.docs[0];
        }
        console.log(t.docs);
        
      }
    }
    console.log(pposts);
   
    res.status(200).json({data:pposts,status:"success"});
  } catch (error) {
    console.error('Error getting user:', error);

    
  }
})



// create a new document in post databases
router.post('/', async (req, res) =>{
try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const postUser = req.body;

    let query = {selector:{
      channelId:postUser.channelId,
   }};

    let posts =  await postdb.find(query);
    console.log(posts.docs);
    postUser.seqence = posts.docs.length+1;
    postUser.timestamp = Date.now();
    postUser.username = username;
    postUser.likes=[]; // => addLikes(user,postId)
    postUser.dislikes=[];// => addDislike(user,postId)
    const response = await postdb.insert(postUser);
    res.status(200).json({ status:"success" });
}catch (err) {
  console.log(err)
  res.status(500).json({
      msg: 'internal server error',
      err: err.message
  })
}

});


router.patch('/like', async(req,res) =>{
  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const postUser = req.body;
    let query = {selector:{
      _id:postUser.postId,
   }};
   let post =  await postdb.find(query);
   console.log(post);
   if(!post.docs[0].likes.includes(username)){
    post.docs[0].likes.push(username);
   }
   if(post.docs[0].dislikes.includes(username)){
    post.docs[0].dislikes.splice(post.docs[0].dislikes.find(username),1);
   }
   let d=await postdb.insert(post.docs[0]);
   console.log(d);
   res.status(200).json({ status:"success" });
  }catch(err){
    console.log(err);
    res.status(200).json({ status:"failed",message:err.message });
 
  }
  
})

router.patch('/dislike', async(req,res) =>{
  try{
    let headers= req.headers;
    console.log(headers['authorization']);
    let jwt_header = headers['authorization'];
    let {username,roles} = jwt.decode(jwt_header.split(" ")[1]);
    console.log(username);
    console.log(roles);
    const postUser = req.body;
    let query = {selector:{
      _id:postUser.postId,
   }};
   let post =  await postdb.find(query);
   
   if(!post.docs[0].dislikes.includes(username)){
    post.docs[0].dislikes.push(username);
   }

   if(post.docs[0].likes.includes(username)){
    post.docs[0].likes.splice(post.docs[0].likes.find(username),1);
   }
   console.log(post);
   await postdb.insert(post.docs[0]);
   res.status(200).json({ status:"success" });
  }catch(err){
    console.log(err);
    res.status(200).json({ status:"failed",message:err.message });
  }
  
})




  module.exports = router;