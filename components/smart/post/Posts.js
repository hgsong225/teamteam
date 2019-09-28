import React, { Component } from 'react';
const querystring = require('querystring');
import moment from 'moment';

import fb from '../../../config/firebase';

import PostList from '../../dumb/post/PostList';
import PostFilter from '../../dumb/post/PostFilter';


class Posts extends Component {
    static defaultProps = {
        user: null,
        selectedLocation: {},
    }

    state = {
        user: null,
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
            //     name: '용병모집',
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
        selectedDayNumber: 0,
        renderFilterList: [],

    }

    componentDidMount() {
        const { selectedLocation } = this.props;
        console.log('Posts에서 componentDidMount 실행');
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

    getState = () => {
        return this.state;
    }

    getDate = (number) => {
        const date = [];

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
            let DD = moment().add(i, 'd').format("D일")
            let dddd = moment().add(i, 'd').format("dddd")
            let type = "";

            type = i === 0 ? "today": "default";
            date.push({DD, dddd, type});
        }

        return date.map(data => {
            return (
                <div
                    className="select_date"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: `${100/number}%`,
                        backgroundColor: `${dateFilterOption[data.type].backgroundColor}`,
                        color: `${dateFilterOption[data.type].color}`,
                        cursor: 'pointer',
                    }}
                >
                    <p>{data.DD}</p>
                    <p>{this.convertDay(data.dddd)}</p>
                </div>
            )
        })
    }

    handleDateFilter = () => {
        e.preventDefault();
        
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
                <h2 className="title">경기</h2>
                <p
                    className="sub-title"
                    name='mainTitle'
                >
                    {url.query.sigungu ? url.query.location + ' ' : url.query.location}{url.query.sigungu}
                </p>
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
                        user={this.props.user}
                        posts={this.props.posts}
                        postList={postList}
                        selectedFilter={selectedFilter}
                        convertDay={this.convertDay}
                        selectedDayNumber={this.props.selectedDayNumber}
                        getDate={this.getDate}
                    />
                 </div>
            </div>
        );
    }
}

export default Posts;