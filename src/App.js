import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
    //데이터 불러오기
    const [movie, setMovie] = useState([]);
    const selectAll =  () => {
        axios.get("/movies").then((result)=>{
            setMovie(result.data);
        });
    };
    const [movieDetail, setMovieDetail] = useState(null);
    const showMovieDetail = async (e, id) => {
        const result = await axios.get(`/movies/${id}`);
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
        axios.post('/api/save', formData).then(()=>{
            selectAll();
        })
    }
    //삭제
    const handleDelete = (e, id)=>{
        e.stopPropagation();
        axios.delete(`/api/delete/${id}`).then(()=>{
            selectAll();
        })
    }
    useEffect(()=>{
        selectAll();
    },[])
    return (
        <div id="App">
            <h1>react-express-mysql connection</h1>
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
