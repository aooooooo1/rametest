const jwt = require('jsonwebtoken');
const db = require('../config/db');

const valiUser = (req, res, next)=>{
    const { token } = req.cookies;
    console.log('가져온 쿠키', token);
    if (!token) {
        console.log('토큰이 없습니다. 상황 끝');
        return res.status(403).send('토큰없음');
    } else {
        const { user_id } = jwt.verify(token, 'secure');
        db.query('select * from user_table where user_id=?', [user_id], (er, results) => {
            console.log('쿼리실행결과: ',results[0].user_id);
            if(results[0]){
                next();
            }
        });
    }
}
module.exports = {
    valiUser,
};
