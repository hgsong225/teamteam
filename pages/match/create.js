import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';

import fb from '../../config/firebase';
import location from '../../config/location.json';

import MainView from '../../components/layout/MainView';

class CreateMatch extends Component {
    state = {
        user: null,
        sports: [
            {
                category: '축구',
                min_personnel: 10,
                max_personnel: 12,
            },
            {
                category: '풋살',
                min_personnel: 3,
                max_personnel: 7,
            }
        ],
        selected_sports_category: '축구',
        selected_sports_type: '10 : 10',
        // 이제 location을 db에 insert 할 때 server단에서 예외처리 작업해서 집어 넣을 것.
        total_guests_to_need: 1,
        total_guest_arr: [],
        location,
        selected_location: [],
        selected_sido: '세종특별자치시',
        selected_sigungu: '',
        match_date: new Date().toISOString().slice(0,10),
        match_time_type: '2',
        match_start_time: `${new Date().getHours() + 1}:00`,
        match_end_time: `${new Date().getHours() + 3}:00`,
        keyword: '',
        places: [],
        selected_place: [],
        phone: '',
        contents: '',
        fee: '10000',
        new_price: '10000',
        deposit_account: '',
        errors: {},
    }

    componentDidMount() {
        this.authListener();
        // script가 완전히 불러와 질 때 검색 가능하게.
        const script = document.createElement("script");
        document.body.appendChild(script);
        // script.onload = () => {
        //     setTimeout(() => {
        //         const places = daum && new daum.maps.services.Places();
        //         console.log(places);
        //         this.setState({ places });
        //     }, 10000);
        // };
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=7aa07991d231ab8c2de8a2ca3feca8e6&autoload=false&libraries=services";
        script.async = true;
        document.body.appendChild(script);

        let NEEDED_GUEST_NUMBER = Number(this.state.selected_sports_type.split(" ")[0]) - 1;
        let total_guest_arr = [];
        for (let i = 1; i <= NEEDED_GUEST_NUMBER; i += 1) {
            total_guest_arr.push(i);
        }
        this.setState({ total_guest_arr });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.match_start_time != this.state.match_start_time) {
            this.setState({
                match_end_time: `${+this.state.match_start_time.split(":")[0] + +this.state.match_time_type}:00`
             })
        }
        else if (prevState.selected_sports_type != this.state.selected_sports_type) {
            let NEEDED_GUEST_NUMBER = Number(this.state.selected_sports_type.split(" ")[0]) - 1;
            let total_guest_arr = [];
            for (let i = 1; i <= NEEDED_GUEST_NUMBER; i += 1) {
                total_guest_arr.push(i);
            }
            this.setState({ total_guest_arr });
            return true;
        }

