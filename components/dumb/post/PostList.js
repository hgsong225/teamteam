import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import moment from 'moment';
import { withRouter } from 'next/router';

const applyStatusOption = {
    신청가능: {
        color: "#2196f3",
        text: "신청하기",
        value: "신청하기",
    },
    신청불가: {
        color: "#ff4d4f",
        text: "신청불가",
        value: "신청불가",
    },
    인원마감: {
        color: "#faad14",
        text: "인원마감",
        value: "신청불가",
    }
}

const styles = {
    button: {
        color: "#2196f3",
    },
}

class PostList extends Component {
    static defaultProps = {
        user: null,
        allPosts: [],
        postList: [],
        selectedFilter: '전체',
        selectedDay: {

        },
    }

    async componentDidMount() {
        console.log('PostList에서 componentDidMount 실행');
    }

    dateAscendingOrder = (a, b) => { // 날짜 오름차순, dateA가 크면 true, dateB가 크거나 같으면 false
        let timeA = new Date(a['start_time']).getTime();
        let timeB = new Date(b['start_time']).getTime();
        return timeA > timeB ? 1 : -1;
    }

    getDate = (number) => {
        const date = [];
        const { selectedDay: { MM, DD, type} } = this.props;

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

        return date.map(data => {
            const checkSelected = data.MM === MM && data.DD === DD;
            return (
                <div
                    className="select_date"
                    onClick={() => this.props.handleDateFilter(data)}
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
                    <p>{this.props.convertDay(data.dddd)}</p>
                </div>
            )
        })
    }

    compareMatchDate = (startTime) => {
        const { selectedDay: { YYYY, MM, DD, type} } = this.props;
        let today = '';

        let selectedDate = [YYYY, MM - 1, DD];

        let selectedDateTemp = moment(selectedDate);
        let startDate = moment.parseZone(startTime).local().format('YYYY MM DD').split(' ');
        let startDateTemp = moment([startDate[0], startDate[1] - 1, startDate[2]]);
        const result = selectedDateTemp.diff(startDateTemp, 'days') // 1

        console.log(selectedDateTemp);
        console.log(startDateTemp);


        today = result === 0 ? true : false;

        console.log(today);

        return today;
    }



    render() {
        console.log('PostList에서 render 실행');
        const { allPosts, selectedFilter } = this.props;
        return (
            <div>
                <Head>
                    <link href="../../static/postlist.css" rel="stylesheet" />
                </Head>
                <div
                    style={{
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    {
                        this.getDate(7)
                    }
                </div>
                <ul style={{marginTop: '2rem'}}>
                    {
                        allPosts.length > 0 ? allPosts.sort(this.dateAscendingOrder).map(
                            (post, i) => {
                                if (selectedFilter == '전체' && post.idmatch != null && this.compareMatchDate(post.start_time)) {
                                    return (
                                            <li className="match-list">
                                                <Link
                                                    prefetch
                                                    key={post.idpost}
                                                    href={{ pathname: '/match', query: { id: post.idpost }}}
                                                >
                                                    <div className="match">
                                                        <div className="match-time">
                                                            {moment.parseZone(post.start_time).local().format('HH:mm')}
                                                        </div>
                                                        <div className="match-place">
                                                            <p className="place">{post.place_name}</p>
                                                            <p className="match-type">
                                                                <span className="">{post.sido_name} {post.sigungu_name} {post.sports_category} {post.match_type} : {post.match_type}       {post.total_guests_available}명남음!</span>
                                                            </p>
                                                        </div>
                                                        <div className="match-apply">
                                                            {
                                                                // 신청하기 (로그인유저) - 신청 가능한 경기
                                                                this.props.user !== null // check signed in
                                                                && (post.hostID !== this.props.user.data[0].iduser) // check match host 'false'
                                                                && (post.apply_status === "신청가능") //check guest full 'false'
                                                                    &&
                                                                    <Link
                                                                        href={{ pathname: 'payment', query: { post: post.idpost, match: post.idmatch }}}
                                                                    >
                                                                        <a
                                                                            className="button"
                                                                            value={applyStatusOption[post.apply_status].value}
                                                                            style={{backgroundColor: applyStatusOption[post.apply_status].color}}
                                                                        >
                                                                            {applyStatusOption[post.apply_status].text} {post.match_fee}
                                                                        </a>
                                                                    </Link>
                                                            }
                                                            {
                                                                // 신청하기 (로그인유저) - 인원 마감된 경기
                                                                this.props.user !== null // check s igned in
                                                                && (post.hostID !== this.props.user.data[0].iduser) // check match host 'false'
                                                                && (post.apply_status === "인원마감") //check guest full 'true'
                                                                    &&
                                                                    <Link
                                                                        href={{ pathname: '/match', query: { id: post.idpost }}}
                                                                    >
                                                                        <a
                                                                            className="button closed"
                                                                            value={applyStatusOption[post.apply_status].value}
                                                                            style={{backgroundColor: applyStatusOption[post.apply_status].color}}
                                                                        >
                                                                            {applyStatusOption[post.apply_status].text}
                                                                        </a>
                                                                    </Link>
                                                            }
                                                            {
                                                                // 신청하기 (로그인유저) - 신청 불가능한 경기
                                                                this.props.user !== null // check signed in
                                                                && (post.hostID !== this.props.user.data[0].iduser) // check match host 'false'
                                                                && (post.apply_status === "신청불가") //check guest full 'false'
                                                                    &&
                                                                    <a
                                                                        className="button"
                                                                        value={applyStatusOption[post.apply_status].value}
                                                                        style={{
                                                                            backgroundColor: applyStatusOption[post.apply_status].color,
                                                                            cursor: "auto",
                                                                            boxShadow: 0,
                                                                        }}
                                                                    >
                                                                        {applyStatusOption[post.apply_status].text}
                                                                    </a>
                                                            }
                                                            {
                                                                // 내가 만든 경기
                                                                this.props.user !== null // check signed in
                                                                && (post.hostID === this.props.user.data[0].iduser) // check host true
                                                                    &&
                                                                    <p>내 경기</p>
                                                            }
                                                            {
                                                                // 신청하기 (비로그인유저)
                                                                this.props.user === null && <p>신청하기(비로그인)</p>
                                                            }
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                    )
                                }
                            }
                        )
                        : <p>경기가 없습니다.</p>
                    }
                </ul>
            </div>
        );
    }
}

export default PostList;