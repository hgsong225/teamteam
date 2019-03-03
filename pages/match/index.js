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
        axios.get('http://localhost:3333/match', {
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
        axios.get('http://localhost:3333/match/applicants', {
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

    handleApplicant = (e) => {
        e.preventDefault();
        const iduser = e.target.name;
        const applicant_status = e.target.value;
        const { match } = this.state;
        
        console.log(applicant_status, iduser, match[0].idmatch);

        axios.post('http://localhost:3333/match/applicant/status', {
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
                        width: 720px;
                    }
                    .post-box {
                        width: 100%;
                        padding: 0.8rem;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    #intro {
                        width: 100%;
                        height: 100%;
                        padding: 0.8rem;
                        background-color: #f1f1f1;
                        border-radius: 4px;
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
                        text-align: center;
                        margin-top: 20px;
                        width: 100%;
                    }
                    .price {
                        display: flex;
                        width: 10rem;
                        justify-content: center;
                        align-items: center;
                        font-size: 2rem;
                    }
                    .apply-button {
                        cursor: pointer;
                        display: inline-block;
                        text-decoration: none;
                        border: none;
                        background-color: #1e88e5;
                        font-size: 16px;
                        color: white;
                        padding: 8px 120px;
                        text-align: center;
                        box-shadow: 0 6px 6px 0 rgba(0,0,0,0.24);
                    }
                    .apply-button p {
                        margin-bottom: 2px;
                    }
                    .apply {
                        font-size: 1.2rem;
                    }
                    .price-text {
                        font-size: 1rem;
                    }
                    .apply-button:hover {
                        background-color: #42a5f5;
                        box-shadow: 0 12px 12px 0 rgba(0,0,0,0.24)
                    }
                    
                `}</style>
                    <div className="post-container">
                        {
                            match.length > 0 &&
                            <div className="post">
                                <div>
                                    <h3>{match[0].apply_status}, {match[0].total_guest}명 남음</h3>
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
                                        <p>- 입금 확인 후 안내 메시지가 나갑니다.</p>
                                        <p>- 입금자 순으로 신청 확정됩니다.</p>
                                        <p>- 당일 경기 취소시 환불은 불가합니다.</p>
                                    </div>
                                </div>
                                {
                                    this.state.user !== null &&
                                    (
                                        match[0].fb_uid == this.state.user.uid &&
                                        <div>
                                            <h3>신청 상태</h3>
                                            <p>신청 상태는 호스트만 볼 수 있습니다.</p>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>이름</th>
                                                        <th>신청 일시</th>
                                                        <th>신청 상태</th>
                                                        <th>입금 상태</th>
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
                                                    })}
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
                                    : <div className="button-box">
                                        <button className="apply-button">
                                            <p className="apply">신청하기</p>
                                            <p className="price-text">10000원</p>
                                        </button>
                                    </div>
                                )
                            }
                    </div>
                </Layout>
        );
    }
}

export default Match;
