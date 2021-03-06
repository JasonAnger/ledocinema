import React, { Component } from 'react';
import Cookies from 'js-cookie';
import '../AdminPage.css'
import AdminLogin from '../../AdminLogin'
import AdminNav from '../AdminNav'
import './adminPhim.css'
import Datepicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import slugify from 'react-slugify'
import domain from '../../../domain';

class CreateMovie extends Component {
    constructor(props) {
        super(props)
        this.onClickTaoPhim = this.onClickTaoPhim.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
    }

    state = { movie: {}, startDate: new Date(), endDate: new Date() , image: {}, text: ""}

    componentDidMount() {
        document.getElementById('navbar').style.display = 'none'
        document.getElementById('footer').style.display = 'none'
        fetch(`${domain.api}/movie/cuc-no-hoa-cuc-cung`)
          .then(response => response.json())
          .then(data => 
            {     
                this.setState({ movie: data })
            })
    }

    onChangeImage(element) {
        let files = element.target.files
        let reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = (element) => {
            console.warn(element.target.result)
            console.log(files[0])
            this.setState({ image: files[0]})
        }
    }

    onClickTaoPhim() {
        const formData = new FormData()
        if(this.state.image.toString()!=="[object Object]")
            formData.append('image', this.state.image, this.state.image.name)
        formData.append('name', document.getElementById("movieName").value)
        formData.append('decription', this.state.text)
        formData.append('director', document.getElementById("director").value)
        formData.append('actor', document.getElementById("actors").value)
        formData.append('type', document.getElementById("type").value)
        formData.append('length', document.getElementById("length").value)
        formData.append('language', document.getElementById("language").value)
        formData.append('rating', document.getElementById("rating").value)
        formData.append('playing', false)
        formData.append('date_start', this.state.startDate)
        formData.append('date_end', this.state.endDate)
        formData.append('slug', slugify(document.getElementById("movieName").value))
        fetch(`${domain.api}/movie/create`, {
            method: 'POST',
            body: formData
        }).then(res => {  window.location.href=window.location.origin+"/administrator/phim" })
    }

    handleChangeText = (value) => {
        this.setState({ text: value })
    }

    render() {

        if (Cookies.get('admin') == "admin" && Cookies.get('passwordAd') == "admin") {
            return (
                <div className="adminPage">
                    <AdminNav />
                    <div style={{maxHeight: window.innerHeight}} className="adminMainContainer">
                        <div className="topPhimAdmin">
                            <p className="header-text">Tạo phim mới</p>
                        </div>
                        <div>
                            <form className="formEdit">
                                <div>
                                    <label for="movieName"><b>Hình:</b></label>
                                    <input type="file" name="image" id="image" onChange={(element) => this.onChangeImage(element)} required></input>
                                </div>
                                <div>
                                    <label for="movieName"><b>Tên phim:</b></label>
                                    <input type="text" placeholder={this.state.movie.name} name="movieName" id="movieName" required></input>
                                </div>
                                <div>
                                    <label for="director"><b>Đạo diễn: </b></label>
                                    <input type="text" placeholder={this.state.movie.director} name="director" id="director" required></input>
                                </div>
                                <div>
                                    <label for="actors"><b>Diễn viên: </b></label>
                                    <input type="text" placeholder={this.state.movie.actor} name="actors" id="actors" required></input>
                                </div>
                                <div>
                                    <label for="type"><b>Thể loại: </b></label>
                                    <input type="text" placeholder={this.state.movie.type} name="type" id="type" required></input>
                                </div>
                                <div>
                                    <label for="length"><b>Thời lượng: </b></label>
                                    <input type="text" placeholder={this.state.movie.length} name="length" id="length" required></input>
                                </div>
                                <div>
                                    <label for="language"><b>Ngôn ngữ: </b></label>
                                    <input type="text" placeholder={this.state.movie.language} name="language" id="language" required></input>
                                </div>
                                <div>
                                    <label for="rating"><b>Rating: </b></label>
                                    <input type="text" placeholder={this.state.movie.rating} name="rating" id="rating" required></input>
                                </div>
                                <div>
                                    <label for="type"><b>Ngày khởi chiếu: </b></label>
                                    <Datepicker
                                        onChange={(value) => this.setState({startDate: value})}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        selected={this.state.startDate}
                                    />
                                </div>
                                <div>
                                    <label for="type"><b>Ngày kết thúc: </b></label>
                                    <Datepicker
                                        onChange={(value) => this.setState({endDate: value})}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        selected={this.state.endDate}
                                    />
                                </div>
                                <div>
                                    <label for="description"><b>Nội dung phim: </b></label>
                                    <ReactQuill value={this.state.text} onChange={this.handleChangeText} />
                                </div>
                                <div>
                                    <label for="linkTrailer"><b>Link trailer: </b></label>
                                    <input type="text" placeholder={this.state.movie.trailer} name="linkTrailer" id="linkTrailer" required></input>
                                </div>
                            </form>
                        </div>
                        <a href="#" onClick={this.onClickTaoPhim}><div className="button dangsua">Tạo phim</div></a>
                    </div>
                </div>
            )
        }

        else return (<AdminLogin />)
    }
}

export default CreateMovie