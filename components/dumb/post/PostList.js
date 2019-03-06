import React, { Component } from 'react';
import Link from 'next/link';

class PostList extends Component {
    static defaultProps = {
        applyMatch: () => {},
        depositor: '',
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

    dateAscending = (a, b) => { // 날짜 오름차순, dateA가 크면 true, dateB가 크거나 같으면 false
        let timeA = new Date(a['start_time']).getTime();
        let timeB = new Date(b['start_time']).getTime();
        return timeA > timeB ? 1 : -1;
    }

    convertDay = (day_number) => {
        const dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];

        return dayOfTheWeek[day_number];
    }

    render() {
        console.log('PostList에서 render 실행');
        const { posts, selectedFilter } = this.props;

        return (
            <div>
                <style jsx>{`
                    ul {
                        list-style-type: none;
                        margin: 0;
                        padding: 0;
                    }
                    .match {
                        display: flex;
                        justify-content: space-around;
                        width: 100%;
                        height: 5rem;
                        padding: 6px 0;
                        background-color: #f1f1f1;
                        margin-bottom: 1rem;
                        align-items: center;
                    }
                    .match_date {
                        margin-top: 2rem;
                        font-size: 1.2rem;
                        font-weight: 600;
                        color: #424242;
                    }
                    .match-time {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 80%;
                        padding: 0 6px;
                        color: #424242;
                        font-size: 1.5rem;
                        font-weight: 600;
                        letter-spacing: 0.25rem;
                    }
                    .match-place {
                        display: flex;
                        height: 80%;
                        padding: 0 6px;
                        justify-content: center;
                        flex-direction: column;
                        color: #212121;
                    }
                    .place {
                        margin: 0;
                        padding-bottom: 0.5rem;
                        width: 100%;
                        font-size: 1rem;
                    }
                    .match-type {
                        margin: 0;
                        width: 100%;
                        font-size: 0.8rem;
                        color: #757575;
                    }
                    .match-apply {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0 6px;
                    }
                    .match-apply-button {
                        margin: 0;
                        cursor: pointer;
                        text-decoration: none;
                        border: none;
                        background-color: #2196f3;
                        color: white;
                        padding: 1px 40px;
                    }
                    .apply, .price {
                        margin: 0;
                    }
                    .apply {
                        margin-top: 0.5rem;
                        font-size: 1rem;
                    }
                    .price {
                        margin-top: 0.5rem;
                        margin-bottom: 0.5rem;
                    }
                    
                    .match-apply-button:hover {
                        background-color: #42a5f5;
                    }
                    
                    @media screen and (max-width: 457px) {
                        .match-apply-button {
                            padding: 1px 20px;
                        }
                    }
                    @media screen and (max-width: 375px) {
                        .match-apply-button {
                            padding: 1px 20px;
                        }
                    }
                `}</style>
                <ul>
                    {
                        posts ? posts.sort(this.dateAscending).map(
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
                                                        {post.start_time.slice(5, 7)}월 {post.start_time.slice(8, 10)}일 {this.convertDay(new Date(post.start_time).getDay())}요일
                                                    </h3>
                                                }
                                                <Link
                                                    prefetch
                                                    key={post.idpost}
                                                    href={{ pathname: '/match', query: { id: post.idpost }}}
                                                >
                                                    <div className="match">
                                                        <div className="match-time">
                                                            {post.start_time.slice(11, 16)}
                                                        </div>
                                                        <div className="match-place">
                                                            <p className="place">{post.place_name}</p>
                                                            <p className="match-type">
                                                            <span className="">{post.sports_category}</span> {post.match_type} : {post.match_type}</p>
                                                        </div>
                                                        <div className="match-apply">
                                                            {
                                                                post.applicant_status != null
                                                                ? post.applicant_status
                                                                : 
                                                                    <button
                                                                        className="match-apply-button"
                                                                        onClick={this.handlePrompt}
                                                                        name={post.idmatch}
                                                                        type="submit"
                                                                        value="신청하기"
                                                                    >
                                                                        <p className="apply">신청하기</p>
                                                                        <p className="price">{post.match_fee}원</p>
                                                                    </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                    )
                                }
                            }
                        )
                        : <p>경기가 없습니다 ㅠㅠ</p>
                    }
                </ul>
            </div>
        );
    }
}

export default PostList;