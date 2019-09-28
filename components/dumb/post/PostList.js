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
        applyMatch: () => {},
        depositor: '',
        user: null,
        posts: [],
        postList: [],
        selectedFilter: '전체',
    }

    async componentDidMount() {
        console.log('PostList에서 componentDidMount 실행');
    }

    handlePrompt = (e) => {
        let depositor = prompt('입금자명을 입력하세요.');
        console.log(depositor);
        if (depositor == null) {
            e.preventDefault();
            alert('신청 취소');
            return; 
        }
        if (depositor.length !== 0) {
            if (confirm(`입금자명: '${depositor}' 님이 맞습니까? \n입금자명을 잘 확인해주세요.`)) {
                e.preventDefault();
                this.props.applyMatch(e, depositor);
            } else {
                e.preventDefault();
                alert('신청 취소');
                this.props.applyMatch('');
            }
        } else {
            return this.handlePrompt(e);
        }
    }

    dateAscendingOrder = (a, b) => { // 날짜 오름차순, dateA가 크면 true, dateB가 크거나 같으면 false
        let timeA = new Date(a['start_time']).getTime();
        let timeB = new Date(b['start_time']).getTime();
        return timeA > timeB ? 1 : -1;
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

    render() {
        console.log('PostList에서 render 실행');
        const { posts, selectedFilter } = this.props;

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
                <ul>
                    {
                        posts.length > 0 ? posts.sort(this.dateAscendingOrder).map(
                            (post, i) => {
                                if (selectedFilter == '전체' && post.idmatch != null) {
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
                                                        {`${moment.parseZone(post.start_time).local().format('MM월 DD일')} ${this.convertDay(moment.parseZone(post.start_time).local().format('dddd'))}요일`}
                                                    </h3>
                                                }
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
                                                                <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}       {post.total_guests_available}명남음!
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
                                                                this.props.user !== null // check signed in
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