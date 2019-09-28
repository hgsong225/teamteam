import React, { Component } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { withRouter } from 'next/router'
import axios from 'axios';

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
        console.log('post.js 에서 componentDidMount 실행');
        const selectedLocation = {
            sido_name: this.props.url.query.location,
            sigungu_name: this.props.url.query.sigungu,
        };
        this.authListener();
        this.selectLocation(selectedLocation);
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

    selectLocation = async (selectedLocation) => {
        await this.setState({ selectedLocation });
        const state = await this.getState();
        await console.log('123123123123', state);
        await this.getLocationBasedPosts(this.state.selectedLocation);
        const abc = await this.getState();
        await console.log('다음', abc);
    }

    getLocationBasedPosts = async (selectedLocation) => {
        console.log('getLocationBasedPosts 실행');
        console.log(selectedLocation);

        if (!this.isEmptyObj(selectedLocation)) {
            const self = this;
            const sido_name = selectedLocation.sido_name;
            const sigungu_name = selectedLocation.sigungu_name;
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
        const { url, router } = this.props;

        return (
            <Layout
                selectLocation={this.selectLocation}
                selectedLocation={selectedLocation}
            >
                <Head>
                    <title>팀팀 | 매치찾기 - {router.query.location}</title>
                </Head>
                {
                    this.state.didYouGetResponseWithPostsFromServer === true
                    ? <Posts 
                        url={url}
                        user={user}
                        selectedLocation={selectedLocation}
                        allPosts={allPosts}
                    />
                    : <p>loading...</p>
                }

            </Layout>
        );
    }
}

export default withRouter(Post);
