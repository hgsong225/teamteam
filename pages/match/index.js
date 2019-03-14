import React, { Component }from 'react';
import axios from 'axios';

import fb from '../../config/firebase';

import Layout from '../../components/layout/Layout';

class Match extends Component {
    copyTarget = React.createRef()

    state = {
        user: null,
        match: [],
        applicants: [],
    }
    
    componentDidMount() {
        console.log('컴포넌트디드마운트 실행 in match');
        this.authListener();
    }

    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
                this.getApplicants(user);
                this.getMatch();
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    getMatch = () => {
        const self = this;
        const { url } = this.props;
        const params = {
            id: url.query.id,
        };
        axios.get('http://localhost:3333/api/match', {
            params,
        })
        .then((res) => {
            self.setState({
                match: res.data,
            });
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    getApplicants = (user) => {
        const self = this;
        const { url } = this.props;
        console.log(user);
        const params = {
            uid: user.uid,
            id: url.query.id,
        };
        axios.get('http://localhost:3333/api/match/applicants', {
            params,
        })
        .then((res) => {
            self.setState({
                applicants: res.data,
            });
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    handleApplicant = (e) => { // 신청 관리
        e.preventDefault();
        const iduser = e.target.name;
        const applicant_status = e.target.value;
        const { match } = this.state;
        
        console.log(applicant_status, iduser, match[0].idmatch);

        axios.post('http://localhost:3333/api/match/applicant/status', {
            data: {
                applicant_status,
                idmatch: match[0].idmatch,
                iduser: Number(iduser)
            }
        })
        .then((res) => {
            this.getApplicants(user);
            console.log(res.data);
        })
        .catch((err) => console.log(err));
    }

    render() {
        const { match, applicants } = this.state;
        return (
                <Layout>
                    <style jsx>{`
                        .post-container {
                            max-width: 720px;
                        }
                        .notice-box {
                            margin-top: 2rem;
                            margin-bottom: 2rem;
                        }
                        .notice {
                            font-size: 2rem;
                            margin: 0;
                            margin-bottom: 2rem;
                        }
                        .post-box {
                            margin-bottom: 1.5rem;
                            padding: 0.5rem;
                            border-bottom: 1px solid #e0e0e0;
                        }
                        #intro {
                            height: 100%;
                            padding: 0.9rem;
                            background-color: #fafafa;
                            border-radius: 4px;
                            line-height: 1.5;
                        }
                        .desc-title {
                            font-size: 0.9rem;
                            color: #9e9e9e;
                        }
                        .place {
                            margin-bottom: 0rem;
                        }
                        .info {
                            font-size: 1.2rem;
                        }
                        .address #copy{
                            font-size: 0.9rem;
                        }
                        #copy {
                            color: #42a5f5;
                            cursor: pointer;
                        }
                        .button-box {
                            display: flex;
                            justify-content: space-around;
                            margin-top: 20px;
                            width: 100%;
                        }
                        input[type=submit] {
                            width: 160px;
                            background-color: #2196f3;
                            color: #fff;
                            cursor: pointer;
                            outline: none;
                            border: none;
                        }
                        input[type=submit]:hover {
                            box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                        }
                        select, input {
                            margin-bottom: 0.5rem;
                            width: 100%;
                            max-width: 550px;
                            height: 50px;
                            font-size: 16px;
                            color: #212121;
                            padding: 10px;
                            border: 1px solid #e0e0e0;
                            border-radius: 4px;
                        }
                        input {
                            box-sizing: border-box;
                        }
                        .apply-button {
                            width: 160px;
                            outline: none;
                            margin: 0;
                            cursor: pointer;
                            display: inline-block;
                            text-decoration: none;
                            border: none;
                            background-color: #1e88e5;
                            font-size: 16px;
                            color: white;
                            padding: 1px 120px;
                            text-align: center;
                            box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                        }
                        .apply {
                            margin-bottom: 8px;
                            font-size: 1.2rem;
                        }
                        .price-text {
                            margin-top: 0px;
                            font-size: 1rem;
                        }
                        .apply-button:hover {
                            background-color: #42a5f5;
                            box-shadow: 0 12px 12px 0 rgba(0,0,0,0.24)
                        }
                        @media screen and (max-width: 414px) {
                            .button-box {
                                z-index: 4;
                                position: fixed;
                                left: 0;
                                bottom: 0;
                                justify-content: center;
                                width: 100%;
                                padding: 20px 0;
                                border-top: 1px solid #e1e1e1;
                                background-color: #fafafa;
                            }
                        }
                    `}</style>
                    <div className="post-container">
                        {
                            match.length > 0 &&
                            <div className="post">
                                <div className="notice-box">
                                    <p className="notice">{match[0].apply_status}, {match[0].total_guest}명 남음</p>
                                </div>
                                <div id="intro">
                                    <p>{match[0].display_name}</p>
                                    <div>
                                        <p>{match[0].contents}</p>
                                    </div>
                                </div>
                                <div className="post-box">
                                    <h3>경기 정보</h3>
                                    <div>
                                        <p className="desc-title">경기장</p>
                                        <p className="info place">{match[0].place_name}</p>
                                        <span
                                            className="address"
                                            ref={this.copyTarget}
                                            value={match[0].address}
                                        >
                                            {match[0].address} 
                                        </span>
                                        <span
                                            id="copy"
                                            onClick={this.copy}
                                        >
                                        주소 복사</span>
                                    </div>
                                    <div>
                                        <p className="desc-title">경기 일시</p>
                                        <p className="info">{match[0].start_time.slice(0, 4)}년 {match[0].start_time.slice(5, 7)}월 {match[0].start_time.slice(8, 10)}일 {match[0].start_time.slice(11, 16)} - {match[0].end_time.slice(11, 16)}</p>
                                    </div>
                                    <div>
                                        <p className="desc-title">종목</p>
                                        <p className="info">{match[0].sports_category} {match[0].match_type} : {match[0].match_type}</p>
                                    </div>
                                </div>
                                <div className="post-box">
                                    <h3>결제</h3>
                                    <p>o 계좌 이체</p>
                                    <div>
                                        <p className="desc-title">입금 계좌</p>
                                        <p className="info">신한 110-439-532672 팀팀</p>
                                        <p>- 입금자 순으로 신청 확정됩니다.</p>
                                        <p>- 당일 경기 취소시 환불은 불가합니다.</p>
                                        <p>- 입금 확인 후프로필에 등록하신 연락처로 경기 안내가 발송됩니다.</p>
                                        <p>- 입금 확인 후 경기 주최자의 연락처가 공개됩니다.</p>
                                    </div>
                                </div>
                                {
                                    this.state.user !== null &&
                                    (
                                        match[0].fb_uid == this.state.user.uid &&
                                        <div className="post-box">
                                            <h3>신청 상태</h3>
                                            <p>신청 상태는 호스트만 볼 수 있습니다.</p>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>이름</th>
                                                        <th>신청 일시</th>
                                                        <th>신청 상태</th>
                                                        <th>입금 상태</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        applicants.length > 0 &&
                                                        applicants.map((applicant, i) => {
                                                            return (
                                                                <tr
                                                                    key={i * 2}
                                                                >
                                                                    <td>{applicant.name}</td>
                                                                    <td>{applicant.apply_time}</td>
                                                                    <td>{applicant.applicant_status}</td>
                                                                    <td>{applicant.payment_status}</td>
                                                                    <td>
                                                                        <button
                                                                            onClick={this.handleApplicant}
                                                                            name={applicant.user_iduser}
                                                                            value="승인"
                                                                        >
                                                                            수락
                                                                        </button>
                                                                        <button
                                                                            onClick={this.handleApplicant}
                                                                            name={applicant.user_iduser}
                                                                            value="거절"
                                                                        >
                                                                            거절
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })
                                                    }
                                                    {
                                                        applicants.length == 0 &&
                                                        <p>신청자가 없습니다.</p>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                            </div>
                        }
                            {
                                (match.length > 0 && this.state.user !== null) &&
                                (
                                    match[0].fb_uid == this.state.user.uid
                                    ? <div>
                                        <button>수정하기</button>
                                        <button>경기 삭제</button>
                                    </div>
                                    // 신청 취소, 신청 상태 보여주기
                                    : <div className="button-box">
                                        <input
                                            className="apply"
                                            value="신청하기"
                                            type="submit"
                                        />
                                    </div>
                                )
                            }
                    </div>
                </Layout>
        );
    }
}

export default Match;
