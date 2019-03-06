import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import fb from '../../config/firebase';
import Layout from '../../components/layout/Layout';

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

    handleRemove = (e) => { // 유저가 나인지 정확히 확인 할 것
        e.preventDefault();
        const { posts } = this.state;
        const idpost = Number(e.target.name);
        const params = {
            idpost,
        };

        if (confirm("삭제하면 되돌릴 수 없습니다. 정말 삭제하시겠습니까?")) {
            this.setState({
                posts: posts.filter(post => post.idpost !== idpost),
            });
            
            axios.get('http://localhost:3333/api/match/me/remove', {
                params,
            })
            .then((res) => {
                console.log(res);
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
        return (
            <div>
                <Layout>
                    <div className="posts-container">
                        <style jsx>{`
                        .posts-container {
                            max-width: 720px;
                            width: 100%;
                        }
                        .title-box {
                            margin-top: 2rem;
                            margin-bottom: 2rem;
                        }
                        .title {
                            font-size: 2rem;
                            margin: 0;
                            margin-bottom: 2rem;
                        }
                        .sub-title{
                            font-size: 1rem;
                        }
                        ul {
                            list-style-type: none;
                            margin: 0;
                            padding: 0;
                        }
                        .match {
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            width: 100%;
                            height: 8rem;
                            background-color: #fafafa;
                            border-radius: 4px;
                            margin-bottom: 1rem;
                        }
                        .match-time {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            color: #212121;
                            font-size: 1.5rem;
                            font-weight: 600;
                            letter-spacing: 0.25rem;
                        }
                        .match-status {
                            font-size: 1rem;
                            font-weight: normal;
                            margin-top: 0px;
                            margin-bottom: 2px;
                        }
                        .time {
                            margin: 0;
                        }
                        .match-place {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            color: #212121;
                        }
                        .place {
                            margin: 0;
                            font-size: 1.2rem;
                            margin-bottom: 1rem;
                        }
                        .match-type {
                            margin: 0;
                            font-size: 0.9rem;
                        }
                        .status-box {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                        }
                        .applicant-status {
                            margin: 0rem;
                            margin-bottom: 1rem;
                            color: #009688;
                        }
                        .cancel-apply {
                            margin: 0;
                            color: #e91e63;
                            cursor: pointer;
                        }
                        .match-apply {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .match-apply-button {
                            cursor: pointer;
                            text-decoration: none;
                            border: none;
                            background-color: #2196f3;
                            font-size: 1rem;
                            color: white;
                            padding: 8px 40px;
                        }
                        
                        .match-apply-button:hover {
                            background-color: #42a5f5;
                        }
                    `}</style>
                        <div className="title-box">
                            <h3 className="title">다가오는 내 매치</h3>
                            <p className="page-desc">입금을 완료해야 참여 확정됩니다!<br />경기는 입금 선착순으로 마감되니 신청 후 바로 입금해주세요.</p>
                        </div>
                        <ul>
                            {
                                this.state.posts.sort(this.date_ascending).map((post, i) => {
                                    if (post.start_time !== undefined) {
                                        const start_year = new Date(post.start_time).getFullYear();
                                        const start_month = new Date(post.start_time).getMonth();
                                        const start_date = new Date(post.start_time).getDate();
                                        const isSameDate = i >= 1
                                        ? (new Date(start_year, start_month, start_date).getTime() == new Date(new Date(posts[i - 1].start_time).getFullYear(), new Date(posts[i - 1].start_time).getMonth(), new Date(posts[i - 1].start_time).getDate()).getTime())
                                        : false;
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
                                                                    <p
                                                                        className="cancel-apply"
                                                                        onClick={this.handleRemove}
                                                                        name={post.idpost}
                                                                        type="submit"
                                                                        value="신청 취소"
                                                                        style={{ width: "100%" }}
                                                                    >신청 취소</p>
                                                                </div>
                                                            :
                                                                <div
                                                                    className="status-box"
                                                                >
                                                                <p
                                                                    className="remove-match"
                                                                    onClick={this.handleRemove}
                                                                    name={post.idpost}
                                                                    type="submit"
                                                                    value="삭제"
                                                                    style={{ width: "100%" }}
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