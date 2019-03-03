import React, { Component } from 'react';
import axios from 'axios';

import Layout from '../components/layout/Layout';
import Posts from '../components/smart/post/Posts';

class Post extends Component {
    static async getInitialProps ({req}) {
        return req
        ? { from: 'server' } // 서버에서 실행 할 시
        : { from: 'client '} // 클라이언트에서 실행 할 시
    }

    state = {
        selectedLocation: {},
        posts: [],
    }

    componentDidMount() {
        console.log('post.js 에서 componentDidMount 실행');
        const selectedLocation = {
            sido_name: this.props.url.query.location,
            sigungu_name: this.props.url.query.sigungu,
        };
        this.selectLocation(selectedLocation);
    }

    isEmptyObj = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
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
            if (!checkSigungu) {
                return self.setState({
                    posts: [],
                });
            }
            const params = {
                sido_name,
                sigungu_name,
            };
            axios.get('http://localhost:3333/post/location', {
                params,
            })
            .then((res) => {
                self.setState({
                    posts: res.data,
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
        const { selectedLocation, posts } = this.state;
        const { url } = this.props;
        console.log('url', url);

        return (
            <Layout
                selectLocation={this.selectLocation}
                selectedLocation={selectedLocation}
            >
                <Posts 
                    url={url}
                    selectedLocation={selectedLocation}
                    posts={posts}
                />
            </Layout>
        );
    }
}

export default Post;
