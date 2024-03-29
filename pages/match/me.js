import React, { Component } from 'react';
import Router from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import moment from 'moment';

import fb from '../../config/firebase';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/dumb/Loading';

const refundOptions = {
    normal: {
        twentyFourAgo: {
            type: 'standard',
            description: '경기시작 24시간 이전 취소',
            rate: 1,
        },
        twelveToTwentyFour: {
            type: 'null',
            description: '경기시작 12 ~ 24시간 이내 취소',
            rate: 0.5,
        },
        sixToTwelve: {
            type: 'null',
            description: '경기시작 6 ~ 12시간 이내 취소',
            rate: 0.25,
        },
        twoToSix: {
            type: 'null',
            description: '경기시작 2 ~ 6시간 이내 취소',
            rate: 0.1,
        },
        zeroToTwo: {
            type: 'null',
            description: '경기시작 2시간 이내 취소',
            rate: 0,
        },
        
    }
};

class Me extends Component {
    state = {
        user: null,
        posts: [],
    }

    componentDidMount = () => {
        this.authListener();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.user !== null && this.state.user !== nextState.user) {
            console.log(this.state.user, nextState);
            console.log('슈드컴포넌트');
            this.getMyMatch(nextState.user);
            this.getMyApplicationMatch(nextState.user);
            return true;
        } else if (this.state.posts !== nextState.posts) {
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

    dateAscendingOrder = (a, b) => {
        let dateA = new Date(a['start_time']).getTime();
        let dateB = new Date(b['start_time']).getTime();
        return dateA > dateB ? 1 : -1;
    }

    getMyMatch = (user) => {
        const params = {
            uid: user.uid,
        };

        axios.get(`/api/match/me`, {
            params,
        })
        .then((res) => {
            this.setState({
                posts: this.state.posts.concat(res.data),
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }

    getMyApplicationMatch = (user) => {
        const isUserUpdated = this.state.user !== null ? true : false;
        const params = {
            uid: user.uid,
        };

        axios.get(`/api/match/me/apply`, {
            params,
        })
        .then((res) => {
            this.setState({
                posts: this.state.posts.concat(res.data),
            });
        })
        .catch((err) => {
            console.log(err);
        })
    }
  
    // now = 현재 시간, target = 시작 시간 (비교 대상), type = 반환 할 시간 형식, option_type = 환불 정책 강도 선택
    refundCalculator = (now, target, amount, type, option_type) => {
        // compare with mileseconds.
        let diff = target.diff(now);
        let option;
        console.log(`diff`, diff);
    
        if (option_type === 'normal') {
            if (diff >= 86400000) option = 'twentyFourAgo';
            if (diff >= 43200000 && diff < 86400000) option = 'twelveToTwentyFour';
            if (diff >= 21600000 && diff < 43200000) option = 'sixToTwelve';
            if (diff >= 7200000 && diff < 21600000) option = 'twoToSix';
            if (diff < 7200000) option = 'zeroToTwo';
        }
    
        let res = {
            option_type,
            option,
            body: refundOptions[option_type][option],
            amount: refundOptions[option_type][option].rate * amount
        };
    
        return res;
    }

    cancelApply = (e) => {
        const { user } = this.state;

        let confirm = window.confirm("정말로 신청을 취소하시겠습니까?");


        if (confirm) {
            const dataset = e.target.dataset;
            let now = moment();
            let start = moment(dataset.start_time);
            const refundOption = this.refundCalculator(now, start, dataset.amount, 'mileseconds', 'normal');
    
            axios.post(`/api/match/apply/test`, {
                data: {
                    uid: user.uid,
                    idmatch: dataset.idmatch,
                    order_number: dataset.order_number,
                    refundOption,
                }
            })
            .then((res) => {
                console.log(res.data);
                e.preventDefault();
            })
            .catch((err) => console.log(err));
        }
        e.preventDefault();
    }

    handleEdit = (e) => { // 경기 수정 버튼
        e.preventDefault();
    }

    handleRemove = (e) => { // 유저가 나인지 정확히 확인 할 것
        e.preventDefault();
        const { posts } = this.state;
        const idpost = e.target.getAttribute('value');
        const params = {
            idpost,
        };

        if (confirm("삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?")) {
            this.setState({
                posts: posts.filter(post => post.idpost !== idpost),
            });
            
            axios.delete(`/api/match/me`, {
                params,
            })
            .then((res) => {
                console.log(res);
                alert('삭제 완료');
            })
            .catch(err => console.log(err));
        }
    }

    handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        this.setState({
            [name]: target.value
        });
      }

    convertDay = (day) => {
        const dayOfTheWeek = {
            Sunday: '일',
            Monday: '월',
            Tuesday: '화',
            Wednesday: '수',
            Thursday: '목',
            Friday: '금',
            Saturday: '토'
        };

        return dayOfTheWeek[day];
    }

    render() {
        console.log(this.state.posts);
        return (
            <div>
                <Layout>
                    <div className="posts-container">
                        <style jsx>{`
                        .posts-container {
                            max-width: 720px;
                            width: 100%;
                        }
                    `}</style>
                        <Head>
                            <title>팀팀 | 내 경기</title>
                            <link href="../static/match-me.css" rel="stylesheet" />
                        </Head>
                        <div className="title-box">
                            <header className="title">내 경기</header>
                        </div>
                        <div className="match-me page-notice-box">
                            <p className="match-me-notice-type">공지</p>
                            <p className="match-me-notice">
                                결제 완료 후 호스트 신청 수락시 참여 확정됩니다.
                            </p>
                            <p className="match-me-notice-desc">
                                입금 계좌: 신한 110-439-532672 팀팀
                            </p>
                        </div>
                        <ul>
                            {
                                this.state.posts !== undefined && this.state.posts.sort(this.dateAscendingOrder).map((post, i) => {
                                    if (post.start_time !== undefined) {
                                        const start_year = new Date(post.start_time).getFullYear();
                                        const start_month = new Date(post.start_time).getMonth();
                                        const start_date = new Date(post.start_time).getDate();
                                        const isSameDate = i >= 1
                                        && (new Date(start_year, start_month, start_date).getTime() == new Date(new Date(this.state.posts[i - 1].start_time).getFullYear(), new Date(this.state.posts[i - 1].start_time).getMonth(), new Date(this.state.posts[i - 1].start_time).getDate()).getTime());
                                        return (
                                            <li className="match-list">
                                                {
                                                    isSameDate == true
                                                    ? true
                                                    :
                                                    <h3 className="match_date">
                                                        {`${moment.parseZone(post.start_time).local().format('MM월 DD일')} ${this.convertDay(moment.parseZone(post.start_time).local().format('dddd'))}요일`}
                                                    </h3>
                                                }
                                                {
                                                    /* 내 경기일 때 */
                                                    this.state.user.data[0].iduser === post.hostID
                                                    && <Link
                                                            prefetch
                                                            href={{ pathname: '/match', query: { id: post.idpost }}}
                                                        >
                                                            <div className="match">
                                                                <div className="match-time">
                                                                    <p className="match-status">{post.match_status}</p>
                                                                    <p className="time">{moment.parseZone(post.start_time).local().format('HH:mm')}</p>
                                                                </div>
                                                                <div className="match-place">
                                                                    <p className="place">{post.place_name}</p>
                                                                    <p className="match-type">
                                                                    <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}</p>
                                                                </div>
                                                                <div
                                                                    className="status-box-remove"
                                                                    name={post.idpost}
                                                                >
                                                                    {
                                                                        post.match_status !== "경기종료"
                                                                        &&
                                                                        <p
                                                                            className="edit-match"
                                                                            name={post.idpost}
                                                                        >
                                                                            수정하기
                                                                        </p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Link>
                                                }
                                                {
                                                    /* 내가 신청한 경기 */
                                                    (post.applicant_status !== '신청취소' && this.state.user.data[0].iduser !== post.hostID)
                                                    && <Link
                                                            prefetch
                                                            href={{ pathname: '/match', query: { id: post.idpost }}}
                                                        >
                                                            <div className="match">
                                                                <div className="match-time">
                                                                    <p className="match-status">{post.match_status}</p>
                                                                    <p className="time">{moment.parseZone(post.start_time).local().format('HH:mm')}</p>
                                                                </div>
                                                                <div className="match-place">
                                                                    <p className="place">{post.place_name}</p>
                                                                    <p className="match-type">
                                                                    <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}</p>
                                                                </div>
                                                                <div
                                                                    className="status-box"
                                                                >
                                                                    <p className="applicant-status">{post.applicant_status}</p>
                                                                    <p
                                                                        className="match-me-cancel-apply"
                                                                        onClick={this.cancelApply}
                                                                        name="신청취소"
                                                                        type="submit"
                                                                        data-idmatch={post.idmatch}
                                                                        data-order_number={post.order_number}
                                                                        data-start_time={post.start_time}
                                                                        data-amount={post.amount_of_payment}
                                                                        style={{ width: "100%" }}
                                                                    >신청 취소</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                }
                                                {
                                                    /* 신청 취소된 경기 */
                                                    (post.applicant_status === '신청취소' && this.state.user.data[0].iduser !== post.hostID)
                                                    && <Link
                                                            prefetch
                                                            href={{ pathname: '/match', query: { id: post.idpost }}}
                                                        >
                                                            <div className="match">
                                                                <div className="match-time">
                                                                    <p className="match-status">{post.match_status}</p>
                                                                    <p className="time">{moment.parseZone(post.start_time).local().format('HH:mm')}</p>
                                                                </div>
                                                                <div className="match-place">
                                                                    <p className="place">{post.place_name}</p>
                                                                    <p className="match-type">
                                                                    <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}</p>
                                                                </div>
                                                                <div
                                                                    className="status-box"
                                                                >
                                                                    <p className="applicant-status">{post.reason_for_cancel}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                }
                                                {
                                                    /* 내 경기일 때 */
                                                    this.state.user.data[0].iduser === post.hostID
                                                    && <div className="match_status_container">
                                                            <div className="match_status_contents">
                                                                <p className="status-title">상태</p>
                                                                <p className="status-desc">{post.match_status}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>게시일</p>
                                                                <p>{moment.parseZone(post.create_time).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>게시유형</p>
                                                                <p>{post.post_type}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>경기날짜</p>
                                                                <p>{moment.parseZone(post.start_time).local().format('YYYY-MM-DD')} ({this.convertDay(moment.parseZone(post.start_time).local().format('dddd'))}) - {post.match_status}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>경기시간</p>
                                                                <p>{moment.parseZone(post.start_time).local().format('HH:mm')} - {moment.parseZone(post.end_time).local().format('HH:mm')}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>경기유형</p>
                                                                <p>{post.sports_category} {post.match_type}:{post.match_type}</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>경기장소</p>
                                                                <p>{post.place_name}<br />({post.address})</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>경기금액</p>
                                                                <p>{`${post.match_fee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                                            </div>
                                                            <div className="match_status_contents">
                                                                <p>모집 게스트 수</p>
                                                                <p>{post.total_guest}명</p>
                                                            </div>
                                                        </div>
                                                }
                                                {
                                                    /* 내가 신청한 경기 */
                                                    (post.applicant_status !== '신청취소' && this.state.user.data[0].iduser !== post.hostID)
                                                    && <div className="apply_status_container">
                                                            <div className="apply_status_contents">
                                                                <p className="status-title">상태</p>
                                                                <p className="status-desc">{post.applicant_status} ({post.payment_status})</p>
                                                            </div>
                                                            <div className="apply_status_contents">
                                                                <p>신청일시</p>
                                                                <p>{moment.parseZone(post.apply_time).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                                                            </div>
                                                            <div className="apply_status_contents">
                                                                <p>입금자명</p>
                                                                <p>{post.depositor}</p>
                                                            </div>
                                                            <div className="apply_status_contents">
                                                                <p>결제상태</p>
                                                                <p>{post.payment_status} ({post.payment_method})</p>
                                                            </div>
                                                            <div className="apply_status_contents">
                                                                <p>결제금액</p>
                                                                <p>{post.amount_of_payment === null ? 0 : post.amount_of_payment.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                                            </div>
                                                            <div className="apply_status_contents">
                                                                <p>결제일시</p>
                                                                <p>{post.payment_time !== null ? moment.parseZone(post.payment_time).local().format('YYYY-MM-DD HH:mm:ss') : ''}</p>
                                                            </div>
                                                        </div>
                                                }
                                                {
                                                    /* 신청 취소된 경기 */
                                                    (post.applicant_status === '신청취소' && this.state.user.data[0].iduser !== post.hostID)
                                                    &&
                                                    <div className="cancel_contents_container">
                                                            <div className="cancel_contents">
                                                                <p className="status-title">상태</p>
                                                                <p className="status-desc">{post.reason_for_cancel} - {post.refund_status}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>신청일시</p>
                                                                <p>{moment.parseZone(post.apply_time).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>결제금액</p>
                                                                <p>{post.amount_of_payment === null ? 0 : post.amount_of_payment.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>결제일시</p>
                                                                <p>{post.payment_time !== null ? moment.parseZone(post.payment_time).local().format('YYYY-MM-DD HH:mm:ss') : '-'}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>취소일시</p>
                                                                <p>{moment.parseZone(post.cancel_time).local().format('YYYY-MM-DD HH:mm:ss')}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>취소사유</p>
                                                                <p>{post.reason_for_cancel}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>환불상태</p>
                                                                <p>{post.refund_status}</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>환불금액</p>
                                                                <p>{`${post.refund_fee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                                                            </div>
                                                            <div className="cancel_contents">
                                                                <p>환불계좌</p>
                                                                <p>{post.bank_account}</p>
                                                            </div>
                                                        </div>
                                                }
                                            </li>
                                        );
                                    }
                                })
                            }
                        </ul>
                    </div>
                </Layout>
            </div>
        );
    }
}

export default Me;