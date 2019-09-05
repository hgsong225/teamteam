import React, { Component } from 'react';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';

import fb from '../../config/firebase';

import MainView from '../../components/layout/MainView';

class Payment extends Component {
    state = {
        user: {},
        total_price: '',
        total_player: '',
    }

    componentDidMount() {
        console.log('componentdidmount');
        
        this.authListener();
    }
    
    authListener() {
        console.log('authlistner');
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                }, () => this.getMatch());
                
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    getMatch = () => {
        console.log('getmatch');

        const self = this;
        const { url } = this.props;
        const params = {
            id: url.query.post,
        };
        axios.get(`/api/match`, {
            params,
        })
        .then((res) => {
            const match = res.data;
            self.setState({
                match,
            });
        })
        .catch((err) => console.log(err));
    }

    handlePay = (e) => {
        e.preventDefault();


    }

    render() {
        const { match } = this.state;
        console.log('render');
        return (
            <MainView>
                <Head>
                    <title>팀팀 | 결제</title>
                    <link href="../../static/payment-index.css" rel="stylesheet" />
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
                                                <select>
                                                    <option>신용/체크카드 결제</option>
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

export default Payment;
