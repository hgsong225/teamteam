import React, { Component } from 'react';
import Head from 'next/head';
import axios from 'axios';
import moment from 'moment';

import fb from '../config/firebase';

import Layout from '../components/layout/Layout';
import Home from '../components/smart/home/Home';
import Loading from '../components/dumb/loading';

class Index extends Component {
    state = {
        user: null,
        allPosts: [],
        didYouGetResponseWithPostsFromServer: false,
    }

    componentDidMount() {
        this.authListener();
        this.getStartTimeBasedPosts(moment().format('YYYY-MM-DD'))
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
            }
        });
    }

    getState = async () => {
        return this.state;
    }

    getStartTimeBasedPosts = async (start_time) => {
        console.log('getLocationBasedPosts 실행');
        console.log(start_time);

        const self = this;
        const params = {
            start_time: start_time.start_time,
        };
        axios.get(`/api/post/start`, {
            params,
        })
        .then((res) => {
            self.setState({
                allPosts: res.data,
                didYouGetResponseWithPostsFromServer: true,
            })
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    getDate = (number) => {
        const date = [];
        const { selectedDay: { MM, DD, type} } = this.state;

        let dateFilterOption = {
            today: {
                backgroundColor: "rgba(66,133,244,0.149)",
                color: "#1e88e5",
            },
            default: {
                backgroundColor: "white",
                color: "#212121",
            },

            selected: {
                backgroundColor: "rgba(66,133,244,0.149)",
                color: "#1e88e5",
            }
        }

        for (let i = 0; i < number; i += 1) {
            let YYYY = moment().add(i, 'd').format("YYYY")
            let MM = moment().add(i, 'd').format("MM")
            let DD = moment().add(i, 'd').format("DD")
            let dddd = moment().add(i, 'd').format("dddd")
            let type = "default";

            date.push({
                YYYY,
                MM,
                DD,
                dddd,
                type
            });
        }

        const dataFilterList = date.map(data => {
            const checkSelected = data.MM === MM && data.DD === DD;
            return (
                <div
                    className="select_date"
                    onClick={() => this.handleDateFilter(data)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: `${100/number}%`,
                        backgroundColor: `${dateFilterOption[checkSelected ? type : data.type].backgroundColor}`,
                        color: `${dateFilterOption[checkSelected ? type : data.type].color}`,
                        cursor: 'pointer',
                        borderRadius: '0.5rem',
                    }}
                >
                    <p>{data.DD}일</p>
                    <p>{this.convertDay(data.dddd)}</p>
                </div>
            )
        })

        this.setState({ dataFilterList });
    }

    render() {
        const { user, selectedDay, allPosts, dataFilterList} = this.state;
        const { url } = this.props;

        return (
            <Layout user={user}>
                <Head>
                    <title>팀팀 | 내 주변 축구 경기 참여하기 | 간편하게 축구 할 사람 모으기</title>
                </Head>
                {
                    this.state.didYouGetResponseWithPostsFromServer === true
                    ? <Home 
                        url={url}
                        user={user}
                        selectedDay={selectedDay}
                        getStartTimeBasedPosts={this.getStartTimeBasedPosts}
                        allPosts={allPosts}
                    />
                    : <Loading />
                }
            </Layout>
        );
    }
}

export default Index;
