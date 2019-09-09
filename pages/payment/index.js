import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { withRouter } from 'next/router'
import axios from 'axios';
import moment from 'moment';

import fb from '../../config/firebase';

import MainView from '../../components/layout/MainView';

class Payment extends Component {
    state = {
        user: {},
        total_price: '',
        total_player: 1,
        total_guest: [],
        pay_method: 'card',
    }

    componentDidMount() {
        const IMP = window.IMP; // 생략가능
        IMP.init('imp22498141'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용

        this.getUserInfo();
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
                this.createTotalGuestArray(match[0].total_guest, match[0].match_fee);
            });
        })
        .catch((err) => console.log(err));
    }

    handleChange = (e) => {
        e.preventDefault();

        if (e.target.name === "total_player") {
            const total_price = e.target.value * this.state.match[0].match_fee;
            console.log(`total_price`, total_price);
            this.setState({
                total_player: e.target.value,
                total_price,
            });
        } else {
            this.setState({
                [e.target.name]: e.target.value,
            });
        }
    }

    handlePay = (e) => {
        e.preventDefault();


        this.requestIamport();
    }


    requestIamport() {
        const {
            match, user
        } = this.state;

        const {
            router
        } = this.props; 

        IMP.request_pay({
            pg : 'inicis', // version 1.1.0부터 지원.
            pay_method : 'card',
            merchant_uid : 'merchant_' + new Date().getTime(),
            name : '주문명:결제테스트',
            amount : 100,
            buyer_email : 'hgsong225@gmail.com',
            buyer_name : user.name,
            buyer_tel : '01028833742',
            buyer_addr : '없음',
            buyer_postcode : '없음',
            // m_redirect_url : `https://localhost:3000/payment/complete?post=${router.query.post}&match=${router.query.match}`
            m_redirect_url : `https://localhost:3000/payment/complete?post=161&match=66`
            // m_redirect_url : 'https://teamteam.co.kr/payment/complete?post=161&match=66'
        }, (rsp) => {
            if ( rsp.success ) {
                var msg = '결제를 완료했습니다.';
                msg += '고유ID : ' + rsp.imp_uid;
                msg += '상점 거래ID : ' + rsp.merchant_uid;
                msg += '결제 금액 : ' + rsp.paid_amount;
                msg += '카드 승인번호 : ' + rsp.apply_num;
                const query = {
                    post: router.query.post,
                    match: router.query.match
                };
                Router.push({
                    pathname: '/payment/complete',
                    query,
                });
            } else {
                var msg = '결제에 실패하였습니다.';
                msg += '에러내용 : ' + rsp.error_msg;
            }
            alert(msg);
        });
    }


    createTotalGuestArray(num, initial_price) {
        let total_guest = [];
        let i;

        for (i = 1; i <= num; i += 1) {
            total_guest.push(
                <option key={num}>{i}</option>
            )
        }
        
        this.setState({ total_guest, total_player: 1, total_price: initial_price });
    }

    render() {
        const { match, total_guest, total_player, total_price } = this.state;
        return (
            <MainView>
                <Head>
                    <title>팀팀 | 결제</title>
                    <link href="../../static/payment-index.css" rel="stylesheet" />
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
                                        <h3 className="">경기 상세</h3>
                                        <section className="">
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                       <p className="">경기번호</p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="">
                                                       <p className="">종목 | 유형</p>
                                                       <p>{match[0].sports_category} | {match[0].match_type} : {match[0].match_type}</p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="">
                                                       <p className="">참가비</p>
                                                       <p>{match[0].match_fee}</p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="">
                                                       <p className="">일시</p>
                                                       <p>시작: {match[0].start_time} 종료: {match[0].end_time} (2시간)</p>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="">
                                                       <p className="">장소</p>
                                                       <p>{match[0].place_name}</p>
                                                    </div>
                                                    <div className="">
                                                       <p className="">주소</p>
                                                       <p>{match[0].address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="">
                                        <h3 className="">결제</h3>
                                        <section className="">
                                            <div className="">
                                                <select
                                                    onChange={this.handleChange}
                                                    name="pay_method"
                                                >
                                                    <option value="card">신용/체크카드 결제</option>
                                                </select>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="payment_section_container">
                                        <h3 className="">총 인원</h3>
                                        <section className="">
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                       <p className="">인원 수</p>
                                                       <p className="">최대 {match[0].total_guest}명까지 신청/결제 할 수 있습니다.</p>
                                                       <select
                                                           onChange={this.handleChange}
                                                           name="total_player"
                                                       >
                                                           {total_guest}
                                                       </select>
                                                       <p>{this.state.total_player}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="payment_section_container">
                                        <h3 className="">TOTAL</h3>
                                        <section className="">
                                            <div className="">
                                                <div className="">
                                                    <div className="">
                                                       <p className="">총 금액</p>
                                                       <p>{this.state.total_price}</p>
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
                                        <section className="">
                                            <div>
                                                <button
                                                    className="button"
                                                    onClick={this.handlePay}
                                                >
                                                    결제하기
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                </main>
                            </div>
                            : 'loading'
                        }
                    </div>
            </div>
            </MainView>
        );
    }
}

export default withRouter(Payment);
