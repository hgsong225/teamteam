import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { withRouter } from 'next/router'
import axios from 'axios';
import moment from 'moment';
import {
    Select,
    Button,
  } from 'antd';
const { Option } = Select;

import fb from '../../config/firebase';
import imp from '../../config/iamport';

import MainView from '../../components/layout/MainView';
import Loading from '../../components/dumb/Loading';

class Payment extends Component {
    state = {
        user: {},
        total_price: '',
        guests_to_play: 1,
        total_guests_available_array: [],
        applicant_status: '수락',
        pay_method: 'card',
        order_number: '',
    }

    componentDidMount() {
        this.getUserInfo();
    }

    makeOrderNumber = () => {
        const { match, user } = this.state;
        let randomNum = {};
        //0~9까지의 난수
        randomNum.random = (n1, n2) => {
            return parseInt(Math.random() * (n2 -n1 +1)) + n1;
        };
        //인증번호를 뽑을 난수 입력 n 5이면 5자리
        randomNum.authNo = (n) => {
            let value = "";
            for (let i = 0; i < n; i++) {
                value += randomNum.random(0, 9);
            }
            return value;
        };

        // 주문번호 생성 (형식: 경기번호-유저번호-6자리 난수)
        const random_number = randomNum.authNo(6); // 6자리 난수 생성
        const order_number = `${match[0].idpost}-${match[0].idmatch}-${user.iduser}-${random_number}`;

        this.setState({ order_number });
    }
    