        return false;
    }

    authListener = () => {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                const params = {
                    uid: user.uid,
                }
                axios.get(`/api/user`, {
                    params,
                })
                .then((res) => {
                    const data = res.data;
                    user['data'] = data;
                    this.setState({
                        user,
                        phone: data[0].phone,
                        deposit_account: data[0].account,
                        new_deposit_account: data[0].account,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                this.setState({
                    user: null,
                });
                Router.push('/sign-in');
            }
        });
    }

    addLocation = (e) => {
        e.preventDefault();
        let isAlreadyExistLocation = false;
        this.state.selected_location.forEach(location => {
            if (location.sido == this.state.selected_sido && location.sigungu == this.state.selected_sigungu) {
                isAlreadyExistLocation = true;
            }
        });

        if (!isAlreadyExistLocation && this.state.selected_location.length < 5) {
            this.setState({
                selected_location: this.state.selected_location.concat({
                    sido: this.state.selected_sido,
                    sigungu: this.state.selected_sigungu
                })
            });
        }
    }

    removeLocation = (e) => {
        e.preventDefault();
        const target = e.target;
        const sido = target.name;
        const sigungu = target.value;

        const res = this.state.selected_location.filter(location => location.sido + location.sigungu !== sido + sigungu);

        this.setState({
            selected_location: res,
        });
    }

    searchPlaces = (e) => {
        const value = e.target.value;
        this.setState({
            keyword: value,
        });

        daum.maps.load(() => {
            if (value.length > 0) {
                const places = new daum.maps.services.Places();
                places.keywordSearch(value, (result, status) => {
                    if (status === daum.maps.services.Status.OK) {
                        console.log(result);
                        this.setState({
                            places: result,
                        });
                    }
                });
            } else {
                this.setState({
                    places: [],
                });
            }
        });
    }

    addPlace = (e) => {
        e.preventDefault();
        this.setState({
            places: [],
            selected_place: [JSON.parse(e.target.value)],
        });
    }

    removePlace = (e) => {
        e.preventDefault();
        this.setState({
            selected_place: [],
        });
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const id = target.id;
        this.setState({
            [name]: target.value
        });

        if (name === "selected_sido") {
            this.setState({
                selected_sigungu: this.state.location.data.find(location => e.target.value === location.sido_name).sigungu_name,
            });
        } else if (name === "match_time_type") {
            this.setState({
                match_end_time: `${+this.state.match_start_time.split(":")[0] + +e.target.value}:00`
            })
        } else if (name === "new_deposit_account" && id === "new_deposit_select") {
            const index = target.selectedIndex;
            const optionElement = target.childNodes[index]
            const new_deposit = document.getElementById("new_deposit")

            if (optionElement.title === "new") {
                new_deposit.style.display = "inline-block";
            } else {
                new_deposit.style.display = "none";
            }
            
        } else if (name === "fee" && id === "price_select") {
            const index = target.selectedIndex;
            const optionElement = target.childNodes[index]
            const price = document.getElementById("price")

            if (optionElement.title === "new") {
                price.style.display = "inline-block";
            } else {
                price.style.display = "none";
                this.setState({ new_price: target.value })
            }
        } else if (name === "fee") {
            const PRICE = target.value;
            const CUTTING_UNIT = 1; // 1, 10, 100, 1000 ...
            let CUTTED_PRICE = PRICE / CUTTING_UNIT;
            let NEW_PRICE = Math.round(CUTTED_PRICE); // ROUNDED PRICE

            this.setState({ fee: NEW_PRICE });
        }
    }

    handleSelectedChange = (e) => {
        if (e.target.value === "축구") {
            this.setState({
                selected_sports_category: e.target.value,
                selected_sports_type: "10 : 10" ,
            });
        } else if (e.target.value === "풋살") {
            this.setState({
                    selected_sports_category: e.target.value,
                    selected_sports_type: "3 : 3",
            });
        }
    }

    handleValidation = () => {
        let errors = {};
        let formIsValid = true;
        const {
            selected_location,
            selected_place,
            phone,
            new_deposit_account,
            new_price,
        } = this.state;


        if (!selected_location.length > 0) {
            formIsValid = false;
            errors["selected_location"] = "사람들에게 알리고 싶은 지역을 선택하세요.";
        }

        if (!selected_place.length > 0) {
            formIsValid = false;
            errors["selected_place"] = "경기장을 입력하고 선택해주세요.";
        }

        if (isNaN(Number(phone))) {
            formIsValid = false;
            errors["phone"] = "숫자로 입력하세요.";
        }

        if (!phone.length > 0) {
            formIsValid = false;
            errors["phone"] = "전화번호를 입력하세요.";
        }

        if (isNaN(Number(new_price)) || new_price !== undefined && !new_price.length > 0) {
            formIsValid = false;
            errors["new_price"] = "참가비를 숫자로 입력하세요.";
        }

        if (new_price !== undefined && !new_price.length > 0) {
            formIsValid = false;
            errors["new_price"] = "참가비를 입력하세요.";
        }

       if (new_price < 5000) {
            formIsValid = false;
            errors["new_price"] = "최소 금액은 5000원 이상입니다.";
       }

        if (!new_deposit_account.length > 0) {
            formIsValid = false;
            errors["new_deposit_account"] = "계좌번호를 입력하세요.";
        }

        this.setState({
            errors: errors,
        });

        return formIsValid;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.handleValidation()) {
            const {
                user,
                selected_sports_category,
                selected_sports_type,
                total_guests_to_need,
                selected_location,
                match_date,
                match_start_time,
                match_end_time,
                match_time_type,
                selected_place,
                phone,
                contents,
                fee,
                new_deposit_account,
                new_price,
            } = this.state;
    
            const sports_type = selected_sports_type.split(' ')[0];
            
            let deposit_account = new_deposit_account;

            let start_time = moment.utc(new Date(`${match_date} ${match_start_time}`)).format();
            let end_time = moment.utc(new Date(`${match_date} ${match_end_time}`)).format();

            console.log(`start_time`, start_time);
            console.log(`end_time`, end_time);

            const data = {
                uid: user.uid,
                selected_sports_category,
                selected_sports_type: sports_type,
                total_guests_to_need,
                selected_location,
                match_date,
                match_start_time: start_time,
                match_end_time: end_time,
                match_time_type,
                selected_place: selected_place[0],
                phone,
                contents,
                fee: new_price.length === 0 ? fee : new_price,
                deposit_account,
            };
            axios.post(`/api/match/create`, {
                data,
            })
            .then((res) => {
                console.log(res);
                const idpost = res.data.idpost;
                Router.push(`/match?id=${idpost}`);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }
    
    render() {
        const locations = this.state.location.data;
        const Sido = locations.filter((location, i) => {
            if ((locations[i + 1] && location.sido_code !== locations[i + 1].sido_code) || !locations[i + 1]) {
                return location;
            }
        });
        return (
            <MainView>
                <div className="create-container">
                    <style jsx>{`
                        .error-msg {
                            margin-top: 0;
                            color: #f44336;
                        }
                        .create-container {
                            margin-left: 16px;
                            margin-right: 16px;
                            max-width: 550px;
                        }
                    `}</style>
                    <Head>
                        <title>팀팀 | 경기 생성</title>
                        <link href="../static/match-create.css" rel="stylesheet" />
                    </Head>
                    <p className="page-title">빠르게 경기를 생성해 팀팀 게스트를 초대하세요!</p>
                    <form
                        onSubmit={this.handleSubmit}
                    >
                        <div className="section">
                            <h2 className="section-title">경기 정보</h2>
                            <div className="section-contents">
                                <h3 className="contents-title">종목</h3>
                                {
                                    this.state.sports.map(sports => {
                                        return (
                                            <label
                                                className="radio-label"
                                                key={sports.category}
                                            >{sports.category}
                                                <input
                                                    className="input-radio"
                                                    onChange={this.handleSelectedChange}
                                                    type="radio"
                                                    name="selected_sports_category"
                                                    value={sports.category}
                                                    checked={this.state.selected_sports_category === sports.category}
                                            />
                                                <span className="checkmark"></span>
                                            </label>
                                        );
                                    })
                                }
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">경기 유형</h3>
                                <select
                                    onClick={this.handleChange}
                                    name="selected_sports_type"
                                    value={this.selected_sports_type}
                                >
                                    {
                                        this.state.sports.map(sports => {
                                            const res = [];
                                            if (sports.category == this.state.selected_sports_category) {
                                                for (let i = sports.min_personnel; i <= sports.max_personnel; i += 1) {
                                                    res.push(
                                                        <option
                                                            key={i}
                                                        >
                                                            {i} : {i}
                                                        </option>
                                                    );
                                            }}
                                            return res;
                                        }).reduce((a, b) => { return a.concat(b); }, [])
                                    }
                                </select>
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">게스트가 몇 명이 필요하나요?</h3>
                                <select
                                    onChange={this.handleChange}
                                    name="total_guests_to_need"
                                >
                                    {
                                        this.state.total_guest_arr.map(num => {
                                            return (
                                                <option>{num}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">지역 선택</h3>
                                <p className="contents-desc">선택한 지역에 경기를 게시합니다. (최대 5개)</p>
                                <select
                                    onChange={this.handleChange}
                                    name="selected_sido"
                                >
                                {
                                    Sido.map((location) => {
                                        return (
                                        <option
                                            key={location.sido_code}
                                            value={location.sido_name}
                                        >
                                            {location.sido_name}
                                        </option>
                                        );
                                    })
                                }
                                </select>
                                {
                                    (this.state.selected_sigungu !== "" && this.state.selected_sigungu !== "null") &&
                                    <select
                                        onChange={this.handleChange}
                                        name="selected_sigungu"
                                    >
                                    {
                                        locations.map((location) => {
                                            if (this.state.selected_sido == location.sido_name) {
                                                return (
                                                    <option
                                                        key={location.sigungu_code}
                                                        value={location.sigungu_name}
                                                    >
                                                        {location.sigungu_name}
                                                    </option>
                                                    );
                                            }
                                        })
                                    }
                                    </select>
                                }
                                <button
                                    className="add-location-button"
                                    onClick={this.addLocation}
                                >
                                    추가
                                </button>
                                <p className="error-msg">{this.state.errors.selected_location}</p>
                                <div className="selected-button-box">
                                    {
                                            this.state.selected_location.map(location => {
                                                return (
                                                    <div className="selected-button">
                                                        <span>{`${location.sido} ${location.sigungu}`}</span>
                                                        {
                                                            this.state.selected_location.length > 0 &&
                                                            <button
                                                                onClick={this.removeLocation}
                                                                name={location.sido}
                                                                value={location.sigungu}
                                                            >
                                                                x
                                                            </button>
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                </div>
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">경기 날짜</h3>
                                <input
                                    onChange={this.handleChange}
                                    type="date"
                                    name="match_date"
                                    value={this.state.match_date}
                                    min={new Date().toISOString().slice(0, 10)}
                                    max={new Date(+new Date + 12096e5).toISOString().slice(0, 10)}
                                />
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">경기 시간</h3>
                                {/* <p className="contents-desc">경기 시작</p> */}
                                    <select
                                        onChange={this.handleChange}
                                        name="match_start_time"
                                        className="select-time"
                                    >
                                        {
                                            ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'].map(hours => {
                                                return (
                                                    <option value={hours + ":00"}>{hours}:00</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {/* <input
                                        onChange={this.handleChange}
                                        type="time"
                                        name="match_start_time"
                                        step="1800"
                                        value={this.state.match_start_time+":00"}
                                    /> */}
                                    <div>
                                        <label className="radio-label">2시간
                                            <input
                                                onChange={this.handleChange}
                                                type="radio"
                                                name="match_time_type"
                                                value="2"
                                                checked={this.state.match_time_type === '2'}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="radio-label">3시간
                                            <input
                                                onChange={this.handleChange}
                                                type="radio"
                                                name="match_time_type"
                                                value="3"
                                                checked={this.state.match_time_type === '3'}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                <p>{this.state.match_start_time} ~ {this.state.match_end_time}</p>
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">경기장</h3>
                                {this.state.selected_place.length < 1 && <p className="contents-desc">경기장을 입력하세요.</p>}
                                <input
                                    onChange={this.searchPlaces}
                                    type="search"
                                    name="keyword"
                                    value={this.state.keyword}
                                />
                                <div>
                                    {
                                        this.state.selected_place.length > 0
                                        && this.state.selected_place.map(place => {
                                            return (
                                                <div className="selected-place-box">
                                                    <div className="selected-place">
                                                        <p>{place.place_name}</p>
                                                        <p>{place.address_name}</p>
                                                    </div>
                                                    <button
                                                        onClick={this.removePlace}
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )
                                        })
                                    }
                                    <p className="error-msg">{this.state.errors.selected_place}</p>
                                </div>
                                <div className="search-result-box">
                                    {
                                        this.state.places.length > 0 &&
                                        this.state.places.map(place => {
                                            return (
                                                <div
                                                    className="search-result-place-box"
                                                    key={place.place_id}
                                                >
                                                    <div className="search-result-place">
                                                        <p>{place.place_name}</p>
                                                        <p>{place.address_name}</p>
                                                    </div>
                                                    <button
                                                        onClick={this.addPlace}
                                                        value={JSON.stringify(place)}
                                                    >
                                                        선택
                                                    </button>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <h2 className="section-title">기타 정보</h2>
                            <div className="section-contents">
                                <h3 className="contents-title">연락처</h3>
                                <input
                                    onChange={this.handleChange}
                                    type="tel"
                                    name="phone"
                                    value={this.state.phone.replace(/ /gi, "").replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1  $2  $3")}
                                />
                                <p className="error-msg">{this.state.errors.phone}</p>

                                {/* <input
                                    type="radio"
                                    value="default"
                                />기존 연락처 */}
                                
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">간단한 소개</h3>
                                <textarea
                                    onChange={this.handleChange}
                                    name="contents"
                                    type="text"
                                    placeholder="참가하시는 분들에게 간단하게 전할 말이나 주의 할 사항을 알려주세요."
                                    value={this.state.contents}
                                />
                            </div>
                        </div>
                        <div className="section">
                            <h2 className="section-title">입금 안내</h2>
                            <div className="section-contents">
                                <h3 className="contents-title">참가비</h3>
                                <div className="price-box">
                                    <select
                                        onChange={this.handleChange}
                                        value={this.state.fee}
                                        name="fee"
                                        id="price_select"
                                    >
                                        <option value="5000" title="fixed">5000원</option>
                                        <option value="6000" title="fixed">6000원</option>
                                        <option value="7000" title="fixed">7000원</option>
                                        <option value="8000" title="fixed">8000원</option>
                                        <option value="9000" title="fixed">9000원</option>
                                        <option value="10000" title="fixed">10000원</option>
                                        <option
                                            value=""
                                            title="new"
                                        >직접 입력</option>
                                    </select>
                                    <input
                                        onChange={this.handleChange}
                                        type="text"
                                        name="new_price"
                                        placeholder=""
                                        value={this.state.new_price}
                                        id="price"
                                    />
                                    <span id="price-unit">원</span>
                                </div>
                                <p className="error-msg">{this.state.errors.new_price}</p>
                            </div>
                            <div className="section-contents">
                                <h3 className="contents-title">입금 계좌</h3>
                                <p className="contents-desc">참가비를 입금 받을 계좌를 입력해주세요. <br />경기 종료 후 24시간 이내 참가비에 수수료 20%를 제외한 금액이 입금됩니다.</p>
                                <select
                                    onChange={this.handleChange}
                                    name="new_deposit_account"
                                    id="new_deposit_select"
                                >
                                    <option
                                        value={this.state.deposit_account}
                                    >
                                        {this.state.deposit_account}</option>
                                    <option
                                        value=""
                                        title="new"
                                    >직접 입력</option>
                                </select>
                                <input
                                    onChange={this.handleChange}
                                    type="text"
                                    name="new_deposit_account"
                                    placeholder=""
                                    value={this.state.new_deposit_account}
                                    id="new_deposit"
                                />
                                <p className="error-msg">{this.state.errors.new_deposit_account}</p>
                            </div>
                        </div>
                        <div className="button-box">
                            <input
                                type="submit"
                                value="경기 생성"
                            />
                        </div>
                    </form>
                </div>
            </MainView>
        );
    }
}

export default CreateMatch;