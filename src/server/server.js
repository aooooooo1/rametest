const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
app.use(express.json());
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 4000;
const db = require('./config/db');

app.get('/', (req, res)=>{
    console.log('root');
})
//데이터 가져오기
app.get('/movies', (req, res)=>{
    console.log('/movies, 서버가 반응함, ');
    db.query('select * from nations_table', (er, results)=>{
        console.log('movies 에러 ',er);
        res.status(200).send(results);
        console.log('정상적으로 데이터를 가져옵니다.');
    })
})
// 상세보기
app.get('/movies/:id', (req,res)=>{
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
app.post("/api/save",(req, res)=>{
    const {name , capital, population} = req.body;
    const populationInt = parseInt(population);
    const sql = "insert into nations_table(name, capital, population) values(?,?,?)";
    db.query(sql, [name, capital, populationInt], (er, results)=>{
        console.log(er);
        console.log('등록 되었습니다.',results);
        res.sendStatus(200);
    })
})
//삭제
app.delete("/api/delete/:id", (req,res)=>{
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
    console.log(match);
    if(match){
        res.status(200).send('로그인 성공');
    }else{
        res.status(403).send('비밀번호가 일치하지 않습니다.');
    }
})

app.listen(PORT, ()=>{
    console.log(`${PORT} 서버실행==============================`);
})