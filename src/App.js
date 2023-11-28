import axios from "axios";
import "./App.css";
import { useCallback, useEffect, useState } from "react";

function App() {
    const port = 'http://localhost:4000'
    //데이터 불러오기
    const [movie, setMovie] = useState([]);
    const selectAll = useCallback( () => {
        axios.get(`${port}/movies`).then((result)=>{
            console.log('test');
            setMovie(result.data);
        }).catch((er)=>{
            console.log(er);
        })
    },[]);
    //상세데이터 불러오기
    const [movieDetail, setMovieDetail] = useState(null);
    const showMovieDetail = async (e, id) => {
        const result = await axios.get(`${port}/movies/${id}`);
        setMovieDetail(result.data[0]);
    };
    //폼 작성
    const [formData, setFormData]=useState({name:'',capital:'',population:''});
    const handleChange = (e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }
    //폼 서버 보네기
    const handleSubmit =  (e)=>{
        e.preventDefault();
        e.stopPropagation();
        axios.post(`${port}/api/save`, formData).then(()=>{
            selectAll();
        }).catch(er=>console.log(er))
    }
    //삭제
    const handleDelete = (e, id)=>{
        e.stopPropagation();
        console.log(id);
        axios.delete(`${port}/api/delete/${id}`).then(()=>{
            selectAll();
        }).catch(er=>console.log(er))
    }
    //회원가입 벨류업데이트
    const [register, setRegister] = useState({id:'', password:''});
    const handleChangeRegister = (e)=>{
        setRegister({...register, [e.target.name]:e.target.value});
    }
    //가입
    const handleRegister = ()=>{
        if(register.id === ''){
            alert('id를 채워주세요');
            return
        }
        if(register.password === ''){
            alert('password를 채워주세요');
            return
        }
        axios.post(`${port}/api/register`, register).then((res)=>{
            console.log('res => ', res);
            alert('회원가입 완료되었습니다.')
        }).catch(er=>{
            console.log(er.response)
            alert('다른 id를 사용해주세요.')
        });
    }
    //로그인
    const [login, setLogin] = useState({id:'',password:'' });
    const handlelogin = (e)=>{
        setLogin({...login, [e.target.name]:e.target.value,})
    }
    const handleloginEnter = ()=>{
        axios.post(`${port}/api/login`,login)
        .then(res=>{
            console.log(res);
            alert(res.data);
        })
        .catch(er=>{
            console.log(er.response.data);
            alert(er.response.data);
        });
    }
    //처음 로딩시 실행
    useEffect(()=>{
        selectAll();
    },[])
    return (
        <div id="App">
            <h1>react-express-mysql connection</h1>
            <div className="registerForm">
                <h4>회원가입</h4>
                <input type="text" placeholder="id" name="id" value={register.id} onChange={handleChangeRegister}/>
                <input type="password" placeholder="password" name="password" value={register.password} onChange={handleChangeRegister}/>
                <button onClick={handleRegister}>가입</button>
            </div>
            <div className="registerForm">
                <h4>로그인</h4>
                <input type="text" placeholder="id" name="id" value={login.id} onChange={handlelogin}/>
                <input type="password" placeholder="password" name="password" value={login.password} onChange={handlelogin}/>
                <button onClick={handleloginEnter}>로그인</button>
            </div>
            <form>
                <input type="text" placeholder="name" name="name" value={formData.name} onChange={handleChange}/>
                <input type="text" placeholder="capital" name="capital" value={formData.capital} onChange={handleChange}/>
                <input type="text" placeholder="population" name="population" value={formData.population} onChange={handleChange}/>
                <button onClick={handleSubmit}>등록</button>
            </form>
            <button onClick={selectAll}>모두조회</button>
            <section>
                {movieDetail && 
                    <div>
                        <p>{movieDetail.id}</p>
                        <p>{movieDetail.name}</p>
                        <p>{movieDetail.capitai}</p>
                        <p>{movieDetail.population}</p>
                    </div>
                }
            </section>
            <section>
                {movie.map((v) => (
                    <section
                        key={v.id}
                        className="pointer"
                        onClick={(e) => showMovieDetail(e, v.id)}
                        style={{display:'flex'}}
                    >
                        <h4>{v.id}</h4>
                        <p>{v.name}</p>
                        <button onClick={(e)=>handleDelete(e, v.id)}>delete</button>
                    </section>
                ))}
            </section>
        </div>
    );
}

export default App;
