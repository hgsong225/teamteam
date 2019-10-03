import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { withRouter } from 'next/router'
import axios from 'axios';
import moment from 'moment';

import fb from '../config/firebase';

import Layout from '../components/layout/Layout';
import Posts from '../components/smart/post/Posts';


class Post extends Component {
    static async getInitialProps ({req}) {
        return req
        ? { from: 'server' } // 서버에서 실행 할 시
        : { from: 'client '} // 클라이언트에서 실행 할 시
    }

    state = {
        user: null,
        selectedLocation: {},
        allPosts: [],
        didYouGetResponseWithPostsFromServer: false,
    }
    
    componentDidMount() {
        const { query } = this.props.router;
        console.log('post.js 에서 componentDidMount 실행');
        this.authListener();
        const selectedLocation = {
            sido_name: this.props.router.query.location,
            sigungu_name: this.props.router.query.sigungu,
            area: this.props.router.query.area,
            start_time: `${moment().add(0, 'd').format("YYYY")}-${moment().add(0, 'd').format("MM")}-${moment().add(0, 'd').format("DD")}`,
        };

        let target;

        if (query.hasOwnProperty('sigungu_name')) target = 'sigungu';
        else if (query.hasOwnProperty('location') && !query.hasOwnProperty('area')) target = 'sido';
        else if (query.hasOwnProperty('area') && !query.hasOwnProperty('sigungu_name')) target = 'area';

        console.log(`target`, target);


        this.selectLocation(selectedLocation, target);

    }

    isEmptyObj = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
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

    getState = async () => {
        return this.state;
    }

    selectLocation = async (selectedLocation, target) => {
        await this.setState({ selectedLocation });
        const state = await this.getState();
        await console.log('123123123123', state);
        await this.getLocationBasedPosts(this.state.selectedLocation, target);
        const abc = await this.getState();
        await console.log('다음', abc);
    }

    getLocationBasedPosts = async (selectedLocation, target) => {
        console.log('getLocationBasedPosts 실행');
        console.log(selectedLocation);

        if (!this.isEmptyObj(selectedLocation)) {
            const self = this;
            const sido_name = selectedLocation.sido_name;
            const sigungu_name = selectedLocation.sigungu_name;
            const start_time = selectedLocation.start_time;
            const checkSigungu = sigungu_name == undefined ? false : true;
            console.log(checkSigungu);
            // if (!checkSigungu) {
            //     return self.setState({
            //         allPosts: [],
            //     });
            // }
            const params = {
                sido_name,
                sigungu_name,
                area: selectedLocation.area,
                start_time,
                target,
            };
            axios.get(`/api/post/location`, {
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
    }

    render() {
        console.log('post.js에서 render() 실행');
        const { user, selectedLocation, allPosts, myMatch, myApplicationMatch } = this.state;
        const { url, router, query } = this.props;

        let target;

        if (router.query.hasOwnProperty('sigungu_name')) target = `${router.query.location} ${router.query.sigungu_name}`; // 시군구가 있을 떄
        else if (router.query.hasOwnProperty('location') && !router.query.hasOwnProperty('area')) target = `${router.query.location}`; // 시도만 있을 때
        else if (router.query.hasOwnProperty('area') && !router.query.hasOwnProperty('sigungu_name')) target = `${router.query.area}`; // 시군구는 없고 area를 포함 할 때

        return (
            <Layout
                selectLocation={this.selectLocation}
                selectedLocation={selectedLocation}
            >
                <Head>
                    <title>팀팀 | 매치찾기 - {target}</title>
                </Head>
                {
                    this.state.didYouGetResponseWithPostsFromServer === true
                    ? <Posts 
                        url={url}
                        user={user}
                        selectedLocation={selectedLocation}
                        getLocationBasedPosts={this.getLocationBasedPosts}
                        allPosts={allPosts}
                    />
                    : <p>loading...</p>
                }

            </Layout>
        );
    }
}

export default withRouter(Post);
