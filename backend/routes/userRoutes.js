const express = require('express');
const router = express.Router();
const nano = require('nano')('http://utsav:xyz2002%@127.0.0.1:5984');
const bcrypt = require('bcrypt');

var userRoutesspace = userRoutesspace || {};

userRoutesspace.dbName = 'users';

async function initialize(){

try{
    await nano.db.create(userRoutesspace.dbName);
}
catch(err){
    console.log(err.message);
}
} 
initialize();//initialize every time used.

const userdb = nano.db.use(userRoutesspace.dbName); 


//get all the document from the user databases
router.get('/', async (req, res) => {
  try{
    const result = await userdb.list({ include_docs: true });
    const users = [];
    if(result.rows ){
      for(var i=0;i< result.rows.length;i++){
        users.push(result.rows[i].doc);
      }
    }

    res.status(200).json({data:users,status:"success",message:"all ok"});
    } catch (err) {
        console.log(err)
        res.status(200).json({
          message: err.message,
          status:'failed'
      })
    }

})

// get a single user from the database

router.get('/:id', async (req, res) =>{
  try {
    const userId = req.params.id;

    // Retrieve the user by ID
    const user = await userdb.get(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);

    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'User not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})

 
// create a new document in user databases
router.post('/', async (req, res) =>{
  const { user, pwd } = req.body;

  try {
      // Hash the password before saving it to CouchDB
      const hashedPassword = await bcrypt.hash(pwd, 10);

      // Create a new document in CouchDB
      await userdb.insert({ user, pwd: hashedPassword, roles: ['user'] });
      res.json({ message: 'User registered successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }

})

// update any user in the database

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await userdb.get(userId);
    Object.assign(existingUser, req.body);
    const response = await userdb.insert(existingUser, userId);
    res.status(200).json({ success: true, response });

  } catch (error) {
    console.error('Error getting user:', error);
    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'User not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


// delete a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await userdb.get(userId);
    const response = await userdb.destroy(userId, existingUser._rev);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error getting user:', error);

    if (error.statusCode && error.statusCode === 404) {
      res.status(404).json({ success: false, error: 'User not found' });
    } else {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
})


  module.exports = router;