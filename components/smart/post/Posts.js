import React, { Component } from 'react';
import axios from 'axios';
const querystring = require('querystring');

import fb from '../../../config/firebase';

import PostList from '../../dumb/post/PostList';
import PostFilter from '../../dumb/post/PostFilter';

class Posts extends Component {
    static defaultProps = {
        selectedLocation: {},
    }

    state = {
        user: null,
        depositor: '',
        willBeAppliedMatch: [],
        postList: [],
        selectedFilter: '전체', // default: 전체
        filterList: [
            // {
            //     name: '전체',
            //     desc: '모든 게시물입니다.',
            // },
            // {
            //     name: '상대팀 모집',
            //     desc: '축구/풋살 경기 중 상대팀이 필요한 게시물입니다.',
            // },
            // {
            //     name: '용병 대기',
            //     desc: '경기에 참여 할 수 있는 제 3자(개인 또는 단체)가 대기중인 게시물입니다.',
            // },
            // {
            //     name: '용병 모집',
            //     desc: '경기에 참여 할 수 있는 제 3자(개인 또는 단체)를 모집하는 게시물입니다.',
            // },
            // {
            //     name: '팀원 모집',
            //     desc: '새로운 팀원을 모집하는 게시글입니다.',
            // },
            // {
            //     name: '팀 입단 원함',
            //     desc: '팀에 새로 가입하고 싶은 사람들의 게시물입니다.',
            // },
        ],
        renderFilterList: [],
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
            }
        });
    }

    componentDidMount() {
        const { selectedLocation } = this.props;
        console.log('Posts에서 componentDidMount 실행');
        this.authListener();
    }

    handleFilter = (e) => {
        this.setState({
            selectedFilter: e.target.value,
        });
    }

    renderFilter = (postFilterList) => {
        this.setState({
            renderFilterList: postFilterList,
        });
    }

    renderPosts = (postList) => {
        console.log('Posts에서 renderPosts 실행');

        this.setState({
            postList,
        });
    }

    getState = () => {
        return this.state;
    }

    applyMatch = async (e, depositor) => {
        const { user, willBeAppliedMatch } = this.state;
        const { posts } = this.props;
        console.log('tlqkf', e.target);
        // await this.setState({ depositor, willBeAppliedMatch: selectedMatch, });
        // const state = await this.getState();
        
        if (user !== null && e.target.name !== undefined) {
            const idmatch = e.target.name;
            const selectedMatch = posts.filter(post => post.idmatch == idmatch);
            console.log(user, idmatch, selectedMatch);
            if (selectedMatch.length > 0) {
                const data = {
                    idmatch: selectedMatch[0].idmatch,
                    uid: user.uid,
                    depositor,
                    match_has_user_fee: selectedMatch[0].match_fee,
                }
        
                axios.post('http://localhost:3333/api/match/apply', {
                    data,
                })
                .then((res) => {
                    console.log(res.data);
                    alert('신청 완료');
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
    
    render() {
        console.log('Posts에서 render() 실행');
        const { postList, filterList, selectedFilter, renderFilterList } = this.state;
        const { url, selectedLocation } = this.props;
        console.log('url in postjs', url);
        console.log('this props in Post js', this.props);

        return (
            <div className="posts-container">
                <style jsx>{`
                    .posts-container {
                        width: 100%;
                        max-width: 720px;
                    }
                    .title {

                    }
                    .sub-title{
                        font-size: 1rem;
                    }
                `}</style>
                <h2 className="title">다가오는 매치</h2>
                <p
                    className="sub-title"
                    name='mainTitle'
                >
                    {url.query.sigungu ? url.query.location + ' ' : url.query.location}{url.query.sigungu}
                </p>
                {
                    url.query.sigungu
                    ?
                        <div className="posts-sub-container">
                            <PostFilter
                                handleFilter={this.handleFilter}
                                renderFilter={this.renderFilter}
                                filterList={filterList}
                                selectedFilter={selectedFilter}
                                renderFilterList={renderFilterList}
                            />
                            <PostList
                                renderPosts={this.renderPosts}
                                applyMatch={this.applyMatch}
                                posts={this.props.posts}
                                postList={postList}
                                selectedFilter={selectedFilter}
                                depositor={this.props.depositor}
                            />
                        </div>
                    : '하위 지역을 선택하세요.'         
                }

            </div>
        );
    }
}

export default Posts;