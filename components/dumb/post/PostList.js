import React, { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import moment from 'moment';

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

    render() {
        console.log('PostList에서 render 실행');
        const { posts, selectedFilter } = this.props;

        return (
            <div>
                <Head>
                    <link href="../../static/postlist.css" rel="stylesheet" />
                </Head>
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
                                                            <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}</p>
                                                        </div>
                                                        <div className="match-apply">
                                                            {
                                                                // 신청하기 (로그인유저)
                                                                this.props.user !== null
                                                                && (post.hostID !== this.props.user.data[0].iduser && (post.match_has_users === undefined || post.match_has_users.filter(match_has_user => match_has_user.iduser === this.props.user.data[0].iduser && match_has_user.applicant_status !== '신청취소').length < 1))
                                                                    // && <button
                                                                    //         className="match-apply-button"
                                                                    //         onClick={this.handlePrompt}
                                                                    //         name={post.idmatch}
                                                                    //         type="submit"
                                                                    //         value="신청하기"
                                                                    //     >
                                                                    //         <p className="apply">신청하기</p>
                                                                    //         <p className="price">{post.match_fee}원</p>
                                                                    //     </button>
                                                                    &&
                                                                    <Link
                                                                        href={{ pathname: 'payment', query: { post: post.idpost, match: post.idmatch }}}
                                                                    >
                                                                        <a
                                                                            className="button" value="신청하기"
                                                                        >
                                                                            신청하기
                                                                        </a>
                                                                    </Link>
                                                            }
                                                            {
                                                                // 내가 만든 경기
                                                                this.props.user !== null
                                                                && (post.hostID === this.props.user.data[0].iduser)
                                                                    // && <button
                                                                    //         className="match-edit-button"
                                                                    //         onClick={this.handlePrompt}
                                                                    //         name={post.idmatch}
                                                                    //         type="submit"
                                                                    //         value="수정"
                                                                    //     >
                                                                    //         <p className="apply">경기 수정</p>
                                                                    //     </button>
                                                                    &&
                                                                    <Link
                                                                        href={{ pathname: '/match', query: { id: post.idpost }}}
                                                                    >
                                                                        <a
                                                                            className="button" value="신청하기"
                                                                        >
                                                                            수정하기
                                                                        </a>
                                                                    </Link>
                                                            }
                                                            {
                                                                // 내가 신청한 경기
                                                                this.props.user !== null
                                                                && (post.match_has_users.filter(match_has_user => match_has_user.iduser === this.props.user.data[0].iduser && match_has_user.applicant_status !== '신청취소').length > 0)
                                                                    && <button
                                                                            className="match-apply-cancel-button"
                                                                            onClick={this.handlePrompt}
                                                                            name={post.idmatch}
                                                                            type="submit"
                                                                            value="신청취소"
                                                                        >
                                                                            <p className="apply">신청취소</p>
                                                                        </button>
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