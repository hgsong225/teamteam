import React, { Component } from 'react';
const querystring = require('querystring');
import moment from 'moment';
import { withRouter } from 'next/router'

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
        selectedDay: {
            YYYY: `${moment().add(0, 'd').format("YYYY")}`,
            MM: `${moment().add(0, 'd').format("MM")}`,
            DD: `${moment().add(0, 'd').format("DD")}`,
            dddd: `${moment().add(0, 'd').format("dddd")}`,
            type: 'today',
        },
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

    handleDateFilter = (selectedDay, based) => {
        const { query } = this.props.router;
        const matchBased = {
            location: {
                getMatch: this.props.getLocationBasedPosts,
            },
            start: {
                getMatch: this.props.getStartTimeBasedPosts
            }
        }
        
        console.log(`selectedDay`, selectedDay);

        this.setState(prevState => {
            let newDate = Object.assign({}, selectedDay);
            newDate.type = 'selected';
            return { selectedDay: newDate };
        }, () => {
            let start_time = `${selectedDay.YYYY}-${selectedDay.MM}-${selectedDay.DD}`;
            let params = Object.assign(this.props.selectedLocation, { start_time });
            let target;

            if (query.hasOwnProperty('sigungu_name')) target = 'sigungu';
            else if (query.hasOwnProperty('location') && !query.hasOwnProperty('area')) target = 'sido';
            else if (query.hasOwnProperty('area') && !query.hasOwnProperty('sigungu_name')) target = 'area';    

            console.log(`target`, target);

            matchBased[based].getMatch(params, target);
        })
    }

    compareMatchDate = (startTime) => {
        const { selectedDay: { YYYY, MM, DD, type} } = this.state;
        let haveAGameOnThisDay = false;

        let selectedDate = [YYYY, MM - 1, DD];

        let selectedDateTemp = moment(selectedDate);
        let startDate = moment.parseZone(startTime).local().format('YYYY MM DD').split(' ');
        let startDateTemp = moment([startDate[0], startDate[1] - 1, startDate[2]]);
        const result = selectedDateTemp.diff(startDateTemp, 'days') // result = 0 당일임. result가 0보다 크거나 작으면 없음.

        console.log(selectedDateTemp);
        console.log(startDateTemp);

        haveAGameOnThisDay = result === 0 ? true : false;

        return haveAGameOnThisDay;
    }

    render() {
        console.log('Posts에서 render() 실행');
        const { postList, filterList, selectedFilter, renderFilterList } = this.state;
        const { url, selectedLocation, router } = this.props;
        console.log('url in postjs', url);
        console.log('this props in Post js', this.props);
        let target;

        if (router.query.hasOwnProperty('sigungu_name')) target = `${selectedLocation.display_name || router.query.location} ${router.query.sigungu_name}`; // 시군구가 있을 떄
        else if (router.query.hasOwnProperty('location') && !router.query.hasOwnProperty('area')) target = `${selectedLocation.display_name || router.query.location}`; // 시도만 있을 때
        else if (router.query.hasOwnProperty('area') && !router.query.hasOwnProperty('sigungu_name')) target = `${router.query.area}`; // 시군구는 없고 area를 포함 할 때

        return (
            <div className="posts-container">
                <style jsx>{`
                    .posts-container {
                        width: 100%;
                        max-width: 720px;
                    }
                    .title {
                        margin-top: 2rem;
                        margin-bottom: 2rem;
                        font-size: 2rem;
                    }
                    .sub-title{
                        font-size: 1rem;
                    }
                `}</style>
                <header className="title">매치</header>
                <p
                    className="sub-title"
                    name='mainTitle'
                >
                    {target}
                    {/* {url.query.sigungu ? url.query.location + ' ' : url.query.location}{url.query.sigungu} */}
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
                        url={this.props.url}
                        renderPosts={this.renderPosts}
                        user={this.props.user}
                        allPosts={this.props.allPosts}
                        postList={postList}
                        selectedFilter={selectedFilter}
                        convertDay={this.convertDay}
                        selectedDay={this.state.selectedDay}
                        handleDateFilter={this.handleDateFilter}
                        compareMatchDate={this.compareMatchDate}
                    />
                 </div>
            </div>
        );
    }
}

export default withRouter(Posts);
