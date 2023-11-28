const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
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
        res.send(results)
        res.status(200)
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
    const sql = "delete from nations_table where id=?";
    db.query(sql, [id], (er, results)=>{
        console.log(er);
        console.log('삭제가 완료 되었습니다.',results);
        res.sendStatus(200);
    })
})
app.listen(PORT, ()=>{
    console.log(`${PORT} 서버실행`);
})