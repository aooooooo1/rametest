const express = require('express');
const {valiUser} = require('./middleware/auth');
const session = require('express-session')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL ?? "https://testpdqo-test.netlify.app",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        optionsSuccessStatus: 200,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: 'None',
            secure: process.env.NODE_ENV === "production",
        }
    })
);
app.use(express.json());
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 4000;
const db = require('./config/db');

//데이터 가져오기
app.get('/api/movies',(req, res)=>{
    db.query('select * from nations_table', (er, results)=>{
        res.status(200).send(results);
        console.log('정상적으로 데이터를 가져옵니다.');
    })
})
// 상세보기
app.get('/api/movies/:id', (req,res)=>{
    console.log(req.params.id);
    const id = req.params.id;
    db.query('select * from nations_table where id=?',[id],(er,results)=>{
        if(er){
            console.log(er);
        }else{
            res.send(results)
        }
    })
})
//등록
app.post("/api/save",valiUser,(req, res)=>{
    const { token } = req.cookies;
    const { user_id } = jwt.verify(token, 'secure');
    const {name , capital, population, date} = req.body;
    const populationInt = parseInt(population);
    const sql = "insert into nations_table(name, capital, population, user_id, date_) values(?,?,?,?,?)";
    db.query(sql, [name, capital, populationInt, user_id, date], (er, results)=>{
        console.log(er);
        console.log('글이 등록 되었습니다.');
        res.sendStatus(200);
    })
})
//삭제
app.delete("/api/delete/:id", valiUser, (req,res)=>{
    const id = req.params.id;
    console.log('id');
    const sql = "delete from nations_table where id=?";
    db.query(sql, [id], (er, results)=>{
        console.log(er);
        console.log('삭제가 완료 되었습니다.',results);
        res.sendStatus(201);
    })
})
//회원가입
app.post("/api/register",async (req, res)=>{
    console.log(req.body);
    const {id, password} = req.body;
    const results = await new Promise((resolve, reject)=>{
        db.query("SELECT * FROM user_table WHERE user_id=?", [id], (er, results)=>{
            if(er){
                reject(er);
            }else{
                resolve(results);
            }
        });
    })
    console.log('results',results.length);
    if (results.length > 0) {
        console.log('401이미 아이디 존재함');
        return res.sendStatus(401);
    } else {
        const hashPw = await bcrypt.hash(password, 10);
        console.log(hashPw);
        const sql = "INSERT INTO user_table(user_id, password) VALUES (?, ?)";
        await db.query(sql, [id, hashPw]);
        console.log('등록됨');
        return res.sendStatus(201);
    }
})
//로그인
app.post("/api/login", async(req, res)=>{
    console.log(req.body);
    const user_id = req.body.id;
    const password = req.body.password;
    const result = await new Promise((resolve, reject)=>{
        db.query("select * from user_table where user_id=?", [user_id], (er, results)=>{
            if(er){
                reject(er)
            }else{
                resolve(results)
            }
        })
    })
    console.log(result.length);
    if(result.length === 0){
        return res.status(403).send('id가 존재하지 않습니다.')
    }
    const match = await bcrypt.compare(password, result[0].password);
    if(match){
        const token = jwt.sign({user_id},'secure');
        res.cookie('token',token,{path:'/'});
        const tokenUser_id = jwt.verify(token,'secure');
        res.send(tokenUser_id);
    }else{
        res.status(403).send('비밀번호가 일치하지 않습니다.');
    }
})

app.listen(PORT, ()=>{
    console.log(`${PORT} 서버실행==============================`);
})