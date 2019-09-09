import React, { Component } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router'
import axios from 'axios';

import fb from '../../config/firebase';

import MainView from '../../components/layout/MainView';

class PaymentComplete extends Component {
    state = {
        user: {},
    }

    componentDidMount() {
        this.authListener();
    }
    
    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
                this.getMatch();
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    getMatch = () => {
        const self = this;
        const { router } = this.props;
        const params = {
            id: router.query.post,
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

    render() {
        const { match } = this.state;
        const { router } = this.props;

        return (
            <MainView>
                <Head>
                    <title>팀팀 | 결제를 완료했습니다.</title>
                    <link href="../../static/payment-complete.css" rel="stylesheet" />
                </Head>
                <div className="payment_complete_container">
                    <div>
                        {
                            this.state.match
                            ?
                            <div>
                                <header className="payment_complete_title">
                                    결제 완료, 이제 경기장으로 가시면 됩니다!
                                </header>
                                <main>
                                    <div className="payment_section_container">
                                        <h3 className="">결제 내역</h3>
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
                                        <h3>참고사항</h3>
                                        <section className="">
                                                <li>풋살장 이용시 축구화 착용 금지입니다. 풋살화를 착용해주세요.</li>
                                                <li>2</li>
                                                <li>3</li>
                                                <li>4</li>
                                        </section>
                                    </div>
                                    <div>
                                        <section className="">
                                            <div>
                                                <Link
                                                    href={{ pathname: '/match', query: { id: router.query.post } }}
                                                >
                                                    <a
                                                        className="button"
                                                    >
                                                        돌아가기
                                                    </a>
                                                </Link>
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

export default withRouter(PaymentComplete);
