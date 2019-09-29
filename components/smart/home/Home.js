import React, { Component } from 'react';
import moment from 'moment';

import PostList from '../../dumb/post/postlist';

class Home extends Component {
    static defaultProps = {
        user: null,
        allPosts: [],
    }

    state = {
        selectedDay: {
            YYYY: `${moment().add(0, 'd').format("YYYY")}`,
            MM: `${moment().add(0, 'd').format("MM")}`,
            DD: `${moment().add(0, 'd').format("DD")}`,
            dddd: `${moment().add(0, 'd').format("dddd")}`,
            type: 'today',
        },
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

    handleDateFilter = (selectedDay, based) => {
        const matchBased = {
            location: {
                getMatch: this.props.getLocationBasedPosts,
            },
            start: {
                getMatch: this.props.getStartTimeBasedPosts
            }
        }
        
        this.setState(prevState => {
            let newDate = Object.assign({}, selectedDay);
            newDate.type = 'selected';
            return { selectedDay: newDate };
        }, () => {
            let start_time = `${selectedDay.YYYY}-${selectedDay.MM}-${selectedDay.DD}`;
            let params = { start_time }

            matchBased[based].getMatch(params);
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
        const { allPosts } = this.state;

        return (
            <div className="posts-container">
                <style jsx>{`
                    .posts-container {
                        width: 100%;
                        max-width: 720px;
                    }
                `}</style>
                <h2 className="title">WELCOME TO TEAMTEAM !</h2>
                <p>
                    나에게 알맞는 매치를 신청하세요!
                </p>
                <div className="posts-sub-container">
                    <PostList
                        url={this.props.url}
                        user={this.props.user}
                        allPosts={this.props.allPosts}
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

export default Home;