    getUserInfo = () => {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user);
                const { displayName, email, phoneNumber, photoURL, providerId } = user.providerData[0];
                const params = {
                    uid: user.uid,
                };
                axios.get(`/api/user`, {
                    params, 
                })
                .then(res => {
                    const data = res.data[0];
                    console.log(res);
                    this.setState({
                        user: {
                            account: data.account,
                            displayName,
                            email,
                            emailVerified: user.emailVerified,
                            phoneNumber: data.phone,
                            photoURL,
                            providerId,
                            uid: user.uid,
                            bod: data.bod,
                            gender: data.gender,
                            height: data.height,
                            weight: data.weight,
                            iduser: data.iduser,
                            introduction: data.introduction,
                            name: data.name
                        }
                    }, () => this.getMatch() );
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                console.log('user가 없습니다.');
                Router.push('/sign-in');
            }
        });
    }

    getMatch = () => {
        console.log('getmatch');

        const { router } = this.props;
        const params = {
            id: router.query.post,
        };
        axios.get(`/api/match`, {
            params,
        })
        .then((res) => {
            const match = res.data;
            this.setState({
                match,
            }, () => {
                this.createTotalGuestsAvailableArray(match[0].total_guests_available, match[0].match_fee);
                this.makeOrderNumber();
            });
        })
        .catch((err) => console.log(err));
    }

    handleCPayMethodChange = (value) => {
        this.setState({
            pay_method: value,
        });
    }

    handleGuestNumberChange = (value) => {
        const guests_to_play = value;
        const total_price = guests_to_play * this.state.match[0].match_fee;
        console.log(`total_price`, total_price);
        this.setState({
            guests_to_play,
            total_price,
        });
    }

    handlePay = (e) => {
        e.preventDefault();
        this.requestPay();
    }

    // 결제 요청
    requestPay() {
        const IMP = window.IMP; // 생략가능
        IMP.init(imp.identification_code); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용

        const {
            match, user, order_number,
        } = this.state;

        const {
            router
        } = this.props; 

        IMP.request_pay({
            pg : 'inicis', // version 1.1.0부터 지원.
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : `${match[0].sports_category} ${match[0].match_type}:${match[0].match_type} 게스트`,
            amount : 100 * this.state.guests_to_play,
            buyer_email : 'hgsong225@gmail.com',
            buyer_name : user.name,
            buyer_tel : '01028833742',
            buyer_addr : '',
            buyer_postcode : '',
            // m_redirect_url : `https://localhost:3000/payment/complete?post=${router.query.post}&match=${router.query.match}`
            // m_redirect_url : `https://localhost:3000/payment/complete?post=161&match=66`
            m_redirect_url : `https://teamteam.co.kr/payment/complete?post=${router.query.post}&match=${router.query.match}`
            // m_redirect_url : 'https://teamteam.co.kr/payment/complete?post=161&match=66'
        }, (rsp) => {
            if ( rsp.success ) {
                const { user, match } = this.state;
                const idmatch = match[0].idmatch;

                axios.post(`/api/match/apply`, {
                    data: {
                        iduser: user.iduser,
                        idmatch,
                        match_has_user_fee: match[0].match_fee,
                        total_price: 100 * this.state.guests_to_play,
                        total_guests_to_need: this.state.match[0].total_guests_to_need,
                        origin: {
                            guests_to_play: this.state.match[0].total_guests_to_play,    
                        },
                        guests_to_play: this.state.guests_to_play,
                        pay_method: this.state.pay_method,
                        applicant_status: this.state.applicant_status,
                        host_revenue: match[0].host_revenue,
                        total_commission: match[0].total_commission,
                        total_match_payment_amount: match[0].total_match_payment_amount,
                        order_number,
                        rsp: {
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            paid_amount: rsp.paid_amount,
                            apply_num: rsp.apply_num,
                        }
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    let query = {};

                    if (res.status === 200) {
                        var msg = '결제를 완료했습니다.';
                        
                        query.order = order_number;
                        Router.push({
                            pathname: '/payment/complete',
                            query,
                        });

                        alert(msg);
                    } else {
                        query.post = router.query.post;
                        query.match = router.query.match;

                        Router.push({
                            pathname: '/payment',
                            query,
                        });

                        console.log(`res`, res);
                        var msg = '결제 실패';

                        alert(msg);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert(err);
                });
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg; // 추후 주석 처리
                alert(msg);
            }
        });
    }

    createTotalGuestsAvailableArray(num, initial_price) {
        let total_guests_available_array = [];
        let i;

        for (i = 1; i <= num; i += 1) {
            total_guests_available_array.push(
                <Option key={num} value={i}>{i}</Option>
            )
        }
        
        this.setState({
            total_guests_available_array,
            guests_to_play: 1,
            total_price: initial_price
        });
    }

    render() {
        const { match, total_guests_available_array, guests_to_play, total_price } = this.state;
        return (
            <MainView>
                <Head>
                    <title>팀팀 | 결제</title>
                    <link href="../../static/payment-index.css" rel="stylesheet" />
                    <link href="../../static/antd.css" rel="stylesheet" />
                    <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" ></script>
                    <script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"></script>
                </Head>
                <div className="payment_container">
                    <div>
                        {
                            this.state.match
                            ?
                            <div>
                                <header className="payment_title">
                                    결제
                                </header>
                                <main>
                                    <div className="payment_section_container">
                                        <div className="section_title_box">
                                            <h3 className="section_title">경기 상세</h3>
                                        </div>
                                        <section className="payment_section">
                                            <div className="payment_section_contents">
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">경기번호</p>
                                                       <p className="">1234-56-78</p>
                                                    </div>
                                                </div>
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">종목 | 유형</p>
                                                       <p>{match[0].sports_category} | {match[0].match_type} : {match[0].match_type}</p>
                                                    </div>
                                                </div>
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">일시</p>
                                                       <p>시작: {match[0].start_time} 종료: {match[0].end_time} (2시간)</p>
                                                    </div>
                                                </div>
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">장소</p>
                                                       <p>{match[0].place_name}</p>
                                                    </div>
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">주소</p>
                                                       <p>{match[0].address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="payment_section_container">
                                        <div className="section_title_box">
                                            <h3 className="section_title">결제</h3>
                                        </div>
                                        <section className="payment_section">
                                            <div className="payment_section_contents">
                                                <Select
                                                    onChange={this.handleCPayMethodChange}
                                                    name="pay_method"
                                                    defaultValue="card"
                                                    style={{ width: "100%" }}
                                                >
                                                    <Option value="card">신용/체크카드 결제</Option>
                                                    <Option value="caddrd">신용/체ddfsdf크카드 결제</Option>
                                                </Select>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="payment_section_container">
                                        <div className="section_title_box">
                                            <h3 className="section_title">총 인원 - 최대 {match[0].total_guests_available}명 선택 가능</h3>
                                        </div>
                                        <section className="payment_section">
                                            <div className="payment_section_contents">
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                       <p className="definition_word">인원 수</p>
                                                       <Select
                                                           onChange={this.handleGuestNumberChange}
                                                           name="guests_to_play"
                                                           style={{ width: "25%" }}
                                                       >
                                                           {total_guests_available_array}
                                                       </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="payment_section_container">
                                        <div className="section_title_box">
                                            <h3 className="section_title">TOTAL - {guests_to_play}명</h3>
                                        </div>
                                        <section className="payment_section">
                                            <div className="payment_section_contents">
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                        <p className="definition_word">가격</p>
                                                        <p>{match[0].match_fee}원</p>
                                                    </div>
                                                </div>
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                        <p className="definition_word">게스트 수</p>
                                                        <p>{guests_to_play}명</p>
                                                    </div>
                                                </div>
                                                <div className="payment_section_definition_contents">
                                                    <div className="payment_section_definition">
                                                        <p className="definition_word">총 금액</p>
                                                        <p>{total_price}원</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div>
                                        <h3>환불 약관</h3>
                                        <section className="">
                                            <ul>
                                                <li>1</li>
                                                <li>2</li>
                                                <li>3</li>
                                                <li>4</li>
                                            </ul>
                                        </section>
                                    </div>
                                    <div>
                                                <Button
                                                    type="primary"
                                                    block
                                                    className="button"
                                                    onClick={this.handlePay}
                                                    value={match[0].idmatch}
                                                >
                                                    결제하기
                                                </Button>
                                                {/* <button
                                                    className="button"
                                                    onClick={this.handlePay}
                                                    value={match[0].idmatch}
                                                >
                                                    결제하기
                                                </button> */}
                                            </div>
                                </main>
                            </div>
                            : <Loading />
                        }
                    </div>
            </div>
            </MainView>
        );
    }
}

export default withRouter(Payment);
