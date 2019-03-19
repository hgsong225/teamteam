import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import fb from '../../config/firebase';
import Layout from '../../components/layout/Layout';

import '../../style/match-me.css';

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
                this.setState({
                    user,
                });
            } else {
                this.setState({
                    user: null,
                });
                Router.push('/sign-in');
            }
        });
    }

    date_ascending = (a, b) => {
        let dateA = new Date(a['start_time']).getTime();
        let dateB = new Date(b['start_time']).getTime();
        return dateA > dateB ? 1 : -1;
    }

    getMyMatch = (user) => {
        const params = {
            uid: user.uid,
        };

        axios.get('http://localhost:3333/api/match/me', {
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

        axios.get('http://localhost:3333/api/match/me/apply', {
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

    handleCancleApply = (e) => { // 신청 취소 버튼

    }

    handleEdit = (e) => { // 경기 수정 버튼
        e.preventDefault();
    }

    handleRemove = (e) => { // 유저가 나인지 정확히 확인 할 것
        e.preventDefault();
        const { posts } = this.state;
        const idpost = e.target.getAttribute('name');
        const params = {
            idpost,
        };

        if (confirm("삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?")) {
            this.setState({
                posts: posts.filter(post => post.idpost !== idpost),
            });
            
            axios.delete('http://localhost:3333/api/match/me', {
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
                        <div className="title-box">
                            <h3 className="title">다가오는 내 매치</h3>
                            <p className="page-desc">
                                입금계좌 - 신한은행 신한 110-439-532672 팀팀
                                <br />
                                입금을 완료해야 참여 확정됩니다!
                                <br />
                                *경기는 입금 선착순으로 마감되니 신청 후 바로 입금해주세요.
                            </p>
                        </div>
                        <ul>
                            {
                                this.state.posts !== undefined && this.state.posts.sort(this.date_ascending).map((post, i) => {
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
                                                        {post.start_time.slice(5, 7)}월 {post.start_time.slice(8, 10)}일
                                                    </h3>
                                                }
                                                <Link
                                                        prefetch    
                                                        href={{ pathname: '/match', query: { id: post.idpost }}}
                                                >
                                                    <div className="match">
                                                        <div className="match-time">
                                                            <p className="match-status">{post.match_status}</p>
                                                            <p className="time">{post.start_time.slice(11, 16)}</p>
                                                        </div>
                                                        <div className="match-place">
                                                            <p className="place">{post.place_name}</p>
                                                            <p className="match-type">
                                                            <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}, <span>{post.total_guest}명 모집 중</span></p>
                                                        </div>
                                                        {
                                                            post.apply_time !== undefined
                                                            ?
                                                                <div
                                                                    className="status-box"
                                                                >
                                                                    <p className="applicant-status">{post.applicant_status}</p>
                                                                    {
                                                                        post.applicant_status !== '신청취소(거절)'
                                                                        && <p
                                                                            className="cancel-apply"
                                                                            onClick={this.handleRemove}
                                                                            name={post.idpost}
                                                                            type="submit"
                                                                            value="신청 취소"
                                                                            style={{ width: "100%" }}
                                                                        >신청 취소</p>
                                                                    }
                                                                </div>
                                                            :
                                                                <div
                                                                    className="status-box-remove"
                                                                    name={post.idpost}
                                                                >
                                                                    <p
                                                                        className="edit-match"
                                                                        name={post.idpost}
                                                                    >
                                                                        수정
                                                                    </p>
                                                                    <p
                                                                        className="remove-match"
                                                                        onClick={this.handleRemove}
                                                                        name={post.idpost}
                                                                        type="submit"
                                                                        value="삭제"
                                                                    >삭제</p>
                                                            </div>
                                                        }
                                                    </div>
                                                </Link>
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