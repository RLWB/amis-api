const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:"*",
}));
// 引入user路由
const userRouter = require('./users');

app.use('/api', userRouter); 

app.listen(3001, () => {
  console.log('Server is running at http://localhost:3001');
});


    
